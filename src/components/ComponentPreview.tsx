import { useState, useRef, useEffect } from 'react'
import { Code, Eye, Copy, Check, AlertCircle, Maximize2, Minimize2 } from 'lucide-react'
import { ComponentVariation } from '../types'

interface ComponentPreviewProps {
  variation: ComponentVariation;
  isLoading?: boolean;
}

export default function ComponentPreview({ variation, isLoading = false }: ComponentPreviewProps) {
  const [showCode, setShowCode] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe || showCode) return
    
    const adjustHeight = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (iframeDoc) {
          // Height adjustment logic kept for potential future use
        }
      } catch (e) {
        // Error handling
      }
    }
    
    const handleError = () => {
      setLoadError(true)
    }
    
    iframe.addEventListener('load', adjustHeight)
    iframe.addEventListener('error', handleError)
    
    return () => {
      iframe.removeEventListener('load', adjustHeight)
      iframe.removeEventListener('error', handleError)
    }
  }, [showCode, variation.code])
  
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(variation.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }
  
  const styleColors = {
    minimal: 'from-neutral-500 to-neutral-600',
    bold: 'from-accent-500 to-primary-500',
    elegant: 'from-primary-400 to-accent-400',
    playful: 'from-yellow-500 to-primary-500',
    modern: 'from-primary-500 to-accent-500',
  }
  
  if (isLoading) {
    return (
      <div className="card overflow-hidden animate-fade-in">
        <div className="p-3 bg-gradient-to-r from-neutral-50 to-primary-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${styleColors[variation.style]} shadow-sm animate-pulse`} />
            <h4 className="font-semibold text-sm text-neutral-900">{variation.name}</h4>
          </div>
          
          <div className="flex items-center space-x-1">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 animate-pulse" />
            <div className="w-8 h-8 rounded-lg bg-neutral-100 animate-pulse" />
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-neutral-50 to-primary-50/30">
          <div className="w-full bg-white rounded-lg shadow-sm p-8 space-y-4" style={{ minHeight: '300px' }}>
            <div className="flex items-center justify-center py-12">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-neutral-200" />
                <div 
                  className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"
                  style={{ animationDuration: '1s' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary-100 animate-pulse" />
                </div>
              </div>
            </div>
            
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-3/4 mx-auto" />
              <div className="h-4 bg-neutral-200 rounded w-1/2 mx-auto" />
              <div className="h-4 bg-neutral-200 rounded w-5/6 mx-auto" />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-neutral-500 animate-pulse">
                Generating {variation.name.toLowerCase()}...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[90] animate-fade-in"
          onClick={() => setIsExpanded(false)}
        />
      )}
      <div className={`bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] h-full flex flex-col border border-neutral-200/60 hover:border-primary-300/50 group/card ${isExpanded ? 'fixed inset-4 sm:inset-10 z-[100] !w-auto !h-auto shadow-2xl ring-1 ring-black/5' : 'relative'}`}>
        <div className="px-4 sm:px-5 py-3 sm:py-4 bg-white border-b border-neutral-100 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br ${styleColors[variation.style]} shadow-sm group-hover/card:scale-125 transition-transform duration-500`} />
            <div className="flex flex-col">
              <h4 className="font-bold text-xs sm:text-[13px] text-neutral-900 tracking-tight leading-none">{variation.name}</h4>
              <span className="text-[8px] sm:text-[9px] font-black text-neutral-400 uppercase tracking-widest mt-1">{variation.style}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowCode(!showCode)}
              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-300 focus:outline-none ${
                showCode
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                  : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
              title={showCode ? 'Show Preview' : 'Show Code'}
            >
              {showCode ? <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            <button
              onClick={copyCode}
              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-300 focus:outline-none ${
                copied
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                  : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
              title="Copy Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-300 focus:outline-none ${
                isExpanded
                  ? 'bg-neutral-900 text-white shadow-lg'
                  : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
              title={isExpanded ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          </div>
        </div>
      
      {showCode ? (
        <div className="relative flex-1 bg-neutral-900 overflow-hidden group/code">
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover/code:opacity-100 transition-opacity">
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-mono text-white/70 border border-white/10">
              JSX • Tailwind CSS
            </div>
          </div>
          <div className="h-full overflow-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
            <pre className="text-xs text-primary-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
              <code className="block">{variation.code}</code>
            </pre>
          </div>
        </div>
      ) : loadError ? (
        <div className="p-6 bg-gradient-to-br from-neutral-50 to-primary-50/30 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <p className="text-xs font-medium text-neutral-900">Failed to load preview</p>
            <p className="text-[10px] text-neutral-600">The component code may contain errors</p>
            <button
              onClick={() => setShowCode(true)}
              className="text-[10px] text-primary-600 hover:text-primary-700 underline"
            >
              View code instead
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-neutral-50/30 flex-1 overflow-auto scrollbar-hide">
          <div className={`w-full h-full min-h-[500px] transition-all duration-500 ${isExpanded ? 'min-h-[70vh]' : ''}`}>
            <iframe
              ref={iframeRef}
              srcDoc={`
                <!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                      body {
                        margin: 0;
                        padding: 16px;
                        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        background: transparent;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100%;
                      }
                      * {
                        box-sizing: border-box;
                      }
                    </style>
                  </head>
                  <body>
                    ${variation.code}
                  </body>
                </html>
              `}
              className="w-full h-full border-0 bg-white rounded-lg shadow-sm transition-opacity duration-300"
              sandbox="allow-scripts"
              title={`Preview of ${variation.name}`}
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
    </>
  )
}
