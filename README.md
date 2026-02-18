# AI UI Component Generator

🎨 Transform natural language into beautiful UI components instantly

A sophisticated web application that interprets your instructions and automatically generates five distinct, visually engaging UI component variations with live preview.

## Features

- 🤖 AI-Powered Generation - Natural language to UI component conversion
- 🎭 Five Unique Variations - Each with distinct layouts, styles, and interactions
- 👁️ Live Preview - See your components rendered in real-time
- 🔌 Flexible AI Integration - Works with OpenAI, Anthropic, Cerebras, or any OpenAI-compatible API
- ⚙️ Easy Configuration - Simple settings interface for model, API key, and endpoint
- 🎨 Beautiful Design - Cohesive interface with exceptional aesthetics
- 🌈 Smart Color Palette - Orange, red, yellow, and neutral tones
- 📱 Responsive - Works perfectly on desktop and mobile
- 💾 History Tracking - Keep track of all your generations
- 📋 One-Click Copy - Copy generated code instantly

## Style Variations

Each generation produces five distinct styles:

1. Minimal - Clean, understated design with tight spacing
2. Bold - Eye-catching with generous spacing and thick borders
3. Elegant - Sophisticated with balanced proportions
4. Playful - Fun and dynamic with varied spacing
5. Modern - Contemporary with spacious layouts

## Quick Start

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-ui-generator)

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Vercel will automatically deploy your app
4. Configure your AI settings in the deployed app's Settings tab

### Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/ai-ui-generator.git
cd ai-ui-generator

# Install dependencies
npm install
cd api && npm install && cd ..

# Start development servers (in separate terminals)
# Terminal 1: Start API server
npm run api

# Terminal 2: Start frontend
npm run dev
```

Open http://localhost:5173 and configure your AI settings in the Settings tab.

The API server runs on http://localhost:3000 and the frontend proxies `/api/*` requests to it.

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS, React Router
- Backend: Vercel Serverless Functions
- AI Integration: OpenAI, Anthropic, Custom endpoints
- Styling: Tailwind CSS with custom color palette
- Icons: Lucide React

## Example Instructions

Try these to get started:

```
Create a pricing card with three tiers: Basic, Pro, and Enterprise
```

```
Design a hero section with a bold headline, description, and two CTA buttons
```

```
Build a testimonial card with avatar, quote, author name, and company
```

```
Make a feature grid with icons, titles, and descriptions for 4 features
```

```
Create a contact form with name, email, message, and submit button
```

## Project Structure

```
ai-ui-generator/
├── src/                      # Frontend React application
│   ├── components/           # Reusable React components
│   ├── pages/               # Page components (Generator, Settings, History)
│   ├── services/            # API client and localStorage utilities
│   └── types/               # TypeScript type definitions
├── api/                     # Vercel serverless functions
│   ├── lib/                 # Shared logic (AI client, generator)
│   ├── generate.js          # AI component generation endpoint
│   └── health.js            # Health check endpoint
└── public/                  # Static assets
```

## Configuration

Configure in the UI Settings tab:

OpenAI:
- Model: gpt-4
- Base URL: https://api.openai.com/v1

Anthropic:
- Model: claude-3-5-sonnet-20241022
- Base URL: https://api.anthropic.com

Cerebras:
- Model: llama3.1-8b
- Base URL: https://api.cerebras.ai/v1/chat/completions

Any OpenAI-compatible API:
- Model: your-model
- Base URL: https://your-api.com/v1

## Deployment

### CLI Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
./deploy.sh
```

Automatic Deployments:
- Production: Pushes to main branch
- Preview: Pull requests and feature branches

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Made with ❤️ by developers, for developers
