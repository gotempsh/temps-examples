#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2024-2026 Temps Contributors
# SPDX-License-Identifier: MIT OR Apache-2.0

"""Build the starter's artifact and check its real production HTTP response."""

import argparse
import json
from pathlib import Path
import subprocess
import tempfile
import time
import urllib.error
import urllib.request
import uuid


JAVA_DOCKERFILE = """# SPDX-FileCopyrightText: 2024-2026 Temps Contributors
# SPDX-License-Identifier: MIT OR Apache-2.0
FROM gradle:8.12-jdk21 AS builder
WORKDIR /app
COPY . .
RUN gradle --no-daemon clean bootJar
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
USER 1001:1001
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
"""


def docker(*args, capture=False):
    return subprocess.run(
        ["docker", *args], check=True, text=True, capture_output=capture
    ).stdout


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("starter", choices=["dockerfile", "java/spring-boot"])
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    context = root / "examples/starters" / args.starter
    owned = "temps-starter-smoke-" + uuid.uuid4().hex
    image = owned + ":test"
    port = "8123"  # Verify PORT rather than accidentally relying on the default.
    expected = (
        "Hello from custom Dockerfile!"
        if args.starter == "dockerfile"
        else "Hello from Spring Boot on Temps!"
    )
    try:
        with tempfile.TemporaryDirectory(prefix=owned) as temp:
            if args.starter == "dockerfile":
                docker("build", "-t", image, str(context))
            else:
                dockerfile = Path(temp) / "Dockerfile"
                dockerfile.write_text(JAVA_DOCKERFILE)
                docker("build", "-f", str(dockerfile), "-t", image, str(context))
        docker(
            "run", "-d", "--name", owned, "-e", "PORT=" + port,
            "-p", "127.0.0.1::" + port, image,
        )
        published = docker("port", owned, port + "/tcp", capture=True).strip()
        url = "http://" + published + "/"
        for _ in range(90):
            if docker("inspect", "-f", "{{.State.Running}}", owned, capture=True).strip() != "true":
                raise RuntimeError("Starter exited before answering HTTP")
            try:
                with urllib.request.urlopen(url, timeout=2) as response:
                    body = response.read(16384)
                    assert response.status == 200, response.status
                    assert json.loads(body)["message"] == expected, body
                assert docker("exec", owned, "id", "-u", capture=True).strip() != "0"
                print(f"PASS {args.starter}: HTTP 200 with expected application marker; non-root; PORT={port}")
                return
            except (urllib.error.URLError, ConnectionError, TimeoutError):
                time.sleep(1)
        raise RuntimeError("Starter did not answer HTTP within 90 seconds")
    except Exception:
        subprocess.run(["docker", "logs", owned], check=False)
        raise
    finally:
        # Every name is unique to this invocation; shared resources are untouched.
        subprocess.run(["docker", "rm", "-f", owned], check=False)
        subprocess.run(["docker", "image", "rm", image], check=False)


if __name__ == "__main__":
    main()
