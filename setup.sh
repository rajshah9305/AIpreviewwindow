#!/bin/bash

echo "🚀 Setting up AI UI Generator..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Create environment files
echo "⚙️  Creating environment files..."
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "✅ Created backend/.env"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env and add your API key"
echo "2. Run 'npm run dev' (frontend)"
echo "3. Run 'npm run backend' in another terminal"
echo "4. Open http://localhost:5173"
echo ""
