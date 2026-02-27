#!/usr/bin/env bash
set -euo pipefail

# Deploy fetching.design to Vultr VPS
# Usage: ./scripts/deploy.sh

REMOTE_HOST="vultr-vista"
REMOTE_DIR="/home/max/fetching-design"
APP_PORT="${APP_PORT:-3200}"
HEALTH_URL="http://localhost:${APP_PORT}/api/health"

echo "==> Deploying fetching.design to ${REMOTE_HOST}"

# Push latest code to remote
echo "==> Syncing code to remote..."
ssh "${REMOTE_HOST}" "mkdir -p ${REMOTE_DIR}"
rsync -az --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.env' \
  --exclude='tests' \
  --exclude='test-results' \
  --exclude='playwright-report' \
  --exclude='inspiration' \
  ./ "${REMOTE_HOST}:${REMOTE_DIR}/"

# Build and restart on remote
echo "==> Building and restarting containers..."
ssh "${REMOTE_HOST}" "cd ${REMOTE_DIR} && docker compose -f docker-compose.prod.yml build --no-cache"
ssh "${REMOTE_HOST}" "cd ${REMOTE_DIR} && docker compose -f docker-compose.prod.yml up -d"

# Wait for health check
echo "==> Waiting for health check..."
for i in $(seq 1 30); do
  if ssh "${REMOTE_HOST}" "wget -q --spider ${HEALTH_URL}" 2>/dev/null; then
    echo "==> Health check passed"
    echo "==> Deployment complete"
    exit 0
  fi
  sleep 2
done

echo "==> Health check failed after 60 seconds"
ssh "${REMOTE_HOST}" "cd ${REMOTE_DIR} && docker compose -f docker-compose.prod.yml logs --tail=50 fetching-app"
exit 1
