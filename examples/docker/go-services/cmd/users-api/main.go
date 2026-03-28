package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Bio       string    `json:"bio"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateUserRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Bio      string `json:"bio"`
}

var pool *pgxpool.Pool

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	dbURL := os.Getenv("POSTGRES_URL")
	if dbURL == "" {
		dbURL = "postgresql://app:secret@localhost:5432/services?sslmode=disable"
	}

	var err error
	pool, err = pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer pool.Close()

	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/api/users", usersHandler)
	mux.HandleFunc("/api/users/", userByIDHandler)

	log.Printf("Users API listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, corsMiddleware(mux)))
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	err := pool.Ping(context.Background())
	status := "ok"
	dbStatus := "connected"
	code := http.StatusOK
	if err != nil {
		status = "error"
		dbStatus = "disconnected"
		code = http.StatusServiceUnavailable
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{
		"status":   status,
		"database": dbStatus,
		"service":  "users-api",
	})
}

func usersHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		rows, err := pool.Query(context.Background(),
			"SELECT id, username, email, bio, created_at, updated_at FROM users ORDER BY created_at DESC")
		if err != nil {
			http.Error(w, `{"error":"database error"}`, http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var users []User
		for rows.Next() {
			var u User
			if err := rows.Scan(&u.ID, &u.Username, &u.Email, &u.Bio, &u.CreatedAt, &u.UpdatedAt); err != nil {
				continue
			}
			users = append(users, u)
		}
		if users == nil {
			users = []User{}
		}
		json.NewEncoder(w).Encode(users)

	case http.MethodPost:
		var req CreateUserRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
			return
		}
		var u User
		err := pool.QueryRow(context.Background(),
			"INSERT INTO users (username, email, bio) VALUES ($1, $2, $3) RETURNING id, username, email, bio, created_at, updated_at",
			req.Username, req.Email, req.Bio,
		).Scan(&u.ID, &u.Username, &u.Email, &u.Bio, &u.CreatedAt, &u.UpdatedAt)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error":"%s"}`, err.Error()), http.StatusBadRequest)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(u)

	default:
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
	}
}

func userByIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	idStr := strings.TrimPrefix(r.URL.Path, "/api/users/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, `{"error":"invalid id"}`, http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodGet:
		var u User
		err := pool.QueryRow(context.Background(),
			"SELECT id, username, email, bio, created_at, updated_at FROM users WHERE id = $1", id,
		).Scan(&u.ID, &u.Username, &u.Email, &u.Bio, &u.CreatedAt, &u.UpdatedAt)
		if err != nil {
			http.Error(w, `{"error":"user not found"}`, http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(u)

	case http.MethodDelete:
		tag, err := pool.Exec(context.Background(), "DELETE FROM users WHERE id = $1", id)
		if err != nil || tag.RowsAffected() == 0 {
			http.Error(w, `{"error":"user not found"}`, http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(map[string]bool{"deleted": true})

	default:
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
	}
}
