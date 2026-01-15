#!/bin/bash

# Setup script for Bogor Junior Frontend
# This script helps initialize the frontend project

set -e

echo "🚀 Bogor Junior Frontend Setup"
echo "=============================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js version 18 or higher is required"
    echo "   Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Create .env file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    
    # Prompt for API URL
    read -p "Enter backend API URL (default: http://localhost:3000): " API_URL
    API_URL=${API_URL:-http://localhost:3000}
    
    sed -i "s|VITE_API_URL=.*|VITE_API_URL=$API_URL|" .env
    echo "✅ API URL configured: $API_URL"
else
    echo "ℹ️  .env file already exists"
fi
echo ""

# Final instructions
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Ensure backend server is running"
echo "2. Start development server: npm run dev"
echo "3. Build for production: npm run build"
echo ""
echo "Documentation:"
echo "- README.md - Project overview"
echo "- MIGRATION.md - Migration guide from monorepo"
echo ""
echo "Development server will run on: http://localhost:5173"
echo ""
