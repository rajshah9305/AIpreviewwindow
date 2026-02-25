# RAJ AI UI - Next-Gen Component Engine

Transform your thoughts into premium UI components with AI. Build faster, design better.

## ✨ Production-Ready & Mobile-Optimized

This application has been fully optimized for mobile devices with a production-ready design featuring:
- **48px minimum touch targets** for all interactive elements
- **Enhanced visual hierarchy** with bold borders and premium shadows
- **Larger typography** for better mobile readability
- **Smooth animations** and polished interactions
- **WCAG 2.1 AA compliant** accessibility standards
- **Cross-device tested** on iOS and Android

## 🚀 Key Features

- **AI-Powered Generation**: Create 5 unique UI component variations from natural language
- **Fully Responsive**: Optimized for mobile, tablet, and desktop with adaptive layouts
- **Provider Agnostic**: Works with OpenAI, Anthropic, Groq, and any OpenAI-compatible API
- **Live Preview & Code**: Instant visual feedback with one-click code export
- **Privacy First**: API keys and history stored locally in your browser
- **Touch-Optimized**: Mobile-first design with 48px+ touch targets
- **Beautiful Animations**: Smooth transitions and GLSL shader background effects
- **History Management**: Track and revisit previous generations

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript, Vite 5, Tailwind CSS 3
- **UI Components**: Lucide React icons, Three.js (GLSL shaders)
- **Routing**: React Router v6
- **Backend**: Node.js serverless functions (Vercel)
- **State Management**: React Context API + LocalStorage

## 📱 Mobile-First Responsive Design

The application is fully optimized for all screen sizes with mobile-first approach:

### Mobile (< 640px) - Fully Optimized
- **Enhanced touch targets**: Minimum 48px for all interactive elements
- **Larger typography**: 16px base font size (prevents iOS zoom)
- **Bold visual hierarchy**: 2px borders and premium shadows
- **Fixed bottom navigation**: Easy thumb access with prominent active states
- **Horizontal card scrolling**: Smooth snap points with scroll indicators
- **Optimized input area**: Large textarea and generate button
- **Safe area support**: Proper handling of notches on iOS devices

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

### Mobile Optimizations
- **Touch-first interactions**: All buttons, inputs, and links properly sized
- **Enhanced spacing**: Generous padding and margins for better UX
- **Improved readability**: Better text contrast and larger font sizes
- **Smooth animations**: 60fps performance on mobile devices
- **Optimized scrolling**: Momentum scrolling with snap points

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
- **Optimized bundle size**: Code splitting with lazy loading
- **Efficient rendering**: React hooks and memoization
- **Fast interactions**: Debounced input handling
- **Smooth animations**: 60fps performance
- **Quick load times**: Optimized assets and fonts

### User Experience
- **Touch-first design**: 48px minimum touch targets (WCAG compliant)
- **Enhanced visual hierarchy**: Bold 2px borders and premium shadows
- **Smooth animations**: Polished transitions throughout
- **Loading states**: Skeleton screens for better perceived performance
- **Error handling**: Graceful error boundaries with clear messaging
- **Toast notifications**: Prominent user feedback
- **Horizontal scrolling**: Smooth snap points with indicators
  
### Accessibility (WCAG 2.1 AA Compliant)
- **Touch targets**: Minimum 48px for all interactive elements
- **Color contrast**: Enhanced text colors for better readability
- **Semantic HTML**: Proper structure and landmarks
- **ARIA labels**: Complete screen reader support
- **Keyboard navigation**: Full keyboard accessibility
- **Focus management**: Clear focus indicators
- **Responsive text**: Scales properly with user preferences

### Mobile-Specific Enhancements
- **iOS optimization**: 16px minimum font size (prevents zoom on input)
- **Safe areas**: Proper notch handling on modern devices
- **Touch actions**: Optimized tap response with `touch-manipulation`
- **Viewport config**: `viewport-fit=cover` for full-screen experience
- **Smooth scrolling**: Momentum scrolling with snap points
- **Fixed positioning**: Bottom navigation and input area
- **Enhanced spacing**: Larger padding and margins for mobile
- **Better borders**: 2px borders for improved visibility

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

### Desktop
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Mobile (Fully Tested & Optimized)
- iOS Safari 14+
- Chrome Mobile 90+
- Firefox Mobile 90+
- Samsung Internet 14+

### Tested Devices
- iPhone SE, 12, 13, 14, 14 Pro Max
- Android phones (360px - 430px)
- iPad Mini, iPad Pro
- Various Android tablets

## 🚢 Deployment

### Production Build

```bash
# Build the application
npm run build

# Preview production build locally
npm run preview
```

### Deploy to Vercel (Recommended)

Optimized for **Vercel** with zero-config deployment:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to production
vercel --prod
```

The project includes:
- `vercel.json` for routing configuration
- `.vercelignore` for build optimization
- Serverless API functions in `/api`
- Automatic HTTPS and CDN

### Pre-Deployment Checklist

✅ **Code Quality**
- All TypeScript checks pass
- No console errors or warnings
- Production build succeeds
- All imports resolve correctly

✅ **Functionality**
- All pages load correctly
- Navigation works on all devices
- Forms submit and validate properly
- API endpoints respond correctly
- Error handling works gracefully

✅ **Mobile Optimization**
- Touch targets meet 48px minimum
- Text is readable (16px+ base)
- Scrolling is smooth
- Safe areas handled properly
- iOS zoom prevention works

✅ **Accessibility**
- WCAG 2.1 AA standards met
- Keyboard navigation works
- Focus indicators visible
- Color contrast sufficient
- Screen reader compatible

✅ **Performance**
- Bundle size optimized
- Images compressed
- Fonts loaded efficiently
- Animations run at 60fps
- No layout shifts

✅ **Cross-Browser**
- Tested on Chrome, Firefox, Safari
- Mobile browsers verified
- No browser-specific issues

### Environment Variables

For production deployment, ensure your API provider settings are configured:

1. Navigate to Settings page
2. Enter your API credentials:
   - Model Name (e.g., `gpt-4o`)
   - API Key
   - Base URL (e.g., `https://api.openai.com/v1`)
3. Test connection
4. Save settings

Settings are stored locally in browser localStorage.

### Post-Deployment Verification

After deployment, verify:
1. ✅ Homepage loads correctly
2. ✅ Navigation works on all pages
3. ✅ Settings can be saved
4. ✅ Generation works with valid API key
5. ✅ History saves and loads
6. ✅ Mobile experience is smooth
7. ✅ All animations work
8. ✅ Error states display properly

## 🎨 Design System

### Colors
- **Primary**: Neutral 900 (Black)
- **Accent**: Orange 500 (#f97316)
- **Success**: Green 500
- **Error**: Red 500
- **Warning**: Orange 500

### Typography
- **Display**: Space Grotesk (headings, 300-700)
- **Body**: Inter (text, 100-900)
- **Accent**: DM Sans (UI elements, 100-1000)
- **Mono**: JetBrains Mono (code, 400-700)

### Spacing Scale
- **Base unit**: 4px (0.25rem)
- **Touch targets**: Minimum 48px (12 units)
- **Comfortable spacing**: 16px-24px (4-6 units)

### Shadow System
- **sm**: `0 4px 16px rgba(0,0,0,0.04)`
- **md**: `0 8px 32px rgba(0,0,0,0.06)`
- **lg**: `0 12px 48px rgba(0,0,0,0.1)`
- **xl**: `0 16px 64px rgba(0,0,0,0.12)`

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🐛 Troubleshooting

### Build Issues

**TypeScript errors:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**Vite build fails:**
- Check Node.js version (18+ required)
- Ensure all dependencies are installed
- Clear `.vite` cache folder

### Runtime Issues

**API calls failing:**
- Verify API key is correct in Settings
- Check Base URL matches your provider
- Ensure CORS is properly configured
- Check browser console for errors

**Components not rendering:**
- Clear browser cache
- Check browser console for errors
- Verify all routes are configured
- Ensure localStorage is enabled

**Mobile issues:**
- Clear browser cache on mobile
- Test in different mobile browsers
- Check viewport meta tag
- Verify touch events work

### Common Solutions

**iOS zoom on input focus:**
- Already handled with `font-size: max(16px, 1rem)`

**Safe area issues on notched devices:**
- Already handled with `safe-area-inset-*` CSS

**Slow performance:**
- Check for console errors
- Disable browser extensions
- Clear browser cache
- Verify network connection

## 🙏 Acknowledgments

- Built with React, Tailwind CSS, and Three.js
- Icons by Lucide
- Fonts: Inter, Space Grotesk, DM Sans, and JetBrains Mono from Google Fonts
- Inspired by modern design systems and mobile-first principles
