FROM golang:1.24-alpine AS builder
WORKDIR /app

COPY . .
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app/server ./cmd/users-api

FROM alpine:3.21
RUN apk add --no-cache ca-certificates wget
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/server /usr/local/bin/server

USER appuser
EXPOSE 3001

CMD ["server"]
