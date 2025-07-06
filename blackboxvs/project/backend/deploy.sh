#!/bin/bash

# JHADEPILOT Advanced Deployment Script
# Optimized for India region with top 1% performance

set -e

echo "🚀 JHADEPILOT Advanced Deployment Starting..."

# Configuration
DOCKER_IMAGE="jhadepilot-agent"
CONTAINER_NAME="jhadepilot-advanced"
PORT=8001
GROQ_API_KEY=${GROQ_API_KEY:-"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"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "agents/Dockerfile" ]; then
    print_error "Dockerfile not found. Please run this script from the backend directory."
    exit 1
fi

# Stop existing container if running
print_status "Stopping existing container..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Build the Docker image
print_status "Building Docker image..."
cd agents
docker build -t $DOCKER_IMAGE . --no-cache

# Run the container with India-optimized settings
print_status "Starting JHADEPILOT Advanced Agent..."
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p $PORT:$PORT \
    -e GROQ_API_KEY="$GROQ_API_KEY" \
    -e TZ="Asia/Kolkata" \
    -e PYTHONUNBUFFERED=1 \
    --memory="1g" \
    --cpus="1.0" \
    --health-cmd="curl -f http://localhost:$PORT/health || exit 1" \
    --health-interval=30s \
    --health-timeout=10s \
    --health-retries=3 \
    $DOCKER_IMAGE

# Wait for container to be healthy
print_status "Waiting for container to be healthy..."
sleep 10

# Check if container is running
if docker ps | grep -q $CONTAINER_NAME; then
    print_success "Container is running successfully!"
    
    # Test the health endpoint
    if curl -f http://localhost:$PORT/health &>/dev/null; then
        print_success "Health check passed!"
        print_success "JHADEPILOT Advanced Agent is ready!"
        echo ""
        echo "🌟 Deployment Summary:"
        echo "   • Container: $CONTAINER_NAME"
        echo "   • Port: $PORT"
        echo "   • Health: http://localhost:$PORT/health"
        echo "   • API: http://localhost:$PORT/generate"
        echo "   • Region: India (Mumbai optimized)"
        echo "   • Performance: Top 1% configuration"
        echo ""
        echo "📊 Monitor with: docker logs -f $CONTAINER_NAME"
        echo "🔧 Stop with: docker stop $CONTAINER_NAME"
    else
        print_warning "Container is running but health check failed. Check logs:"
        docker logs $CONTAINER_NAME
    fi
else
    print_error "Container failed to start. Check logs:"
    docker logs $CONTAINER_NAME
    exit 1
fi

# Optional: Set up ngrok tunnel for public access
if command -v ngrok &> /dev/null; then
    print_status "Setting up public tunnel with ngrok..."
    echo "Run: ngrok http $PORT --region=ap --hostname=jhadepilot.ngrok.app"
else
    print_warning "ngrok not found. Install ngrok for public access:"
    echo "curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null"
    echo "echo 'deb https://ngrok-agent.s3.amazonaws.com buster main' | sudo tee /etc/apt/sources.list.d/ngrok.list"
    echo "sudo apt update && sudo apt install ngrok"
fi

print_success "🎉 JHADEPILOT Advanced Deployment Complete!"