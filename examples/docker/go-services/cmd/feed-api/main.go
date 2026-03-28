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

	"github.com/redis/go-redis/v9"
)

type FeedItem struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Action    string    `json:"action"`
	Target    string    `json:"target"`
	Timestamp time.Time `json:"timestamp"`
}

var rdb *redis.Client
var ctx = context.Background()

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3002"
	}

	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://localhost:6379"
	}

	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		log.Fatalf("Invalid redis URL: %v", err)
	}
	rdb = redis.NewClient(opt)

	// Seed some data
	seedFeed()

	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/api/feed", feedHandler)
	mux.HandleFunc("/api/feed/", feedByUserHandler)

	log.Printf("Feed API listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, corsMiddleware(mux)))
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	err := rdb.Ping(ctx).Err()
	status := "ok"
	redisStatus := "connected"
	code := http.StatusOK
	if err != nil {
		status = "error"
		redisStatus = "disconnected"
		code = http.StatusServiceUnavailable
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{
		"status":  status,
		"redis":   redisStatus,
		"service": "feed-api",
	})
}

func feedHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		// Get global feed (latest 50 items across all users)
		keys, err := rdb.Keys(ctx, "feed:*").Result()
		if err != nil {
			http.Error(w, `{"error":"redis error"}`, http.StatusInternalServerError)
			return
		}

		var allItems []FeedItem
		for _, key := range keys {
			items, err := getItemsFromKey(key, 10)
			if err != nil {
				continue
			}
			allItems = append(allItems, items...)
		}

		// Sort by timestamp desc (simple bubble for small sets)
		for i := 0; i < len(allItems); i++ {
			for j := i + 1; j < len(allItems); j++ {
				if allItems[j].Timestamp.After(allItems[i].Timestamp) {
					allItems[i], allItems[j] = allItems[j], allItems[i]
				}
			}
		}

		if len(allItems) > 50 {
			allItems = allItems[:50]
		}
		if allItems == nil {
			allItems = []FeedItem{}
		}
		json.NewEncoder(w).Encode(allItems)

	case http.MethodPost:
		var item FeedItem
		if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
			http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
			return
		}

		item.Timestamp = time.Now().UTC()
		item.ID = fmt.Sprintf("%d", item.Timestamp.UnixNano())

		data, _ := json.Marshal(item)
		score := float64(item.Timestamp.Unix())
		key := "feed:" + item.UserID

		if err := rdb.ZAdd(ctx, key, redis.Z{Score: score, Member: string(data)}).Err(); err != nil {
			http.Error(w, `{"error":"redis error"}`, http.StatusInternalServerError)
			return
		}

		// Trim to keep only latest 100 items per user
		rdb.ZRemRangeByRank(ctx, key, 0, -101)

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(item)

	default:
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
	}
}

func feedByUserHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userID := strings.TrimPrefix(r.URL.Path, "/api/feed/")
	if userID == "" {
		http.Error(w, `{"error":"user_id required"}`, http.StatusBadRequest)
		return
	}

	limit := 20
	if l := r.URL.Query().Get("limit"); l != "" {
		if n, err := strconv.Atoi(l); err == nil && n > 0 && n <= 100 {
			limit = n
		}
	}

	items, err := getItemsFromKey("feed:"+userID, limit)
	if err != nil {
		http.Error(w, `{"error":"redis error"}`, http.StatusInternalServerError)
		return
	}
	if items == nil {
		items = []FeedItem{}
	}
	json.NewEncoder(w).Encode(items)
}

func getItemsFromKey(key string, limit int) ([]FeedItem, error) {
	results, err := rdb.ZRevRange(ctx, key, 0, int64(limit-1)).Result()
	if err != nil {
		return nil, err
	}

	var items []FeedItem
	for _, raw := range results {
		var item FeedItem
		if err := json.Unmarshal([]byte(raw), &item); err != nil {
			continue
		}
		items = append(items, item)
	}
	return items, nil
}

func seedFeed() {
	// Only seed if empty
	count, _ := rdb.Keys(ctx, "feed:*").Result()
	if len(count) > 0 {
		return
	}

	items := []FeedItem{
		{UserID: "1", Action: "created", Target: "project/temps-deploy"},
		{UserID: "2", Action: "deployed", Target: "service/users-api"},
		{UserID: "1", Action: "commented", Target: "issue/42"},
		{UserID: "3", Action: "merged", Target: "pr/17"},
		{UserID: "2", Action: "reviewed", Target: "pr/18"},
	}

	for i, item := range items {
		item.Timestamp = time.Now().UTC().Add(-time.Duration(i) * time.Minute)
		item.ID = fmt.Sprintf("%d", item.Timestamp.UnixNano())
		data, _ := json.Marshal(item)
		rdb.ZAdd(ctx, "feed:"+item.UserID, redis.Z{
			Score:  float64(item.Timestamp.Unix()),
			Member: string(data),
		})
	}
}
