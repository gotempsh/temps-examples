# Drop runtime fixtures

Minimal HTTP applications used to verify Temps `/drop` preset detection and
zero-config deployments. Every fixture:

- uses only its ecosystem's standard project manifest;
- reads the listening port from `PORT`;
- serves runtime metadata from `/`;
- returns `200 OK` from `/health`;
- intentionally has no `Dockerfile` or Temps configuration.

| Fixture | Manifest | Expected preset |
| --- | --- | --- |
| [.NET](./dotnet) | `DropFixture.csproj` | .NET / Nixpacks C# |
| [Java](./java) | `pom.xml` | Java |
| [Python](./python) | `requirements.txt` | Python |
| [Rust](./rust) | `Cargo.toml` | Rust |
| [Go](./go) | `go.mod` | Go |

These projects are intentionally small so compatibility tests can package one
directory, deploy it, verify it, delete the project and its containers, then
move to the next runtime without retaining build artifacts.

Run the complete matrix against a local Temps instance:

```bash
TEMPS_API_URL=http://127.0.0.1:8131 \
TEMPS_EMAIL=dev@temps.sh \
TEMPS_PASSWORD='your-password' \
../../scripts/test-drop-runtime-fixtures.sh
```

The runner keeps archives and cookies in a temporary directory and removes
them when it exits. Each successfully created project is deleted after its
runtime response is verified.
