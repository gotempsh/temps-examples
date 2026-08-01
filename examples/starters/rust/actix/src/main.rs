use actix_web::{web, App, HttpServer, HttpResponse};
use serde_json::json;
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port: u16 = env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .expect("PORT must be a number");

    println!("Listening on port {}", port);

    HttpServer::new(|| {
        App::new()
            .route("/", web::get().to(|| async {
                HttpResponse::Ok().json(json!({"message": "Hello from Actix on Temps!"}))
            }))
            .route("/health", web::get().to(|| async {
                HttpResponse::Ok().json(json!({"status": "ok"}))
            }))
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
