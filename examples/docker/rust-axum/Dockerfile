# SPDX-FileCopyrightText: 2024-2026 Temps Contributors
# SPDX-License-Identifier: MIT OR Apache-2.0

FROM rust:1.98.1-alpine AS builder
WORKDIR /app

RUN apk add --no-cache musl-dev pkgconfig openssl-dev

COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release --locked
RUN rm -rf src

COPY src ./src
RUN touch src/main.rs && cargo build --release --locked

FROM alpine:3.21
RUN apk add --no-cache ca-certificates wget
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/target/release/rust-axum /usr/local/bin/server

USER appuser
EXPOSE 3000

CMD ["server"]
