import { useState, useRef, useEffect } from 'react'
import { Code, Eye, Copy, Check } from 'lucide-react'
import { ComponentVariation } from '../types'

interface ComponentPreviewProps {
  variation: ComponentVariation;
  modelName?: string;
  provider?: string;
}

export default function ComponentPreview({ variation, modelName, provider }: ComponentPreviewProps) {
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [iframeHeight, setIframeHeight] = useState(400)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe || showCode) return
    
    const adjustHeight = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (iframeDoc) {
          const height = iframeDoc.body.scrollHeight
          setIframeHeight(Math.max(300, Math.min(height + 40, 800)))
        }
      } catch (e) {
        // Cross-origin or other access issues
        setIframeHeight(400)
      }
    }
    
    iframe.addEventListener('load', adjustHeight)
    return () => iframe.removeEventListener('load', adjustHeight)
  }, [showCode, variation.code])
  
  const copyCode = () => {
    navigator.clipboard.writeText(variation.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const styleColors = {
    minimal: 'from-neutral-500 to-neutral-600',
    bold: 'from-red-500 to-orange-500',
    elegant: 'from-orange-400 to-red-400',
    playful: 'from-yellow-500 to-orange-500',
    modern: 'from-orange-500 to-red-500',
  }
  
  return (
    <div className="card overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-3 bg-gradient-to-r from-neutral-50 to-orange-50 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${styleColors[variation.style]} shadow-sm`} />
          <h4 className="font-semibold text-sm text-neutral-900">{variation.name}</h4>
          <span className="px-2 py-0.5 bg-white rounded-md text-xs font-medium text-neutral-600 capitalize border border-neutral-200">
            {variation.style}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {modelName && provider && (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-white rounded-md border border-neutral-200">
              <span className="text-xs font-medium text-neutral-500">{provider}</span>
              <span className="text-xs text-neutral-400">•</span>
              <span className="text-xs font-medium text-neutral-700">{modelName}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowCode(!showCode)}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                showCode 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
              title={showCode ? 'Show Preview' : 'Show Code'}
            >
              {showCode ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            
            <button
              onClick={copyCode}
              className="p-1.5 rounded-lg bg-white text-neutral-600 hover:bg-neutral-100 transition-all duration-200 border border-neutral-200"
              title="Copy Code"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      
      {showCode ? (
        <div className="p-4 bg-neutral-900 overflow-x-auto max-h-[400px] overflow-y-auto">
          <pre className="text-xs text-neutral-100 font-mono leading-relaxed">
            <code>{variation.code}</code>
          </pre>
        </div>
      ) : (
        <div className="p-4 bg-gradient-to-br from-neutral-50 to-orange-50/30">
          <iframe
            ref={iframeRef}
            srcDoc={`
              <!DOCTYPE html>
              <html>
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
            className="w-full border-0 bg-white rounded-lg shadow-sm"
            style={{ height: `${iframeHeight}px` }}
            sandbox="allow-scripts"
            title={`Preview of ${variation.name}`}
          />
        </div>
      )}
    </div>
  )
}
