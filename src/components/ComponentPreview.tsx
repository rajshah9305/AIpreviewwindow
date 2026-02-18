import { useState, useRef, useEffect } from 'react'
import { Code, Eye, Copy, Check, AlertCircle } from 'lucide-react'
import { ComponentVariation } from '../types'

interface ComponentPreviewProps {
  variation: ComponentVariation;
  isLoading?: boolean;
}

export default function ComponentPreview({ variation, isLoading = false }: ComponentPreviewProps) {
  const [showCode, setShowCode] = useState(false)
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
    <div className="card overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col">
      <div className="p-3 bg-gradient-to-r from-neutral-50 to-primary-50 border-b border-neutral-200 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${styleColors[variation.style]} shadow-sm`} />
          <h4 className="font-semibold text-sm text-neutral-900">{variation.name}</h4>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowCode(!showCode)}
            className={`p-1.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              showCode 
                ? 'bg-primary-500 text-white shadow-md' 
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
            title={showCode ? 'Show Preview' : 'Show Code'}
            aria-label={showCode ? 'Show Preview' : 'Show Code'}
          >
            {showCode ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          
          <button
            onClick={copyCode}
            className="p-1.5 rounded-lg bg-white text-neutral-600 hover:bg-neutral-100 transition-all duration-200 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            title="Copy Code"
            aria-label="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {showCode ? (
        <div className="p-4 bg-neutral-900 overflow-x-auto flex-1 overflow-y-auto">
          <pre className="text-xs text-neutral-100 font-mono leading-relaxed">
            <code>{variation.code}</code>
          </pre>
        </div>
      ) : loadError ? (
        <div className="p-8 bg-gradient-to-br from-neutral-50 to-primary-50/30 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-sm font-medium text-neutral-900">Failed to load preview</p>
            <p className="text-xs text-neutral-600">The component code may contain errors</p>
            <button
              onClick={() => setShowCode(true)}
              className="text-xs text-primary-600 hover:text-primary-700 underline"
            >
              View code instead
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gradient-to-br from-neutral-50 to-primary-50/30 flex-1 overflow-hidden">
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
                      padding: 20px;
                      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                      background: transparent;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      min-height: 100vh;
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
      )}
    </div>
  )
}
