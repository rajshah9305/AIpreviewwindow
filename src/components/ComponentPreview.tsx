import { useState, useRef } from 'react'
import { Code, Eye, Copy, Check, Maximize2, Minimize2, ExternalLink } from 'lucide-react'
import { ComponentVariation } from '../types'

interface ComponentPreviewProps {
  variation: ComponentVariation;
}

export default function ComponentPreview({ variation }: ComponentPreviewProps) {
  const [showCode, setShowCode] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(variation.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Silently fail
    }
  }
  
  const openInNewTab = () => {
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${variation.name} - AI UI Preview</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
            <script src="https://cdn.tailwindcss.com"></script>
            <script src="https://unpkg.com/lucide@latest"></script>
            <style>
              body {
                margin: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f9fafb;
                padding: 2rem;
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                -webkit-font-smoothing: antialiased;
              }
              h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', sans-serif; }
            </style>
          </head>
          <body>
            ${variation.code}
            <script>
              if (window.lucide) {
                lucide.createIcons();
              }
            </script>
          </body>
        </html>
      `)
      newWindow.document.close()
    }
  }

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] animate-fade-in"
          onClick={() => setIsExpanded(false)}
        />
      )}
      <div className={`bg-white rounded-2xl overflow-hidden border border-neutral-100 flex flex-col group/card transition-all duration-500 ${
        isExpanded
          ? 'fixed inset-3 sm:inset-6 md:inset-10 z-[120] shadow-2xl ring-1 ring-black/5'
          : 'relative h-full hover:border-orange-500/20 hover:shadow-premium'
      }`}>
        <div className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 border-b border-neutral-50 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md">
          <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-4 min-w-0">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full bg-orange-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] sm:text-[11px] md:text-xs font-bold text-black tracking-tight leading-none truncate">{variation.name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 shrink-0">
            <button
              onClick={() => setShowCode(!showCode)}
              className={`p-1 sm:p-1.5 md:p-2 rounded-lg md:rounded-xl transition-all duration-300 touch-manipulation ${
                showCode ? 'bg-black text-white' : 'text-neutral-400 hover:bg-neutral-50 hover:text-black'
              }`}
              title={showCode ? 'View Preview' : 'View Code'}
            >
              {showCode ? <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" /> : <Code className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />}
            </button>

            <button
              onClick={copyCode}
              className={`p-1 sm:p-1.5 md:p-2 rounded-lg md:rounded-xl transition-all duration-300 touch-manipulation ${
                copied ? 'bg-orange-500 text-white' : 'text-neutral-400 hover:bg-neutral-50 hover:text-black'
              }`}
              title="Copy Code"
            >
              {copied ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" /> : <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />}
            </button>

            <button
              onClick={openInNewTab}
              className="p-1 sm:p-1.5 md:p-2 rounded-lg md:rounded-xl text-neutral-400 hover:bg-neutral-50 hover:text-black transition-all duration-300 hidden sm:flex touch-manipulation"
              title="Open in New Tab"
            >
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 sm:p-1.5 md:p-2 rounded-lg md:rounded-xl text-neutral-400 hover:bg-neutral-50 hover:text-black transition-all duration-300 touch-manipulation"
              title={isExpanded ? 'Minimize' : 'Expand'}
            >
              {isExpanded ? <Minimize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" /> : <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />}
            </button>
          </div>
        </div>
      
        <div className="flex-1 overflow-hidden relative bg-neutral-50/20">
          {showCode ? (
            <div className="h-full overflow-auto p-3 sm:p-4 md:p-8 bg-black">
              <pre className="text-[9px] sm:text-[10px] md:text-[11px] text-orange-200/80 font-mono leading-relaxed selection:bg-orange-500/30">
                <code>{variation.code}</code>
              </pre>
            </div>
          ) : (
            <div className={`h-full flex flex-col transition-all duration-700 ${isExpanded ? 'p-4 sm:p-6 md:p-12' : 'p-3 sm:p-4 md:p-6 lg:p-8'}`}>
              <iframe
                ref={iframeRef}
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                      <link rel="preconnect" href="https://fonts.googleapis.com">
                      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
                      <script src="https://cdn.tailwindcss.com"></script>
                      <script src="https://unpkg.com/lucide@latest"></script>
                      <style>
                        body {
                          margin: 0;
                          padding: 1rem;
                          background: white;
                          font-family: 'Inter', system-ui, -apple-system, sans-serif;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          min-height: 100vh;
                          -webkit-font-smoothing: antialiased;
                        }
                        @media (min-width: 640px) {
                          body { padding: 2rem; }
                        }
                        h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', sans-serif; }
                        body::-webkit-scrollbar { display: none; }
                        body { -ms-overflow-style: none; scrollbar-width: none; }
                      </style>
                    </head>
                    <body>
                      ${variation.code}
                      <script>
                        if (window.lucide) {
                          lucide.createIcons();
                        }
                      </script>
                    </body>
                  </html>
                `}
                className="w-full h-full border-0 bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-premium"
                title={variation.name}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
