# AI UI Component Generator

<div align="center">

🎨 **Transform natural language into beautiful UI components instantly**

A sophisticated web application that interprets your instructions and automatically generates five distinct, visually engaging UI component variations with live preview.

</div>

---

## ✨ Features

- 🤖 **AI-Powered Generation** - Natural language to UI component conversion
- 🎭 **Five Unique Variations** - Each with distinct layouts, styles, and interactions
- 👁️ **Live Preview** - See your components rendered in real-time
- 🔌 **Flexible AI Integration** - Works with OpenAI, Anthropic, or any compatible API
- ⚙️ **Easy Configuration** - Simple settings interface for model, API key, and endpoint
- 🎨 **Beautiful Design** - Cohesive interface with exceptional aesthetics
- 🌈 **Smart Color Palette** - Orange, red, yellow, and neutral tones (no purple/blue)
- 📱 **Responsive** - Works perfectly on desktop and mobile
- 💾 **History Tracking** - Keep track of all your generations
- 📋 **One-Click Copy** - Copy generated code instantly

## 🎯 Style Variations

Each generation produces five distinct styles:

1. **Minimal** - Clean, understated design with tight spacing
2. **Bold** - Eye-catching with generous spacing and thick borders
3. **Elegant** - Sophisticated with balanced proportions
4. **Playful** - Fun and dynamic with varied spacing
5. **Modern** - Contemporary with spacious layouts

## 🚀 Quick Start

### Automated Setup (Recommended)

```bash
# Clone and setup
git clone https://github.com/yourusername/ai-ui-generator.git
cd ai-ui-generator
./setup.sh

# Start backend (Terminal 1)
npm run backend

# Start frontend (Terminal 2)
npm run dev
```

### Manual Setup

```bash
# Install dependencies
npm run setup

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your API key

# Start servers
npm run backend  # Terminal 1
npm run dev      # Terminal 2
```

Open http://localhost:5173 and configure your AI settings in the Settings tab.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express, ES Modules
- **AI Integration**: OpenAI, Anthropic, Custom endpoints
- **Styling**: Tailwind CSS with custom color palette
- **Icons**: Lucide React



## 🎨 Example Instructions

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

## 📁 Project Structure

```
ai-ui-generator/
├── src/                      # Frontend React application
│   ├── components/           # Reusable React components
│   ├── pages/               # Page components (Generator, Settings, History)
│   ├── services/            # API client and localStorage utilities
│   └── types/               # TypeScript type definitions
├── api/                     # Vercel serverless functions
│   ├── generate.js          # AI component generation endpoint
│   └── health.js            # Health check endpoint
├── backend/                 # Local development server (Express)
│   └── src/                 # Backend logic (mirrors api/ for local dev)
└── public/                  # Static assets
```

## ⚙️ Configuration

### AI Settings

Configure in the UI Settings tab or via environment variables:

**OpenAI:**
```env
DEFAULT_MODEL=gpt-4
DEFAULT_API_KEY=sk-...
DEFAULT_BASE_URL=https://api.openai.com/v1
```

**Anthropic:**
```env
DEFAULT_MODEL=claude-3-opus-20240229
DEFAULT_API_KEY=sk-ant-...
DEFAULT_BASE_URL=https://api.anthropic.com
```

**Custom Endpoint:**
```env
DEFAULT_MODEL=your-model
DEFAULT_API_KEY=your-key
DEFAULT_BASE_URL=https://your-endpoint.com/v1
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-ui-generator)

**One-Click Deploy:**
1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Vercel will automatically deploy your app
4. Configure your AI settings in the deployed app's Settings tab

**CLI Deploy:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
./deploy.sh
```

**Automatic Deployments:**
- Production: Pushes to `main` branch
- Preview: Pull requests and feature branches

**Documentation:**
- See deploy.sh for automated deployment
- GitHub Actions workflows for CI/CD

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Built with React and Express
- Styled with Tailwind CSS
- Icons by Lucide
- Powered by OpenAI and Anthropic APIs

## 📞 Support

- 🐛 [Report Bug](https://github.com/yourusername/ai-ui-generator/issues)
- 💡 [Request Feature](https://github.com/yourusername/ai-ui-generator/issues)

---

<div align="center">

Made with ❤️ by developers, for developers

⭐ Star this repo if you find it helpful!

</div>
