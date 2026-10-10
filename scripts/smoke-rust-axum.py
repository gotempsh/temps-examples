#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2024-2026 Temps Contributors
# SPDX-License-Identifier: MIT OR Apache-2.0

"""Build the locked Rust image and verify HTTP CRUD against isolated PostgreSQL."""

import json
from pathlib import Path
import subprocess
import time
import urllib.error
import urllib.request
import uuid


def docker(*args, capture=False, input=None):
    return subprocess.run(
        ["docker", *args], check=True, text=True, capture_output=capture, input=input
    ).stdout


def main():
    context = Path(__file__).resolve().parents[1] / "examples/docker/rust-axum"
    owned = "temps-rust-smoke-" + uuid.uuid4().hex
    database = owned + "-db"
    app = owned + "-api"
    image = owned + ":test"
    password = uuid.uuid4().hex
    image_created = False
    network_created = False
    containers_created = []
    try:
        docker("build", "-t", image, str(context))
        image_created = True
        docker("network", "create", owned)
        network_created = True
        docker(
            "run", "-d", "--name", database, "--network", owned,
            "-e", "POSTGRES_USER=app", "-e", "POSTGRES_DB=notes",
            "-e", "POSTGRES_PASSWORD=" + password, "postgres:17-alpine",
        )
        containers_created.append(database)
        for _ in range(60):
            probe = subprocess.run(
                ["docker", "exec", database, "pg_isready", "-h", "127.0.0.1", "-U", "app", "-d", "notes"],
                capture_output=True,
            )
            if probe.returncode == 0:
                break
            time.sleep(1)
        else:
            raise RuntimeError("Owned PostgreSQL did not become ready")
        docker("exec", "-i", database, "psql", "-v", "ON_ERROR_STOP=1", "-U", "app", "-d", "notes", input=(context / "schema.sql").read_text())
        docker(
            "run", "-d", "--name", app, "--network", owned,
            "-e", f"POSTGRES_URL=postgresql://app:{password}@{database}:5432/notes",
            "-p", "127.0.0.1::3000", image,
        )
        containers_created.append(app)
        base = "http://" + docker("port", app, "3000/tcp", capture=True).strip()

        def request(path, method="GET", data=None):
            req = urllib.request.Request(
                base + path, method=method,
                data=json.dumps(data).encode() if data is not None else None,
                headers={"Content-Type": "application/json"},
            )
            with urllib.request.urlopen(req, timeout=3) as response:
                return response.status, json.load(response)

        for _ in range(60):
            if docker("inspect", "-f", "{{.State.Running}}", app, capture=True).strip() != "true":
                raise RuntimeError("API exited during startup")
            try:
                assert request("/health") == (200, {"status": "ok", "database": "connected"})
                break
            except (urllib.error.URLError, ConnectionError, TimeoutError):
                time.sleep(1)
        else:
            raise RuntimeError("API did not answer within 60 seconds")
        status, note = request("/api/notes", "POST", {"title": owned, "content": "original", "tags": ["smoke"]})
        assert status == 201
        note_path = "/api/notes/" + str(uuid.UUID(note["id"]))
        assert request(note_path)[1]["title"] == owned
        assert request(note_path, "PATCH", {"content": "updated"})[1]["content"] == "updated"
        persisted = docker("exec", database, "psql", "-U", "app", "-d", "notes", "-tAc", "SELECT content FROM notes WHERE id = '" + note["id"] + "'", capture=True)
        assert persisted.strip() == "updated", persisted
        assert any(item["id"] == note["id"] for item in request("/api/notes?tag=smoke")[1])
        assert request(note_path, "DELETE") == (200, {"deleted": True})
        assert docker("exec", app, "id", "-u", capture=True).strip() != "0"
        print("PASS Rust Axum: locked Docker build, PostgreSQL health, create/read/update/SQL readback/list/delete, non-root runtime")
    except Exception:
        for name in (app, database):
            subprocess.run(["docker", "logs", name], check=False)
        raise
    finally:
        for name in reversed(containers_created):
            subprocess.run(["docker", "rm", "-fv", name], check=False)
        if network_created:
            subprocess.run(["docker", "network", "rm", owned], check=False)
        if image_created:
            subprocess.run(["docker", "image", "rm", image], check=False)


if __name__ == "__main__":
    main()
