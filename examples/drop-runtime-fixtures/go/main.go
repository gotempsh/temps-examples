package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/", func(response http.ResponseWriter, request *http.Request) {
		response.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(response).Encode(map[string]string{
			"runtime": "go",
			"status":  "ok",
		}); err != nil {
			log.Printf("write response: %v", err)
		}
	})
	http.HandleFunc("/health", func(response http.ResponseWriter, request *http.Request) {
		_, _ = fmt.Fprint(response, "ok")
	})

	log.Printf("listening on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
