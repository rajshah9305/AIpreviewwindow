# RAJ AI UI — Component Engine

Turn plain English into production-ready UI components. Describe what you want, get five unique design variations instantly.

## Features

- **AI-powered generation** — works with OpenAI, Anthropic, Groq, and any OpenAI-compatible API
- **5 design variations** — Minimalist, Statement, Sophisticated, Expressive, Contemporary
- **Live preview + code export** — iframe preview with one-click copy and HTML download
- **History** — all generations saved locally in the browser
- **Privacy-first** — API keys never leave your browser

## Tech stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, TypeScript, Vite 6            |
| Styling   | Tailwind CSS 3, DM Sans, Space Grotesk  |
| 3D/FX     | Three.js (GLSL shader background)       |
| Routing   | React Router v6                         |
| API       | Node.js serverless functions (Vercel)   |

## Getting started

### Prerequisites

- Node.js 18+

### Install

```bash
git clone https://github.com/yourusername/raj-ai-ui.git
cd raj-ai-ui
npm install
cd api && npm install && cd ..
```

### Run

```bash
# Frontend + API together
npm run dev:all

# Frontend only  →  http://localhost:5173
npm run dev

# API only       →  http://localhost:3000
npm run api
```

### Build

```bash
npm run build    # TypeScript check + Vite build → dist/
npm run preview  # Preview production build locally
```

## Configuration

1. Open the app and go to **Settings**
2. Pick a provider preset (OpenAI, Anthropic, Groq, Together AI) or enter a custom endpoint
3. Enter your model name and API key
4. Click **Test** then **Save**

Settings are stored in `localStorage` — nothing is sent to any server other than your chosen AI provider.

## Project structure

```
raj-ai-ui/
├── api/                    # Serverless API (Vercel functions)
│   ├── lib/
│   │   ├── ai-client.js    # OpenAI / Anthropic HTTP client
│   │   └── generator.js    # Prompt builder + parallel generation
│   ├── dev-server.js       # Express wrapper for local dev
│   ├── generate.js         # POST /api/generate
│   ├── health.js           # GET  /api/health
│   ├── test-connection.js  # POST /api/test-connection
│   └── package.json
├── public/
│   ├── favicon.svg
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── glsl-hills.tsx      # Three.js animated background
│   │   ├── ComponentPreview.tsx    # iframe preview + code viewer
│   │   ├── ConfirmDialog.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Layout.tsx              # Nav + page shell
│   │   ├── LoadingSkeleton.tsx
│   │   ├── Toast.tsx
│   │   └── ToastContainer.tsx
│   ├── config/
│   │   └── constants.ts
│   ├── contexts/
│   │   └── GenerationContext.tsx
│   ├── hooks/
│   │   ├── useHistory.ts
│   │   ├── useKeyboardShortcut.ts
│   │   └── useSettings.ts
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── preview-template.ts
│   │   ├── storage.ts
│   │   └── validation.ts
│   ├── pages/
│   │   ├── Generator.tsx
│   │   ├── History.tsx
│   │   └── Settings.tsx
│   ├── styles/
│   │   └── typography.css
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vercel.json
```

## API endpoints

| Method | Path                   | Description                    |
|--------|------------------------|--------------------------------|
| POST   | `/api/generate`        | Generate 5 component variations|
| GET    | `/api/health`          | Health check                   |
| POST   | `/api/test-connection` | Test provider reachability     |

### `POST /api/generate`

```json
// Request
{ "instruction": "A pricing card with 3 tiers", "settings": { "modelName": "gpt-4o", "apiKey": "sk-...", "baseUrl": "https://api.openai.com/v1" } }

// Response
{ "instruction": "...", "variations": [...], "timestamp": 1234567890, "modelName": "gpt-4o", "provider": "OpenAI" }
```

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel --prod
```

The repo includes `vercel.json` with routing and function configuration. No environment variables are required — all credentials are supplied by the user at runtime.

## License

MIT — see [LICENSE](LICENSE)
