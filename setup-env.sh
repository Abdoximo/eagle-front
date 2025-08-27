#!/bin/bash

echo "🔧 Setting up environment for Eagle Frontend..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
# Development Environment Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_DEBUG=true
VITE_ENABLE_ANALYTICS=false
VITE_API_TIMEOUT=30000
VITE_MAX_FILE_SIZE=10485760
VITE_SESSION_TIMEOUT=1800000
EOF
    echo "✅ .env file created successfully!"
else
    echo "✅ .env file already exists"
fi

# Create .env.example for documentation
if [ ! -f .env.example ]; then
    echo "📝 Creating .env.example file..."
    cat > .env.example << 'EOF'
# Example Environment Configuration
# Copy this file to .env and update values for your environment

# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Development Settings
VITE_DEBUG=true
VITE_ENABLE_ANALYTICS=false

# Performance Settings
VITE_API_TIMEOUT=30000
VITE_MAX_FILE_SIZE=10485760

# Security Settings
VITE_SESSION_TIMEOUT=1800000
VITE_CSRF_TOKEN_NAME=csrf-token

# Production Settings (uncomment for production)
# VITE_API_BASE_URL=https://your-production-api.com/api
# VITE_DEBUG=false
# VITE_ENABLE_ANALYTICS=true
EOF
    echo "✅ .env.example file created successfully!"
else
    echo "✅ .env.example file already exists"
fi

echo "🎉 Environment setup complete!"
echo "🚀 You can now run: npm run dev"
