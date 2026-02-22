# RAJ AI UI - Next-Gen Component Engine

Transform your thoughts into premium UI components with AI. Build faster, design better.

## 🚀 Key Features

- **AI-Powered Generation**: Create 5 unique UI component variations from natural language
- **Fully Responsive**: Optimized for mobile, tablet, and desktop with adaptive layouts
- **Provider Agnostic**: Works with OpenAI, Anthropic, Groq, and any OpenAI-compatible API
- **Live Preview & Code**: Instant visual feedback with one-click code export
- **Privacy First**: API keys and history stored locally in your browser
- **Touch-Optimized**: Mobile-first design with touch-friendly interactions
- **Beautiful Animations**: Smooth transitions and GLSL shader background effects
- **History Management**: Track and revisit previous generations

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript, Vite 5, Tailwind CSS 3
- **UI Components**: Lucide React icons, Three.js (GLSL shaders)
- **Routing**: React Router v6
- **Backend**: Node.js serverless functions (Vercel)
- **State Management**: React Context API + LocalStorage

## 📱 Responsive Design

The application is fully optimized for all screen sizes:

### Mobile (< 640px)
- Compact navigation with icon-only buttons
- Optimized touch targets (minimum 44x44px)
- Single column layouts
- Touch-friendly interactions
- Reduced spacing for better content density

### Tablet (640px - 1024px)
- Two-column grid layouts
- Medium-sized components
- Balanced spacing
- Adaptive navigation with labels

### Desktop (> 1024px)
- Three-column grid layouts
- Full-featured navigation
- Larger preview areas
- Enhanced hover effects

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ and npm

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

### Development Commands

```bash
# Run both frontend and API
npm run dev:all

# Run frontend only (port 5173)
npm run dev

# Run API server only (port 3000)
npm run api

# Build for production
npm run build

# Preview production build
npm run preview
```

## ⚙️ Configuration

### AI Provider Setup

1. Navigate to the **Settings** page
2. Choose a preset or configure manually:
   - **Model Name**: e.g., `gpt-4o`, `claude-3-5-sonnet-20241022`, `llama-3.1-70b-versatile`
   - **API Key**: Your provider's API key
   - **Base URL**: Provider endpoint (e.g., `https://api.openai.com/v1`)
3. Save and start generating

### Supported Providers

- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-3.5
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus
- **Groq**: Llama 3.1, Mixtral
- Any OpenAI-compatible API

## 🎯 Key Optimizations

### Performance
- Optimized bundle size with code splitting ready
- Efficient re-renders with React hooks
- Debounced input handling
- Memoized components
- Lazy loading support

### User Experience
- Touch-friendly buttons with `touch-manipulation`
- Smooth animations and transitions
- Loading skeletons for better perceived performance
- Error boundaries for graceful error handling
- Toast notifications for user feedback
  
### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- High contrast ratios
- Responsive text sizing

### Mobile-Specific
- Optimized viewport meta tags
- Touch action optimization
- Tap highlight removal
- Smooth scrolling
- Responsive iframe rendering
- Adaptive font sizes and spacing

## 📁 Project Structure

```
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # UI primitives (GLSL effects)
│   │   ├── Layout.tsx
│   │   ├── ComponentPreview.tsx
│   │   └── ...
│   ├── contexts/        # React contexts
│   ├── pages/          # Page components
│   │   ├── Generator.tsx
│   │   ├── History.tsx
│   │   └── Settings.tsx
│   ├── services/       # API services
│   ├── types/          # TypeScript types
│   └── index.css       # Global styles
├── api/                # Backend API
│   ├── lib/           # API utilities
│   │   ├── ai-client.js
│   │   └── generator.js
│   ├── generate.js    # Generation endpoint
│   └── health.js      # Health check
└── public/            # Static assets
```

## 🔌 API Endpoints

- `POST /api/generate` - Generate UI components
  - Body: `{ instruction: string, settings: AISettings }`
  - Returns: `GenerationResult` with 5 variations

- `GET /api/health` - Health check endpoint

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## 🚢 Deployment

Optimized for **Vercel** with zero-config deployment:

```bash
vercel --prod
```

The project includes:
- `vercel.json` for routing configuration
- `.vercelignore` for build optimization
- Serverless API functions in `/api`

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Built with React, Tailwind CSS, and Three.js
- Icons by Lucide
- Fonts: Inter and Poppins from Google Fonts
