import { useState, useRef } from 'react'
import { Code, Eye, Copy, Check, Maximize2, Minimize2 } from 'lucide-react'
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
  
  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-neutral-900/10 backdrop-blur-sm z-[90] animate-fade-in"
          onClick={() => setIsExpanded(false)}
        />
      )}
      <div className={`bg-white rounded-3xl overflow-hidden border border-neutral-100 flex flex-col group/card ${
        isExpanded
          ? 'fixed inset-4 sm:inset-12 z-[100] shadow-2xl ring-1 ring-black/5'
          : 'relative h-full hover:border-neutral-200 hover:shadow-xl transition-all duration-300'
      }`}>
        <div className="px-5 py-3 border-b border-neutral-50 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-neutral-900 tracking-tight leading-none">{variation.name}</span>
              <span className="text-[9px] text-neutral-400 font-medium uppercase tracking-widest mt-0.5">{variation.style}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowCode(!showCode)}
              className={`p-2 rounded-lg transition-colors ${
                showCode ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
              title={showCode ? 'Preview' : 'Code'}
            >
              {showCode ? <Eye className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={copyCode}
              className={`p-2 rounded-lg transition-colors ${
                copied ? 'bg-green-50 text-green-600' : 'text-neutral-400 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
              title="Copy"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
              title={isExpanded ? 'Minimize' : 'Maximize'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      
        <div className="flex-1 overflow-hidden relative bg-neutral-50/30">
          {showCode ? (
            <div className="h-full overflow-auto p-6 bg-neutral-900">
              <pre className="text-[11px] text-neutral-300 font-mono leading-relaxed">
                <code>{variation.code}</code>
              </pre>
            </div>
          ) : (
            <div className="h-full flex flex-col p-6 sm:p-8">
              <iframe
                ref={iframeRef}
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <script src="https://cdn.tailwindcss.com"></script>
                      <style>
                        body {
                          margin: 0;
                          padding: 2rem;
                          background: transparent;
                          font-family: system-ui, -apple-system, sans-serif;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          min-height: 100vh;
                        }
                      </style>
                    </head>
                    <body>${variation.code}</body>
                  </html>
                `}
                className="w-full h-full border-0 bg-white rounded-2xl shadow-sm"
                title={variation.name}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
