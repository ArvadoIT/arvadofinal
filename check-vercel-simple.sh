#!/bin/bash

# Quick Vercel Project Check
# Usage: ./check-vercel-simple.sh YOUR_VERCEL_TOKEN

PROJECT_ID="prj_hGUzz36fOGPv5xtliIimZML5hcWM"
TOKEN="${1}"

if [ -z "$TOKEN" ]; then
  echo "❌ Error: Vercel token required"
  echo ""
  echo "Usage: ./check-vercel-simple.sh YOUR_VERCEL_TOKEN"
  echo ""
  echo "Get your token from: https://vercel.com/account/tokens"
  exit 1
fi

echo ""
echo "📦 Checking Vercel Project Configuration..."
echo ""

# Get project details
echo "Project Details:"
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.vercel.com/v9/projects/$PROJECT_ID" | \
  jq -r '
    "Project Name: \(.name)",
    "Repository: \(.link.repo // "NOT CONNECTED")",
    "Repo Type: \(.link.type // "N/A")",
    "Framework: \(.framework // "Not set")"
  ' 2>/dev/null || echo "Error: Install jq or check token validity"

echo ""
echo "Recent Deployments:"
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.vercel.com/v6/deployments?projectId=$PROJECT_ID&limit=3" | \
  jq -r '.deployments[] | "\(.url) - \(.readyState) - \(.meta.githubCommitRef // "N/A")"' 2>/dev/null || echo "Error fetching deployments"

echo ""

