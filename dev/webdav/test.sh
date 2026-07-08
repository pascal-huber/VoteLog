#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:8080"
CLIENT_ID="votelog-webapp"
EMAIL="cat@example.com"
PASSWORD="cat"
FILE="votelog_${EMAIL}.json"
URL="${BASE}/dav/${FILE}"

PASS=0
FAIL=0
STATUS=""
BODY=""

separator() {
  printf '%s\n' "------------------------------------------------------------"
}

header() {
  echo
  separator
  echo "TEST: $1"
  separator
}

# Performs a curl request. Captures the HTTP status into $STATUS
# and the response body into $BODY for the following assertions.
request() {
  local body_file
  body_file=$(mktemp)
  STATUS=$(curl -s -o "$body_file" -w '%{http_code}' "$@")
  BODY=$(cat "$body_file")
  rm -f "$body_file"
}

# Asserts $STATUS matches one of the given acceptable codes.
expect_status() {
  local label="$1"; shift
  local code
  for code in "$@"; do
    if [[ "$STATUS" == "$code" ]]; then
      echo "[PASS] ${label}: status ${STATUS}"
      PASS=$((PASS + 1))
      return
    fi
  done
  echo "[FAIL] ${label}: got status ${STATUS}, expected one of: $*"
  echo "       body: ${BODY}"
  FAIL=$((FAIL + 1))
}

# Asserts the full JSON body equals the expected JSON (key order
# and whitespace insensitive).
expect_json_body() {
  local label="$1" expected="$2"
  local actual_canon expected_canon
  actual_canon=$(echo "$BODY" | jq -Sc . 2>/dev/null || echo "INVALID_JSON")
  expected_canon=$(echo "$expected" | jq -Sc .)

  if [[ "$actual_canon" == "$expected_canon" ]]; then
    echo "[PASS] ${label}: body matches expected content"
    PASS=$((PASS + 1))
  else
    echo "[FAIL] ${label}: body content mismatch"
    echo "       expected: ${expected_canon}"
    echo "       actual:   ${actual_canon}"
    FAIL=$((FAIL + 1))
  fi
}

# Asserts a single JSON field equals an expected value.
expect_json_field() {
  local label="$1" field="$2" expected="$3"
  local actual
  actual=$(echo "$BODY" | jq -r "$field" 2>/dev/null || echo "")
  if [[ "$actual" == "$expected" ]]; then
    echo "[PASS] ${label}: ${field} == '${expected}'"
    PASS=$((PASS + 1))
  else
    echo "[FAIL] ${label}: ${field} == '${actual}', expected '${expected}'"
    FAIL=$((FAIL + 1))
  fi
}

header "1. Obtain id_token via password grant"
request -X POST "${BASE}/dex/token" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=password' \
  --data-urlencode "client_id=${CLIENT_ID}" \
  --data-urlencode 'scope=openid email' \
  --data-urlencode "username=${EMAIL}" \
  --data-urlencode "password=${PASSWORD}"
expect_status "Token request" 200

TOKEN=$(echo "$BODY" | jq -r '.id_token // empty' 2>/dev/null || echo "")
if [[ -z "$TOKEN" ]]; then
  echo "[FAIL] Token request: no id_token in response (body: ${BODY})"
  FAIL=$((FAIL + 1))
  echo "Aborting: cannot continue without a token."
  exit 1
fi
echo "[PASS] Token request: id_token present (${TOKEN:0:20}...)"
PASS=$((PASS + 1))

header "2. Cleanup: remove file from a previous run, if present"
request -X DELETE "${URL}" -H "Authorization: Bearer ${TOKEN}"
expect_status "Cleanup DELETE" 204 404

header "3. PUT file (create)"
request -X PUT "${URL}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H 'Content-Type: application/json' \
  --data '{}'
expect_status "PUT create" 201

header "4. GET file and verify initial content"
request -H "Authorization: Bearer ${TOKEN}" "${URL}"
expect_status "GET after create" 200
expect_json_body "GET after create" '{}'

header "5. PUT file (overwrite with votes A)"
VOTES_A='{"votes":["yes","no","yes"]}'
request -X PUT "${URL}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H 'Content-Type: application/json' \
  --data "${VOTES_A}"
expect_status "PUT overwrite" 204

header "6. GET file and verify overwritten content"
request -H "Authorization: Bearer ${TOKEN}" "${URL}"
expect_status "GET after PUT overwrite" 200
expect_json_body "GET after PUT overwrite" "${VOTES_A}"

header "7. Negative: POST is not supported for writes (expect 403)"
request -X POST "${URL}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H 'Content-Type: application/json' \
  --data '{"votes":["yes","yes","yes"]}'
expect_status "POST rejected" 403

header "8. GET file and verify content is unchanged after rejected POST"
request -H "Authorization: Bearer ${TOKEN}" "${URL}"
expect_status "GET after rejected POST" 200
expect_json_body "GET after rejected POST" "${VOTES_A}"

header "9. Negative: request with no token"
request "${URL}"
expect_status "GET without token" 401

header "10. Negative: PUT someone else's file"
request -X PUT "${BASE}/dav/votelog_dog@example.com.json" \
  -H "Authorization: Bearer ${TOKEN}" \
  --data '{"hack":"attempt"}'
expect_status "PUT other user's file" 401

header "11. Negative: wrong password"
request -X POST "${BASE}/dex/token" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=password' \
  --data-urlencode "client_id=${CLIENT_ID}" \
  --data-urlencode 'scope=openid email' \
  --data-urlencode "username=${EMAIL}" \
  --data-urlencode 'password=wrongpassword'
expect_status "Token request with wrong password" 401
expect_json_field "Token request with wrong password" '.error' 'access_denied'

header "12. CORS preflight check (simulating browser from localhost:8001)"
request -X OPTIONS "${URL}" \
  -H "Origin: http://localhost:8001" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: authorization,content-type"
expect_status "CORS preflight" 200

echo
separator
echo "SUMMARY: ${PASS} passed, ${FAIL} failed"
separator

if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi