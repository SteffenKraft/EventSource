package main

import (
	"bufio"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

// Channels to send progress and count updates
var progressChan = make(chan string)
var countChan = make(chan string)

// SSE Handler
func sseHandler(w http.ResponseWriter, r *http.Request) {
	// Set headers for SSE
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	// Send the current date every seconds
	go func() {
		for {
			fmt.Fprintf(w, "data: date|%s\n\n", time.Now().Format(time.RFC3339))
			flusher.Flush()
			time.Sleep(time.Second)
		}
	}()

	// Listen for progress and count updates and send them as SSE
	for {
		select {
		case progress := <-progressChan:
			fmt.Fprintf(w, "data: progress|%s\n\n", progress)
			flusher.Flush()
		case count := <-countChan:
			fmt.Fprintf(w, "data: count|%s\n\n", count)
			flusher.Flush()
		}
	}
}

func main() {
	// Start the SSE handler
	http.HandleFunc("/api/sse", sseHandler)

	// Start the server in a goroutine
	go func() {
		fmt.Println("Server running on http://localhost:4000")
		log.Fatal(http.ListenAndServe(":4000", nil))
	}()

	// Listen for console input to send progress and count updates
	scanner := bufio.NewScanner(os.Stdin)
	fmt.Println("Enter 'p <value>' to send progress updates or 'c <value>' to send count updates (type 'exit' to quit):")

	for scanner.Scan() {
		text := scanner.Text()
		if text == "exit" {
			close(progressChan)
			close(countChan)
			break
		}

		// Check for progress or count commands
		if len(text) > 2 {
			if text[0] == 'p' && text[1] == ' ' {
				progressChan <- text[2:]
			} else if text[0] == 'c' && text[1] == ' ' {
				countChan <- text[2:]
			}
		}
	}

	fmt.Println("Server stopped.")
}
