FROM rust:1.88-alpine AS builder
WORKDIR /app

RUN apk add --no-cache musl-dev pkgconfig openssl-dev

COPY Cargo.toml ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

COPY src ./src
RUN touch src/main.rs && cargo build --release

FROM alpine:3.21
RUN apk add --no-cache ca-certificates wget
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/target/release/rust-axum /usr/local/bin/server

USER appuser
EXPOSE 3000

CMD ["server"]
