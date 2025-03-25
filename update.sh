#!/bin/bash

set -e

# Script Vars
REPO_URL="https://github.com/leerob/next-self-host.git"
APP_DIR=~/apps/transaction
ENV_FILE=${ENV_FILE:-~/deploy-conf/.env}


check_dependencies() {
  local deps=("git" "mkdir" "cp")
  for dep in "${deps[@]}"; do
    if ! command -v "$dep" &> /dev/null; then
      echo "Required dependency $dep not found"
      exit 1
    fi
  done
}




# Pull the latest changes from the Git repository
if [ -d "$APP_DIR" ] && [ -d "$APP_DIR/.git" ]; then
  echo "Pulling latest changes from the repository..."
  cd "$APP_DIR"
  # stash if local edits unsaved
  if ! git diff-index --quiet HEAD --; then
    echo "Stashing local changes..."
    git stash push -u -m "Pre-deployment stash: $(date)"
    echo "Local changes stashed. Restore with: git stash pop"
  fi
  git pull origin main
elif [ ! -d "$APP_DIR" ]; then
  echo "Cloning repository from $REPO_URL..."
  git clone "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
else
    echo "Directory exists with local files, but it's not a Git repository."
    echo "Initializing Git, stashing local changes, and syncing with remote..."
    cd $APP_DIR
    git init
    git add -A
    git stash push -u -m "Pre-deployment stash: $(date)"
    echo "Local changes stashed(without discarding). Restore with: git stash pop"
    echo "you can review and merge your local edit against the remote later"
    echo "override of local modifications in sync with remote..."
    git remote add origin $REPO_URL
    git fetch origin
    git reset --hard origin/main
fi

if [ -f "$ENV_FILE" ]; then
  echo "Copying .env file to $APP_DIR"
  cp "$ENV_FILE" "$APP_DIR/.env"
else
  echo ".env file not found at $ENV_FILE, skipping copy."
fi



# Build and restart the Docker containers from the app directory (~/myapp)
echo "Rebuilding and restarting Docker containers..."
sudo docker-compose down
sudo docker-compose up --build -d

# Check if Docker Compose started correctly
if ! sudo docker-compose ps | grep "Up"; then
  echo "Docker containers failed to start. Check logs with 'docker-compose logs'."
  exit 1
fi

# Output final message
echo "Update complete. Your Next.js app has been deployed with the latest changes."
