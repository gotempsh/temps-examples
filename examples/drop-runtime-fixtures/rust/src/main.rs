use std::env;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};

fn respond(mut stream: TcpStream) -> std::io::Result<()> {
    let mut request = [0_u8; 1024];
    let bytes_read = stream.read(&mut request)?;
    let health = request[..bytes_read].starts_with(b"GET /health ");
    let (content_type, body) = if health {
        ("text/plain", "ok")
    } else {
        ("application/json", r#"{"runtime":"rust","status":"ok"}"#)
    };
    let response = format!(
        "HTTP/1.1 200 OK\r\nContent-Type: {content_type}\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{body}",
        body.len()
    );
    stream.write_all(response.as_bytes())
}

fn main() -> std::io::Result<()> {
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let listener = TcpListener::bind(format!("0.0.0.0:{port}"))?;
    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                if let Err(error) = respond(stream) {
                    eprintln!("request failed: {error}");
                }
            }
            Err(error) => eprintln!("connection failed: {error}"),
        }
    }
    Ok(())
}
