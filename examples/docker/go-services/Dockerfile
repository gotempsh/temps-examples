FROM golang:1.24-alpine AS builder
ARG SERVICE
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download && go mod tidy

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app/server ./cmd/${SERVICE}

FROM alpine:3.21
RUN apk add --no-cache ca-certificates wget
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/server /usr/local/bin/server

USER appuser
ENTRYPOINT ["server"]
