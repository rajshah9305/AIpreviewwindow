# AI UI Generator

A minimalistic, production-ready UI component generator powered by AI. Transform natural language descriptions into distinct, high-quality UI variations instantly.

## 🚀 Key Features

- **Multi-Variant Generation**: Generate 5 unique design interpretations per request.
- **Provider Agnostic**: Works with OpenAI, Anthropic, Groq, and any OpenAI-compatible API.
- **Live Preview & Code**: Instant visual feedback with one-click code export.
- **Privacy First**: API keys and history are stored locally in your browser.
- **Minimalistic Design**: Clean, focused interface built for productivity.
- **Responsive**: Mobile-first components using Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Serverless Node.js (Vercel Functions).
- **State**: React Context API & LocalStorage for persistence.

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-ui-generator.git
   cd ai-ui-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development environment:
   ```bash
   npm run dev:all
   ```
   Access the app at `http://localhost:5173`.

## ⚙️ Configuration

1. Navigate to the **Settings** page.
2. Enter your AI provider details:
   - **Model Name**: (e.g., `gpt-4o`, `claude-3-5-sonnet-20241022`)
   - **API Key**: Your provider's API key.
   - **Base URL**: Provider endpoint (e.g., `https://api.openai.com/v1`).
3. Save and start generating.

## 🚢 Deployment

Optimized for **Vercel** with zero-config deployment:

```bash
vercel --prod
```

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
