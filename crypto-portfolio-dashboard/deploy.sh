#!/bin/bash

# 🚀 Crypto Portfolio Dashboard - Linode Deployment Script
# This script automates the deployment of your crypto dashboard to a Linode VPS

set -e  # Exit on any error

echo "🚀 Starting Crypto Portfolio Dashboard deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN=""  # Set your domain here (optional)
PROJECT_DIR="/opt/crypto-dashboard"
WEB_DIR="/var/www/html"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root (use sudo)"
   exit 1
fi

print_status "Updating system packages..."
apt update && apt upgrade -y

print_status "Installing required packages..."
apt install -y nginx nodejs npm git ufw curl unzip

# Install latest Node.js (18.x)
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Configure firewall
print_status "Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

print_success "Firewall configured successfully"

# Clone or update project
if [ -d "$PROJECT_DIR" ]; then
    print_status "Updating existing project..."
    cd $PROJECT_DIR
    git pull origin main
else
    print_status "Cloning project repository..."
    # Replace with your actual repository URL
    git clone https://github.com/yourusername/crypto-portfolio-dashboard.git $PROJECT_DIR
    cd $PROJECT_DIR
fi

print_status "Installing project dependencies..."
npm install

print_status "Building project for production..."
npm run build

print_status "Deploying to web directory..."
rm -rf $WEB_DIR/*
cp -r dist/* $WEB_DIR/

# Set proper permissions
chown -R www-data:www-data $WEB_DIR
chmod -R 755 $WEB_DIR

# Configure Nginx
print_status "Configuring Nginx..."

cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html index.htm;

    server_name _;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Main location
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
EOF

# Test Nginx configuration
print_status "Testing Nginx configuration..."
if nginx -t; then
    print_success "Nginx configuration is valid"
else
    print_error "Nginx configuration test failed"
    exit 1
fi

# Start and enable services
print_status "Starting services..."
systemctl restart nginx
systemctl enable nginx

print_success "Nginx started and enabled"

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)

print_success "✅ Deployment completed successfully!"
echo ""
echo "🎉 Your Crypto Portfolio Dashboard is now live!"
echo "📍 Access your dashboard at: http://$SERVER_IP"
echo ""

if [ -n "$DOMAIN" ]; then
    print_status "🔒 To enable SSL with Let's Encrypt:"
    echo "1. Point your domain '$DOMAIN' to this server IP: $SERVER_IP"
    echo "2. Run: certbot --nginx -d $DOMAIN"
    echo "3. Follow the prompts to get your SSL certificate"
    echo ""
fi

print_status "📋 Next steps:"
echo "• Point your domain to this IP: $SERVER_IP"
echo "• Set up SSL with Let's Encrypt (optional but recommended)"
echo "• Monitor your dashboard at: http://$SERVER_IP"
echo "• Check logs with: sudo tail -f /var/log/nginx/access.log"
echo ""

print_status "🛠️ Useful commands:"
echo "• Restart Nginx: sudo systemctl restart nginx"
echo "• View Nginx status: sudo systemctl status nginx"
echo "• Update dashboard: cd $PROJECT_DIR && git pull && npm run build && sudo cp -r dist/* $WEB_DIR/"
echo "• View Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo ""

print_success "🎯 Deployment script completed!"

# Create update script
cat > /usr/local/bin/update-dashboard << EOF
#!/bin/bash
echo "🔄 Updating Crypto Portfolio Dashboard..."
cd $PROJECT_DIR
git pull origin main
npm install
npm run build
rm -rf $WEB_DIR/*
cp -r dist/* $WEB_DIR/
chown -R www-data:www-data $WEB_DIR
systemctl reload nginx
echo "✅ Dashboard updated successfully!"
EOF

chmod +x /usr/local/bin/update-dashboard

print_success "📦 Created update script at /usr/local/bin/update-dashboard"
print_status "Run 'sudo update-dashboard' anytime to update your dashboard"