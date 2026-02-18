#!/bin/bash

set -e

echo "🚀 AI UI Generator - Vercel Deployment"
echo ""

if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed"
    echo "Install it with: npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

if ! vercel whoami &> /dev/null; then
    echo "⚠️  Not logged in to Vercel"
    vercel login
fi

USER=$(vercel whoami)
echo "✅ Logged in as: $USER"
echo ""

echo "Select deployment type:"
echo "1) Preview"
echo "2) Production"
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        DEPLOY_CMD="vercel"
        ;;
    2)
        DEPLOY_CMD="vercel --prod"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🚀 Deploying to Vercel..."
$DEPLOY_CMD

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
else
    echo ""
    echo "❌ Deployment failed"
    exit 1
fi
