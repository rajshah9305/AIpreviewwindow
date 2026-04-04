import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Code, Eye, Copy, Check, Maximize2, Smartphone, Monitor, X, Download, RefreshCw } from 'lucide-react'
import { ComponentVariation } from '../types'

interface ComponentPreviewProps { variation: ComponentVariation }

const STYLE_BADGE_COLORS: Record<string, string> = {
  minimal: 'bg-neutral-100 text-neutral-600',
  bold: 'bg-orange-50 text-orange-700',
  elegant: 'bg-stone-100 text-stone-600',
  playful: 'bg-amber-50 text-amber-700',
  modern: 'bg-zinc-100 text-zinc-600',
}

export default function ComponentPreview({ variation }: ComponentPreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [copied, setCopied] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(variation.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers without clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = variation.code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [variation.code])

  const downloadCode = useCallback(() => {
    const blob = new Blob([variation.code], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${variation.name.toLowerCase().replace(/\s+/g, '-')}-component.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [variation.code, variation.name])

  const refreshPreview = useCallback(() => {
    setIframeKey(k => k + 1)
  }, [])

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

  const badgeClass = STYLE_BADGE_COLORS[variation.style] || 'bg-neutral-100 text-neutral-600'

  const ToolbarActions = ({ fullScreenMode }: { fullScreenMode: boolean }) => (
    <div className="flex items-center gap-1.5">
      {activeTab === 'preview' && (
        <button
          onClick={refreshPreview}
          className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all active:scale-95"
          title="Refresh preview"
          aria-label="Refresh preview"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={downloadCode}
        className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all active:scale-95"
        title="Download HTML"
        aria-label="Download HTML"
      >
        <Download className="w-4 h-4" />
      </button>
      <button
        onClick={copyCode}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all active:scale-95 ${
          copied
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100'
        }`}
        title="Copy code"
        aria-label="Copy code"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy</span>
          </>
        )}
      </button>
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all active:scale-95"
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? <X className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  )

  const renderContent = (fullScreenMode: boolean) => (
    <div className={`flex flex-col ${fullScreenMode ? 'h-screen' : 'h-full'} bg-neutral-50`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-black bg-white shrink-0 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Tab switcher */}
          <div className="flex items-center gap-0.5 bg-neutral-100 p-1 rounded-lg shrink-0">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-display font-bold uppercase tracking-wider transition-all ${
                activeTab === 'preview'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-display font-bold uppercase tracking-wider transition-all ${
                activeTab === 'code'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Code className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Code</span>
            </button>
          </div>

          {/* Viewport toggle (fullscreen + preview only) */}
          {activeTab === 'preview' && fullScreenMode && (
            <div className="hidden sm:flex items-center gap-0.5 border-l border-neutral-200 pl-3">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewport === 'desktop' ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-400 hover:text-neutral-600'
                }`}
                title="Desktop view"
                aria-label="Desktop view"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewport === 'mobile' ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-400 hover:text-neutral-600'
                }`}
                title="Mobile view (375px)"
                aria-label="Mobile view"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Variation name in fullscreen */}
          {fullScreenMode && (
            <div className="hidden sm:block border-l border-neutral-200 pl-3 min-w-0">
              <p className="text-xs font-display font-bold text-neutral-900 truncate">{variation.name}</p>
              <p className="text-[10px] text-neutral-400 font-accent capitalize">{variation.style} style</p>
            </div>
          )}
        </div>

        <ToolbarActions fullScreenMode={fullScreenMode} />
      </div>

      {/* Content Area */}
      <div className={`flex-1 relative overflow-hidden flex items-center justify-center ${
        activeTab === 'preview' ? (fullScreenMode ? 'bg-neutral-100/50 p-6' : 'bg-white p-0') : 'p-0'
      }`}>
        {activeTab === 'preview' ? (
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            fullScreenMode && viewport === 'mobile'
              ? 'w-[375px] h-[667px] shadow-2xl border-2 border-black rounded-[2rem] bg-white'
              : 'w-full h-full bg-white'
          }`}>
            <iframe
              key={iframeKey}
              ref={iframeRef}
              title={`${variation.name} preview`}
              srcDoc={variation.code}
              sandbox="allow-scripts allow-modals allow-forms"
              className="w-full h-full border-0 bg-white"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full h-full overflow-auto bg-[#0d1117] text-neutral-300 font-mono text-xs sm:text-sm leading-relaxed custom-scrollbar selection:bg-orange-500/30 selection:text-white">
            {/* Code header bar */}
            <div className="sticky top-0 flex items-center justify-between px-5 py-2.5 bg-[#161b22] border-b border-white/5 z-10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span className="ml-3 text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">
                  {variation.name.toLowerCase().replace(/\s+/g, '-')}.html
                </span>
              </div>
              <span className="text-[10px] text-neutral-600 font-mono font-bold uppercase tracking-wider">
                {variation.code.split('\n').length} lines
              </span>
            </div>
            <pre className="p-6 whitespace-pre-wrap break-all font-mono">
              <code className="text-neutral-300 selection:bg-orange-500/40">{variation.code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )

  if (isFullscreen) {
    return createPortal(
      <div className="fixed inset-0 z-[200] bg-white animate-fade-in" role="dialog" aria-modal="true" aria-label={`Fullscreen preview of ${variation.name}`}>
        {renderContent(true)}
      </div>,
      document.body
    )
  }

  return (
    <div className="group h-full flex flex-col bg-white rounded-2xl border-2 border-black shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
      {/* Card Header */}
      <div className="px-5 py-3.5 border-b border-neutral-100 bg-white flex items-center justify-between shrink-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h3 className="font-display font-bold text-neutral-900 text-sm tracking-tight truncate">{variation.name}</h3>
            <span className={`shrink-0 text-[9px] font-display font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${badgeClass}`}>
              {variation.style}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button
            onClick={refreshPreview}
            className="p-2 text-neutral-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors active:scale-95"
            title="Refresh preview"
            aria-label="Refresh preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={copyCode}
            className={`p-2 rounded-lg transition-all active:scale-95 ${
              copied ? 'text-emerald-500 bg-emerald-50' : 'text-neutral-400 hover:text-orange-500 hover:bg-orange-50'
            }`}
            title="Copy code"
            aria-label="Copy code"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 text-neutral-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors active:scale-95"
            title="Expand view"
            aria-label="Expand view"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-neutral-100 bg-neutral-50/50 px-4 pt-2">
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-display font-bold uppercase tracking-wider border-b-2 transition-all -mb-px ${
            activeTab === 'preview'
              ? 'border-black text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Eye className="w-3 h-3" />
          Preview
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-display font-bold uppercase tracking-wider border-b-2 transition-all -mb-px ${
            activeTab === 'code'
              ? 'border-black text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Code className="w-3 h-3" />
          Code
        </button>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 relative min-h-[280px] overflow-hidden">
        {activeTab === 'preview' ? (
          <iframe
            key={iframeKey}
            ref={iframeRef}
            title={`${variation.name} preview`}
            srcDoc={variation.code}
            sandbox="allow-scripts allow-modals allow-forms"
            className="w-full h-full border-0 bg-white absolute inset-0"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 overflow-auto bg-[#0d1117] text-neutral-300 font-mono text-xs leading-relaxed selection:bg-orange-500/30">
            <div className="sticky top-0 flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/5 z-10">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                <span className="ml-2 text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-bold">
                  {variation.name.toLowerCase().replace(/\s+/g, '-')}.html
                </span>
              </div>
              <button
                onClick={copyCode}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono transition-all ${
                  copied ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-5 whitespace-pre-wrap break-all font-mono">
              <code className="selection:bg-orange-500/40">{variation.code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
