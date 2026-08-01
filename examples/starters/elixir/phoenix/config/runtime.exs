import Config

# Temps injects PORT. Binding 0.0.0.0 is what makes the container reachable.
port = String.to_integer(System.get_env("PORT") || "4000")

config :hello, HelloWeb.Endpoint,
  http: [ip: {0, 0, 0, 0}, port: port],
  secret_key_base: System.get_env("SECRET_KEY_BASE") || String.duplicate("a", 64),
  server: true
