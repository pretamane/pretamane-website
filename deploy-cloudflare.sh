#!/bin/bash
# Cloudflare Pages Deployment Script
# Uses environment variables for credentials

set -e

echo "=== Cloudflare Pages Deployment ==="
echo ""

# Check if credentials are set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "ERROR: CLOUDFLARE_API_TOKEN environment variable not set"
    echo "Set it with: export CLOUDFLARE_API_TOKEN='your-token'"
    exit 1
fi

if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    echo "ERROR: CLOUDFLARE_ACCOUNT_ID environment variable not set"
    echo "Set it with: export CLOUDFLARE_ACCOUNT_ID='your-account-id'"
    exit 1
fi

PROJECT_NAME="thaw-zin-portfolio"
ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID"
API_TOKEN="$CLOUDFLARE_API_TOKEN"

echo "Project: $PROJECT_NAME"
echo "Account ID: $ACCOUNT_ID"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "Installing Wrangler CLI..."
    npm install -g wrangler
fi

echo "Deploying to Cloudflare Pages..."
echo ""

# Deploy using Wrangler
# Note: Wrangler reads CLOUDFLARE_API_TOKEN from environment automatically
wrangler pages deploy . \
    --project-name="$PROJECT_NAME" \
    --commit-dirty=true

echo ""
echo "=== Deployment Complete ==="
echo "Your site should be live at: https://${PROJECT_NAME}.pages.dev"
echo ""

