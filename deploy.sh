#!/bin/bash

# Env Vars




# NEXT_PUBLIC_SAFE_KEY="safe-key"
DOMAIN_NAME="fintech.lavitalite.tech" # replace with your own
EMAIL="hack.xiyuan@gmail.com" # replace with your own

# Script Vars
REPO_URL="https://github.com/0x3f1opusexpavotelos/finance-sass.git"
APP_DIR=~/app
SWAP_SIZE="1G"  # Swap size of 1GB

# Update package list and upgrade existing packages
sudo apt update && sudo apt upgrade -y

# Add Swap Space
echo "Adding swap space..."
sudo fallocate -l $SWAP_SIZE /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab


check_docker_installed() {
  if command -v docker &> /dev/null && docker --version &> /dev/null; then
    echo "Docker is already installed. Current version: $(docker --version)"
    return 0
  fi
  return 1
}

check_docker_compose_installed() {
  if command -v docker-compose &> /dev/null && docker-compose --version &> /dev/null; then
    echo "Docker Compose is already installed. Current version: $(docker-compose --version)"
    return 0
  fi
  return 1
}

# Install Docker if not already exits
install_docker() {
  if check_docker_installed; then
    echo "Skipping Docker installation."
  else
    echo "Installing Docker CE..."
    sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" -y
    sudo apt update
    sudo apt install docker-ce -y

    # Verify installation
    if ! check_docker_installed; then
      echo "Docker installation failed."
      exit 1
    fi

    # Optional: Add current user to docker group to avoid using sudo
    sudo usermod -aG docker $USER
    echo "Docker installed successfully. You may need to log out and back in for group changes to take effect."
  fi
}



# Install Docker Compose if not already installed
# Install Docker if not already installed
install_docker() {
  if check_docker_installed; then
    echo "Skipping Docker installation."
  else
    echo "Installing Docker CE..."
    sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" -y
    sudo apt update
    sudo apt install docker-ce -y

    # Verify installation
    if ! check_docker_installed; then
      echo "Docker installation failed."
      exit 1
    fi

    # Add current user to docker group to avoid using sudo
    sudo usermod -aG docker $USER
    echo "Docker installed successfully."

    # Make docker group membership take effect immediately
    echo "Activating docker group membership without logout..."
    newgrp docker << EONG
    # This subshell now has the docker group active
    echo "Docker group membership activated. Testing with: groups:"
    docker --version

    # Continue with the rest of the script
    echo "Continuing with setup..."
EONG
  fi
}



install_docker_compose() {
  if check_docker_compose_installed; then
    echo "Skipping Docker Compose installation."
  else
    echo "Installing Docker Compose..."

    # cleanup previous before install
    sudo rm -f /usr/local/bin/docker-compose
    sudo curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

    # post-installed checked
    if [ ! -f /usr/local/bin/docker-compose ]; then
      echo "Docker Compose download failed. Exiting."
      exit 1
    fi

    sudo chmod +x /usr/local/bin/docker-compose

    # Ensure Docker Compose is executable and in path
    sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose


    # Verify Docker Compose installation
    docker-compose --version
    if [ $? -ne 0 ]; then
    echo "Docker Compose installation failed. Exiting."
    exit 1
    fi

    echo "Docker Compose installed successfully."
  fi
}




echo "Checking for existing Docker installation..."
install_docker

echo "Checking for existing Docker Compose installation..."
install_docker_compose

# Ensure Docker starts on boot and start Docker service
sudo systemctl enable docker
sudo systemctl start docker

echo "Docker environment setup complete!"

# Clone the Git repository
if [ -d "$APP_DIR" ]; then
  echo "Directory $APP_DIR already exists. Pulling latest changes..."
  cd $APP_DIR && git pull
else
  echo "Cloning repository from $REPO_URL..."
  git clone $REPO_URL $APP_DIR
  cd $APP_DIR
fi



# Install Nginx
# sudo apt install nginx -y

# Remove old Nginx config (if it exists)
sudo rm -f /etc/nginx/sites-available/app
sudo rm -f /etc/nginx/sites-enabled/app

# Stop Nginx temporarily to allow Certbot to run in standalone mode
sudo systemctl stop nginx

# Obtain SSL certificate using Certbot standalone mode
sudo apt install certbot -y
sudo certbot certonly --standalone -d $DOMAIN_NAME --non-interactive --agree-tos -m $EMAIL

# Ensure SSL files exist or generate them
if [ ! -f /etc/letsencrypt/options-ssl-nginx.conf ]; then
  sudo wget https://raw.githubusercontent.com/certbot/certbot/main/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -P /etc/letsencrypt/
fi

if [ ! -f /etc/letsencrypt/ssl-dhparams.pem ]; then
  sudo openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
fi

# Create Nginx config with reverse proxy, SSL support, rate limiting, and streaming support
sudo bash -c  '> cat > /etc/nginx/sites-available/app <<EOL
limit_req_zone \$binary_remote_addr zone=limit_main:10m rate=10r/s;

server {
    listen 80;
    server_name $DOMAIN_NAME;

    # Redirect all HTTP requests to HTTPS
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN_NAME;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Enable rate limiting
    limit_req zone=limit_main burst=20 nodelay;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;

        # Disable buffering for streaming support
        proxy_buffering off;
        proxy_set_header X-Accel-Buffering no;
    }
}
EOL'

# Create symbolic link if it doesn't already exist
sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/app

# Restart Nginx to apply the new configuration
sudo systemctl restart nginx

# Build and run the Docker containers from the app directory (~/app)
cd $APP_DIR
sudo docker-compose up --build -d

# Check if Docker Compose started correctly
if ! sudo docker-compose ps | grep "Up"; then
  echo "Docker containers failed to start. Check logs with 'docker-compose logs'."
  exit 1
fi

# Output final message
echo "Deployment complete. Your Next.js app and PostgreSQL database are now running.
Next.js is available at https://$DOMAIN_NAME,
