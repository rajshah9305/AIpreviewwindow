import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Code, Eye, Copy, Check, Maximize2, Minimize2, Smartphone, Monitor, X } from 'lucide-react'
import { ComponentVariation } from '../types'

interface ComponentPreviewProps { variation: ComponentVariation }

export default function ComponentPreview({ variation }: ComponentPreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(variation.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  // Effect to handle escape key for fullscreen
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false)
    }
    if (isFullscreen) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  const renderContent = (fullScreenMode: boolean) => (
    <div className={`flex flex-col h-full bg-neutral-50 ${fullScreenMode ? 'h-screen' : 'h-full'}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black bg-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-display font-bold uppercase tracking-wider transition-all ${
                activeTab === 'preview'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-display font-bold uppercase tracking-wider transition-all ${
                activeTab === 'code'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Code className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Code
            </button>
          </div>

          {activeTab === 'preview' && fullScreenMode && (
            <div className="hidden sm:flex items-center gap-1 border-l border-neutral-200 pl-4">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewport === 'desktop' ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-400 hover:text-neutral-600'
                }`}
                title="Desktop view"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewport === 'mobile' ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-400 hover:text-neutral-600'
                }`}
                title="Mobile view"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {fullScreenMode && (
            <div className="hidden sm:block mr-4 text-right">
              <div className="text-xs font-display font-bold text-neutral-900">{variation.name}</div>
              <div className="text-[10px] text-neutral-400 font-accent">{variation.style}</div>
            </div>
          )}

          <button
            onClick={copyCode}
            className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <X className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex-1 relative overflow-hidden flex items-center justify-center p-4 ${fullScreenMode ? 'bg-neutral-100/50' : 'bg-white'}`}>
        {activeTab === 'preview' ? (
          <div className={`transition-all duration-500 ease-in-out bg-white shadow-sm overflow-hidden border-2 border-black rounded-lg ${
            fullScreenMode && viewport === 'mobile' ? 'w-[375px] h-[667px] shadow-2xl border-black' : 'w-full h-full'
          } ${fullScreenMode && viewport === 'mobile' ? 'max-h-[90vh]' : ''}`}>
            <iframe
              title={`${variation.name} preview`}
              srcDoc={variation.code}
              sandbox="allow-scripts allow-modals allow-forms"
              className="w-full h-full border-0 bg-white"
            />
          </div>
        ) : (
          <div className="w-full h-full overflow-auto bg-[#0d1117] text-neutral-300 p-6 font-mono text-xs sm:text-sm rounded-lg shadow-inner custom-scrollbar leading-relaxed">
            <pre className="whitespace-pre-wrap break-all">
              <code>{variation.code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )

  if (isFullscreen) {
    return createPortal(
      <div className="fixed inset-0 z-[200] bg-white animate-fade-in">
        {renderContent(true)}
      </div>,
      document.body
    )
  }

  return (
    <div
      className="group h-full flex flex-col bg-white rounded-2xl border-2 border-black shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hover:border-black hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-100 bg-white flex items-center justify-between shrink-0">
        <div>
          <h3 className="font-display font-bold text-neutral-900 text-sm tracking-tight">{variation.name}</h3>
          <p className="text-[10px] font-accent font-medium text-neutral-400 uppercase tracking-wider mt-0.5">{variation.style} Style</p>
        </div>
        <div className="flex items-center gap-1">
           <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 text-neutral-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
            title="Expand view"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Container - force height to match parent via flex-1 */}
      <div className="flex-1 relative min-h-[300px]">
        {renderContent(false)}
      </div>
    </div>
  )
}
