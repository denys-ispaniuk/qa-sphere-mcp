#!/bin/bash
API_KEY="eu1rk3qve2.1CXkv95Kd_P4zmnikyRYZbU.Cq3DYr9TNLeajoObZLFtRI6"
BASE_URL="https://home-923.eu1.qasphere.com/api/public/v0"
PROJECT="BD"

echo "=== Testing QA Sphere API Endpoints ==="
echo ""

# Test Cases
echo "1. List Test Cases (GET /project/$PROJECT/tcase)"
curl -s -H "Authorization: ApiKey $API_KEY" "$BASE_URL/project/$PROJECT/tcase" | jq -r 'if .tcases then "✅ SUCCESS: Found \(.tcases | length) test cases" else "❌ ERROR: \(.message // .)" end'
echo ""

# Folders
echo "2. List Folders (GET /project/$PROJECT/tcase/folders)"
curl -s -H "Authorization: ApiKey $API_KEY" "$BASE_URL/project/$PROJECT/tcase/folders" | jq -r 'if .folders then "✅ SUCCESS: Found \(.folders | length) folders" else "❌ ERROR: \(.message // .)" end'
echo ""

# Tags
echo "3. List Tags (GET /project/$PROJECT/tag)"
curl -s -H "Authorization: ApiKey $API_KEY" "$BASE_URL/project/$PROJECT/tag" | jq -r 'if .tags then "✅ SUCCESS: Found \(.tags | length) tags" else "❌ ERROR: \(.message // .)" end'
echo ""

# Preconditions
echo "4. List Preconditions (GET /project/$PROJECT/shared-precondition)"
curl -s -H "Authorization: ApiKey $API_KEY" "$BASE_URL/project/$PROJECT/shared-precondition" | jq -r 'if type == "array" then "✅ SUCCESS: Found \(. | length) preconditions" else "❌ ERROR: \(.message // .)" end'
echo ""

# Test Plans
echo "5. List Test Plans (GET /project/$PROJECT/plan)"
curl -s -H "Authorization: ApiKey $API_KEY" "$BASE_URL/project/$PROJECT/plan" | jq -r 'if .plans then "✅ SUCCESS: Found \(.plans | length) plans" else "❌ ERROR: \(.message // .)" end'
echo ""

# Requirements
echo "6. List Requirements (GET /project/$PROJECT/requirement)"
curl -s -H "Authorization: ApiKey $API_KEY" "$BASE_URL/project/$PROJECT/requirement" | jq -r 'if .requirements then "✅ SUCCESS: Found \(.requirements | length) requirements" else "❌ ERROR: \(.message // .)" end'
echo ""

echo "=== Endpoint Verification Complete ==="
