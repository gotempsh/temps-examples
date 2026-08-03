#!/usr/bin/env bash

set -uo pipefail

API_URL="${TEMPS_API_URL:-http://127.0.0.1:8131}"
FIXTURES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../examples/drop-runtime-fixtures" && pwd)"
MANIFEST="$FIXTURES_DIR/fixtures.json"
POLL_INTERVAL="${TEMPS_POLL_INTERVAL:-5}"
POLL_ATTEMPTS="${TEMPS_POLL_ATTEMPTS:-120}"
ONLY_FIXTURE="${TEMPS_FIXTURE:-}"
DATA_DIR="${TEMPS_DATA_DIR:-}"
TEMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/temps-drop-fixtures.XXXXXX")"
COOKIE_JAR="$TEMP_DIR/cookies.txt"
FAILURES=0
ACTIVE_PROJECT_ID=""

cleanup_project() {
  local project_id="$1"
  [[ -n "$project_id" ]] || return 0
  curl -sS --fail-with-body -o /dev/null -b "$COOKIE_JAR" -X DELETE \
    "$API_URL/api/projects/$project_id"
}

cleanup_all() {
  cleanup_project "$ACTIVE_PROJECT_ID" || true
  rm -rf "$TEMP_DIR"
}

cleanup_active_project() {
  if cleanup_project "$ACTIVE_PROJECT_ID"; then
    ACTIVE_PROJECT_ID=""
    return 0
  fi
  echo "FAIL cleanup: could not delete project $ACTIVE_PROJECT_ID" >&2
  return 1
}
trap cleanup_all EXIT

for command in curl jq zip; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "missing required command: $command" >&2
    exit 1
  fi
done

if [[ -z "${TEMPS_EMAIL:-}" || -z "${TEMPS_PASSWORD:-}" ]]; then
  echo "TEMPS_EMAIL and TEMPS_PASSWORD are required" >&2
  exit 1
fi

login_status="$(curl -sS -o "$TEMP_DIR/login.json" -w '%{http_code}' \
  -c "$COOKIE_JAR" \
  -H 'content-type: application/json' \
  --data "$(jq -nc --arg email "$TEMPS_EMAIL" --arg password "$TEMPS_PASSWORD" \
    '{email: $email, password: $password}')" \
  "$API_URL/api/auth/login")"
if [[ "$login_status" != "200" ]]; then
  echo "login failed ($login_status): $(cat "$TEMP_DIR/login.json")" >&2
  exit 1
fi

while IFS= read -r fixture; do
  name="$(jq -r '.name' <<<"$fixture")"
  directory="$(jq -r '.directory' <<<"$fixture")"
  expected_preset="$(jq -r '.expectedPreset' <<<"$fixture")"
  expected_runtime="$(jq -r '.expectedRuntime' <<<"$fixture")"
  if [[ -n "$ONLY_FIXTURE" && "$name" != "$ONLY_FIXTURE" ]]; then
    continue
  fi
  archive="$TEMP_DIR/$name.zip"
  project_id=""

  echo "==> $name"
  (cd "$FIXTURES_DIR/$directory" && zip -q -r "$archive" . \
    -x '*/target/*' '*/bin/*' '*/obj/*' '*/__pycache__/*' '*.pyc')

  inspect_status="$(curl -sS -o "$TEMP_DIR/$name-inspect.json" -w '%{http_code}' \
    -b "$COOKIE_JAR" -F "file=@$archive" "$API_URL/api/drop/inspect")"
  if [[ "$inspect_status" != "200" ]]; then
    echo "FAIL inspect ($inspect_status): $(cat "$TEMP_DIR/$name-inspect.json")"
    FAILURES=$((FAILURES + 1))
    continue
  fi

  detected_preset="$(jq -r '.candidates[0].preset // empty' "$TEMP_DIR/$name-inspect.json")"
  if [[ "$detected_preset" != "$expected_preset" ]]; then
    echo "FAIL preset: expected $expected_preset, got ${detected_preset:-none}"
    FAILURES=$((FAILURES + 1))
    continue
  fi

  project_name="drop-$name-$(date +%s)-$RANDOM"
  create_status="$(curl -sS -o "$TEMP_DIR/$name-project.json" -w '%{http_code}' \
    -b "$COOKIE_JAR" -H 'content-type: application/json' \
    --data "$(jq -nc --arg name "$project_name" --arg preset "$detected_preset" \
      '{name: $name, directory: ".", main_branch: "main", preset: $preset,
        source_type: "uploaded_source", project_type: "server",
        automatic_deploy: false, storage_service_ids: []}')" \
    "$API_URL/api/projects")"
  if [[ "$create_status" != "200" ]]; then
    echo "FAIL create ($create_status): $(cat "$TEMP_DIR/$name-project.json")"
    FAILURES=$((FAILURES + 1))
    continue
  fi
  project_id="$(jq -r '.id' "$TEMP_DIR/$name-project.json")"
  ACTIVE_PROJECT_ID="$project_id"

  curl -sS -b "$COOKIE_JAR" "$API_URL/api/projects/$project_id/environments" \
    >"$TEMP_DIR/$name-environments.json"
  environment_id="$(jq -r 'map(select(.is_preview == false))[0].id // .[0].id' \
    "$TEMP_DIR/$name-environments.json")"
  production_url="$(jq -r 'map(select(.is_preview == false))[0].main_url // .[0].main_url' \
    "$TEMP_DIR/$name-environments.json")"

  deploy_status="$(curl -sS -o "$TEMP_DIR/$name-deploy.json" -w '%{http_code}' \
    -b "$COOKIE_JAR" -F "file=@$archive" \
    "$API_URL/api/projects/$project_id/environments/$environment_id/deploy/source")"
  if [[ "$deploy_status" != "202" ]]; then
    echo "FAIL deploy ($deploy_status): $(cat "$TEMP_DIR/$name-deploy.json")"
    cleanup_active_project || exit 1
    FAILURES=$((FAILURES + 1))
    continue
  fi
  deployment_id="$(jq -r '.id' "$TEMP_DIR/$name-deploy.json")"

  deployment_state="pending"
  for ((attempt = 1; attempt <= POLL_ATTEMPTS; attempt += 1)); do
    curl -sS -b "$COOKIE_JAR" \
      "$API_URL/api/projects/$project_id/deployments/$deployment_id" \
      >"$TEMP_DIR/$name-status.json"
    deployment_state="$(jq -r '.status' "$TEMP_DIR/$name-status.json")"
    echo "  deployment $deployment_id: $deployment_state"
    case "$deployment_state" in
      completed | failed | cancelled) break ;;
    esac
    sleep "$POLL_INTERVAL"
  done

  if [[ "$deployment_state" != "completed" ]]; then
    echo "FAIL deployment ended as $deployment_state"
    jq -r '.cancelled_reason // empty' "$TEMP_DIR/$name-status.json"
    cleanup_active_project || exit 1
    FAILURES=$((FAILURES + 1))
    continue
  fi

  actual_runtime="$(curl -sS "$production_url/" | jq -r '.runtime // empty')"
  health="$(curl -sS "$production_url/health")"
  if [[ "$actual_runtime" != "$expected_runtime" || "$health" != "ok" ]]; then
    echo "FAIL runtime response: runtime=${actual_runtime:-none} health=${health:-none}"
    cleanup_active_project || exit 1
    FAILURES=$((FAILURES + 1))
    continue
  fi

  deleted_project_id="$project_id"
  source_bundle_path="$(jq -r '.metadata.sourceBundlePath // empty' "$TEMP_DIR/$name-status.json")"
  if ! cleanup_active_project; then
    FAILURES=$((FAILURES + 1))
    exit 1
  fi
  if command -v docker >/dev/null 2>&1 && \
    [[ -n "$(docker ps -aq --filter "label=sh.temps.project_id=$deleted_project_id")" ]]; then
    echo "FAIL cleanup: project containers remain"
    FAILURES=$((FAILURES + 1))
    continue
  fi
  if [[ -n "$DATA_DIR" && -n "$source_bundle_path" && -e "$DATA_DIR/$source_bundle_path" ]]; then
    echo "FAIL cleanup: source bundle remains at $DATA_DIR/$source_bundle_path"
    FAILURES=$((FAILURES + 1))
    continue
  fi

  echo "PASS $name ($detected_preset)"
done < <(jq -c '.[]' "$MANIFEST")

if ((FAILURES > 0)); then
  echo "$FAILURES fixture(s) failed" >&2
  exit 1
fi

echo "all Drop runtime fixtures passed"
