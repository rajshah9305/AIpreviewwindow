#!/bin/bash

# AI UI Generator - Vercel Deployment Script

set -e

echo "🚀 AI UI Generator - Vercel Deployment"
echo "======================================"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI is not installed${NC}"
    echo ""
    echo "Install it with:"
    echo "  npm install -g vercel"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Vercel CLI found${NC}"
echo ""

if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Vercel${NC}"
    echo ""
    echo "Logging in..."
    vercel login
    echo ""
fi

USER=$(vercel whoami)
echo -e "${GREEN}✅ Logged in as: $USER${NC}"
echo ""

echo "Select deployment type:"
echo "1) Preview (development)"
echo "2) Production"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        DEPLOY_TYPE="preview"
        DEPLOY_CMD="vercel"
        ;;
    2)
        DEPLOY_TYPE="production"
        DEPLOY_CMD="vercel --prod"
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${YELLOW}📦 Preparing $DEPLOY_TYPE deployment...${NC}"
echo ""

if [ ! -d ".vercel" ]; then
    echo -e "${YELLOW}⚠️  Project not linked to Vercel${NC}"
    echo ""
    echo "Linking project..."
    vercel link
    echo ""
fi

echo -e "${YELLOW}🧪 Running pre-deployment checks...${NC}"
echo ""

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found${NC}"
    exit 1
fi

if [ ! -f "vercel.json" ]; then
    echo -e "${RED}❌ vercel.json not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Configuration files found${NC}"
echo ""

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install
echo ""

echo -e "${YELLOW}🔨 Building project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"
echo ""

echo -e "${YELLOW}🚀 Deploying to Vercel ($DEPLOY_TYPE)...${NC}"
echo ""

$DEPLOY_CMD

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    
    if [ "$DEPLOY_TYPE" = "production" ]; then
        echo "🎉 Your app is now live in production!"
    else
        echo "🎉 Preview deployment created!"
    fi
    
    echo ""
    echo "Next steps:"
    echo "  • View deployment: vercel ls"
    echo "  • Check logs: vercel logs --follow"
    echo "  • Open dashboard: https://vercel.com"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Deployment failed${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "  • Check logs: vercel logs"
    echo "  • Verify configuration: vercel inspect"
    echo "  • Review build output above"
    echo ""
    exit 1
fi
