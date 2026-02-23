import { useState, useRef, useCallback } from 'react'
import { Code, Eye, Copy, Check, Maximize2, Minimize2, ExternalLink, Download } from 'lucide-react'
import { ComponentVariation } from '../types'

interface ComponentPreviewProps {
  variation: ComponentVariation;
}

const STYLE_COLORS: Record<string, string> = {
  minimal: 'bg-neutral-100 text-neutral-600',
  bold: 'bg-orange-500/10 text-orange-600',
  elegant: 'bg-amber-50 text-amber-700',
  playful: 'bg-emerald-50 text-emerald-600',
  modern: 'bg-sky-50 text-sky-600',
}

export default function ComponentPreview({ variation }: ComponentPreviewProps) {
  const [showCode, setShowCode] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(variation.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silently fail
    }
  }, [variation.code])

  const downloadCode = useCallback(() => {
    const blob = new Blob([variation.code], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${variation.name.toLowerCase().replace(/\s+/g, '-')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [variation])
  
  const openInNewTab = useCallback(() => {
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${variation.name} - AI UI Preview</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
            <script src="https://cdn.tailwindcss.com"><\/script>
            <script src="https://unpkg.com/lucide@latest"><\/script>
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
              h1, h2, h3, h4, h5, h6 { font-family: 'Space Grotesk', sans-serif; font-weight: 700; letter-spacing: -0.02em; }
            </style>
          </head>
          <body>
            ${variation.code}
            <script>
              if (window.lucide) { lucide.createIcons(); }
            <\/script>
          </body>
        </html>
      `)
      newWindow.document.close()
    }
  }, [variation])

  const styleBadgeClass = STYLE_COLORS[variation.style] || STYLE_COLORS.modern

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-[110] animate-fade-in"
          onClick={() => setIsExpanded(false)}
          role="button"
          aria-label="Close expanded view"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && setIsExpanded(false)}
        />
      )}
      <div className={`bg-white rounded-2xl overflow-hidden border flex flex-col group/card transition-all duration-500 ${
        isExpanded
          ? 'fixed inset-4 sm:inset-8 md:inset-12 z-[120] shadow-2xl border-neutral-200/60'
          : 'relative h-full w-full border-neutral-100/80 hover:border-neutral-200 hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)]'
      }`}>
        {/* Header */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-neutral-100/60 flex items-center justify-between shrink-0 bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 ring-2 ring-orange-500/10" />
            <span className="text-[11px] sm:text-xs font-display font-bold text-neutral-900 tracking-tight leading-none truncate" style={{ fontWeight: 750 }}>
              {variation.name}
            </span>
            <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-md text-[8px] font-display font-bold uppercase tracking-widest ${styleBadgeClass}`}>
              {variation.style}
            </span>
          </div>
          
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <ToolbarButton
              onClick={() => setShowCode(!showCode)}
              active={showCode}
              title={showCode ? 'View Preview' : 'View Code'}
            >
              {showCode ? <Eye className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
            </ToolbarButton>

            <ToolbarButton
              onClick={copyCode}
              active={copied}
              activeClass="bg-green-500 text-white"
              title="Copy Code"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </ToolbarButton>

            <ToolbarButton onClick={downloadCode} title="Download HTML" className="hidden sm:flex">
              <Download className="w-3.5 h-3.5" />
            </ToolbarButton>

            <ToolbarButton onClick={openInNewTab} title="Open in New Tab" className="hidden sm:flex">
              <ExternalLink className="w-3.5 h-3.5" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Minimize' : 'Expand'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </ToolbarButton>
          </div>
        </div>
      
        {/* Content */}
        <div className="flex-1 overflow-hidden relative min-h-0">
          {showCode ? (
            <div className="h-full overflow-auto p-4 sm:p-6 bg-[#0d0d0d]">
              <pre className="text-[10px] sm:text-[11px] text-neutral-400 font-mono leading-relaxed selection:bg-orange-500/20 selection:text-orange-300 whitespace-pre-wrap break-words">
                <code>{variation.code}</code>
              </pre>
            </div>
          ) : (
            <div className={`h-full w-full flex flex-col transition-all duration-500 ${isExpanded ? 'p-4 sm:p-8 md:p-12' : 'p-2 sm:p-3 md:p-4'}`}>
              <iframe
                ref={iframeRef}
                srcDoc={buildIframeSrcDoc(variation.code)}
                className="w-full h-full border-0 bg-white rounded-xl"
                title={variation.name}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

interface ToolbarButtonProps {
  onClick: () => void
  title: string
  active?: boolean
  activeClass?: string
  className?: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, title, active, activeClass, className = '', children }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 touch-manipulation ${
        active
          ? (activeClass || 'bg-neutral-900 text-white')
          : 'text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700'
      } ${className}`}
      title={title}
    >
      {children}
    </button>
  )
}

function buildIframeSrcDoc(code: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"><\/script>
        <script src="https://unpkg.com/lucide@latest"><\/script>
        <style>
          * { box-sizing: border-box; }
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
            -moz-osx-font-smoothing: grayscale;
            overflow: auto;
          }
          @media (min-width: 640px) { body { padding: 1.5rem; } }
          @media (min-width: 768px) { body { padding: 2rem; } }
          h1, h2, h3, h4, h5, h6 { 
            font-family: 'Space Grotesk', sans-serif; 
            font-weight: 700; 
            letter-spacing: -0.02em; 
          }
          body::-webkit-scrollbar { width: 4px; height: 4px; }
          body::-webkit-scrollbar-track { background: transparent; }
          body::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 2px; }
          img { max-width: 100%; height: auto; }
          button, a { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
        </style>
      </head>
      <body>
        ${code}
        <script>
          if (window.lucide) { lucide.createIcons(); }
        <\/script>
      </body>
    </html>
  `
}
