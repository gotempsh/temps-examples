var builder = WebApplication.CreateBuilder(args);
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var app = builder.Build();
app.MapGet("/", () => Results.Json(new { runtime = "dotnet", status = "ok" }));
app.MapGet("/health", () => Results.Text("ok"));
app.Run();
