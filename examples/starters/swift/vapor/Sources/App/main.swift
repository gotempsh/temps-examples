import Vapor

var env = try Environment.detect()
let app = Application(env)
defer { app.shutdown() }

// Vapor defaults to 127.0.0.1, which is unreachable from outside a container.
// Temps injects PORT, so bind to it on all interfaces.
app.http.server.configuration.hostname = "0.0.0.0"
app.http.server.configuration.port = Environment.get("PORT").flatMap(Int.init) ?? 8080

app.get { _ in
    ["message": "Hello from Vapor on Temps!"]
}

app.get("health") { _ in
    ["status": "ok"]
}

try app.run()
