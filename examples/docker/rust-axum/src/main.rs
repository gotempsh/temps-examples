use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
    routing::{delete, get, patch, post},
    Router,
};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, PgPool};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;
use uuid::Uuid;

#[derive(Clone)]
struct AppState {
    pool: PgPool,
}

#[derive(Serialize, Deserialize, sqlx::FromRow)]
struct Note {
    id: Uuid,
    title: String,
    content: String,
    language: String,
    tags: Vec<String>,
    is_public: bool,
    created_at: chrono::DateTime<chrono::Utc>,
    updated_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Deserialize)]
struct CreateNote {
    title: String,
    content: String,
    #[serde(default = "default_language")]
    language: String,
    #[serde(default)]
    tags: Vec<String>,
    #[serde(default = "default_true")]
    is_public: bool,
}

fn default_language() -> String {
    "plaintext".to_string()
}
fn default_true() -> bool {
    true
}

#[derive(Deserialize)]
struct UpdateNote {
    title: Option<String>,
    content: Option<String>,
    language: Option<String>,
    tags: Option<Vec<String>>,
    is_public: Option<bool>,
}

#[derive(Deserialize)]
struct ListParams {
    tag: Option<String>,
    language: Option<String>,
    limit: Option<i64>,
}

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    database: String,
}

#[derive(Serialize)]
struct DeleteResponse {
    deleted: bool,
}

#[derive(Serialize, sqlx::FromRow)]
struct TagCount {
    name: String,
    count: i64,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let database_url = std::env::var("POSTGRES_URL")
        .unwrap_or_else(|_| "postgresql://app:secret@localhost:5432/notes".to_string());

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await
        .expect("Failed to connect to database");

    let state = AppState { pool };

    let app = Router::new()
        .route("/health", get(health))
        .route("/api/notes", get(list_notes).post(create_note))
        .route(
            "/api/notes/{id}",
            get(get_note).patch(update_note).delete(delete_note),
        )
        .route("/api/tags", get(list_tags))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    tracing::info!("Listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health(State(state): State<AppState>) -> Json<HealthResponse> {
    let db_status = match sqlx::query("SELECT 1").execute(&state.pool).await {
        Ok(_) => "connected".to_string(),
        Err(_) => "disconnected".to_string(),
    };
    Json(HealthResponse {
        status: if db_status == "connected" {
            "ok".to_string()
        } else {
            "error".to_string()
        },
        database: db_status,
    })
}

async fn list_notes(
    State(state): State<AppState>,
    Query(params): Query<ListParams>,
) -> Result<Json<Vec<Note>>, StatusCode> {
    let limit = params.limit.unwrap_or(50).min(100);

    let notes = match (&params.tag, &params.language) {
        (Some(tag), Some(lang)) => {
            sqlx::query_as::<_, Note>(
                "SELECT * FROM notes WHERE $1 = ANY(tags) AND language = $2 ORDER BY created_at DESC LIMIT $3",
            )
            .bind(tag)
            .bind(lang)
            .bind(limit)
            .fetch_all(&state.pool)
            .await
        }
        (Some(tag), None) => {
            sqlx::query_as::<_, Note>(
                "SELECT * FROM notes WHERE $1 = ANY(tags) ORDER BY created_at DESC LIMIT $2",
            )
            .bind(tag)
            .bind(limit)
            .fetch_all(&state.pool)
            .await
        }
        (None, Some(lang)) => {
            sqlx::query_as::<_, Note>(
                "SELECT * FROM notes WHERE language = $1 ORDER BY created_at DESC LIMIT $2",
            )
            .bind(lang)
            .bind(limit)
            .fetch_all(&state.pool)
            .await
        }
        (None, None) => {
            sqlx::query_as::<_, Note>(
                "SELECT * FROM notes ORDER BY created_at DESC LIMIT $1",
            )
            .bind(limit)
            .fetch_all(&state.pool)
            .await
        }
    };

    notes
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

async fn create_note(
    State(state): State<AppState>,
    Json(input): Json<CreateNote>,
) -> Result<(StatusCode, Json<Note>), StatusCode> {
    let note = sqlx::query_as::<_, Note>(
        "INSERT INTO notes (title, content, language, tags, is_public) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    )
    .bind(&input.title)
    .bind(&input.content)
    .bind(&input.language)
    .bind(&input.tags)
    .bind(input.is_public)
    .fetch_one(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((StatusCode::CREATED, Json(note)))
}

async fn get_note(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<Note>, StatusCode> {
    sqlx::query_as::<_, Note>("SELECT * FROM notes WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

async fn update_note(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(input): Json<UpdateNote>,
) -> Result<Json<Note>, StatusCode> {
    let existing = sqlx::query_as::<_, Note>("SELECT * FROM notes WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    let note = sqlx::query_as::<_, Note>(
        "UPDATE notes SET title = $1, content = $2, language = $3, tags = $4, is_public = $5, updated_at = NOW() WHERE id = $6 RETURNING *",
    )
    .bind(input.title.unwrap_or(existing.title))
    .bind(input.content.unwrap_or(existing.content))
    .bind(input.language.unwrap_or(existing.language))
    .bind(input.tags.unwrap_or(existing.tags))
    .bind(input.is_public.unwrap_or(existing.is_public))
    .bind(id)
    .fetch_one(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(note))
}

async fn delete_note(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<DeleteResponse>, StatusCode> {
    let result = sqlx::query("DELETE FROM notes WHERE id = $1")
        .bind(id)
        .execute(&state.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if result.rows_affected() == 0 {
        return Err(StatusCode::NOT_FOUND);
    }

    Ok(Json(DeleteResponse { deleted: true }))
}

async fn list_tags(State(state): State<AppState>) -> Result<Json<Vec<TagCount>>, StatusCode> {
    let tags = sqlx::query_as::<_, TagCount>(
        "SELECT unnest(tags) as name, COUNT(*) as count FROM notes GROUP BY name ORDER BY count DESC",
    )
    .fetch_all(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(tags))
}
