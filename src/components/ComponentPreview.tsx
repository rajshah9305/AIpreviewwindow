import { wrapInTemplate } from '../lib/preview-template'
import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Code, Eye, Copy, Check, Maximize2, Smartphone, Monitor, X, Download, RefreshCw } from 'lucide-react'
import type { ComponentVariation } from '../types'

interface ComponentPreviewProps { variation: ComponentVariation }

const STYLE_META: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  minimal:  { label: 'Minimal',       dot: 'bg-neutral-400',  text: 'text-neutral-600', bg: 'bg-neutral-100' },
  bold:     { label: 'Statement',     dot: 'bg-orange-500',   text: 'text-orange-700',  bg: 'bg-orange-50'   },
  elegant:  { label: 'Sophisticated', dot: 'bg-stone-500',    text: 'text-stone-600',   bg: 'bg-stone-100'   },
  playful:  { label: 'Expressive',    dot: 'bg-amber-500',    text: 'text-amber-700',   bg: 'bg-amber-50'    },
  modern:   { label: 'Contemporary',  dot: 'bg-zinc-500',     text: 'text-zinc-600',    bg: 'bg-zinc-100'    },
}

export default function ComponentPreview({ variation }: ComponentPreviewProps) {
  const [tab,        setTab]        = useState<'preview' | 'code'>('preview')
  const [fullscreen, setFullscreen] = useState(false)
  const [viewport,   setViewport]   = useState<'desktop' | 'mobile'>('desktop')
  const [copied,     setCopied]     = useState(false)
  const [iframeKey,  setIframeKey]  = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const meta = STYLE_META[variation.style] ?? STYLE_META.minimal

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(variation.code)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = variation.code
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [variation.code])

  const downloadCode = useCallback(() => {
    const blob = new Blob([variation.code], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${variation.name.toLowerCase().replace(/\s+/g, '-')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [variation.code, variation.name])

  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(false) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [fullscreen])

  /* ── Toolbar ── */
  const Toolbar = ({ inFullscreen }: { inFullscreen: boolean }) => (
    <div className="flex items-center gap-0.5">
      {tab === 'preview' && (
        <button
          onClick={() => setIframeKey(k => k + 1)}
          className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all active:scale-95"
          title="Refresh preview"
          aria-label="Refresh preview"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
      <button
        onClick={downloadCode}
        className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all active:scale-95"
        title="Download HTML"
        aria-label="Download HTML file"
      >
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
      <button
        onClick={copyCode}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-display font-700 uppercase tracking-wider transition-all active:scale-95 ${
          copied
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100'
        }`}
        aria-label={copied ? 'Code copied' : 'Copy code'}
        aria-live="polite"
      >
        {copied
          ? <Check className="w-3 h-3" aria-hidden="true" />
          : <Copy className="w-3 h-3" aria-hidden="true" />
        }
        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
      </button>
      <button
        onClick={() => setFullscreen(f => !f)}
        className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all active:scale-95"
        title={inFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        aria-label={inFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        aria-expanded={inFullscreen}
      >
        {inFullscreen
          ? <X className="w-3.5 h-3.5" aria-hidden="true" />
          : <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
        }
      </button>
    </div>
  )

  /* ── Tab bar ── */
  const TabBar = ({ inFullscreen }: { inFullscreen: boolean }) => (
    <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-100 bg-white shrink-0 gap-3">
      <div className="flex items-center gap-2 min-w-0">
        {/* Tabs */}
        <div className="flex items-center gap-0.5 bg-neutral-100 p-0.5 rounded-lg shrink-0">
          {(['preview', 'code'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              role="tab"
              aria-selected={tab === t}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-display font-700 uppercase tracking-wider transition-all ${
                tab === t ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {t === 'preview'
                ? <Eye className="w-3 h-3" aria-hidden="true" />
                : <Code className="w-3 h-3" aria-hidden="true" />
              }
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Viewport toggle (fullscreen + preview only) */}
        {tab === 'preview' && inFullscreen && (
          <div className="hidden sm:flex items-center gap-0.5 border-l border-neutral-200 pl-3">
            {(['desktop', 'mobile'] as const).map(vp => (
              <button
                key={vp}
                onClick={() => setViewport(vp)}
                className={`p-1.5 rounded-md transition-colors ${viewport === vp ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-400 hover:text-neutral-600'}`}
                title={vp === 'desktop' ? 'Desktop view' : 'Mobile view (375px)'}
                aria-label={vp === 'desktop' ? 'Desktop view' : 'Mobile view'}
                aria-pressed={viewport === vp}
              >
                {vp === 'desktop'
                  ? <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                  : <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                }
              </button>
            ))}
          </div>
        )}

        {inFullscreen && (
          <div className="hidden sm:block border-l border-neutral-200 pl-3 min-w-0">
            <p className="text-xs font-display font-700 text-neutral-900 truncate">{variation.name}</p>
            <p className="text-[10px] text-neutral-400 font-accent capitalize">{meta.label} style</p>
          </div>
        )}
      </div>
      <Toolbar inFullscreen={inFullscreen} />
    </div>
  )

  /* ── Preview / Code content ── */
  const PreviewContent = ({ inFullscreen }: { inFullscreen: boolean }) => (
    <div className={`flex-1 relative overflow-hidden flex items-center justify-center ${
      tab === 'preview'
        ? (inFullscreen ? 'bg-neutral-100/60 p-6' : 'bg-white p-0')
        : 'p-0'
    }`}>
      {tab === 'preview' ? (
        <div className={`transition-all duration-400 overflow-hidden ${
          inFullscreen && viewport === 'mobile'
            ? 'w-[375px] h-[667px] shadow-premium-lg border border-neutral-200 rounded-[2rem] bg-white'
            : 'w-full h-full bg-white'
        }`}>
          <iframe
            key={iframeKey}
            ref={iframeRef}
            title={`${variation.name} preview`}
            srcDoc={wrapInTemplate(variation.code)}
            sandbox="allow-scripts allow-modals allow-forms"
            className="w-full h-full border-0 bg-white"
            loading="lazy"
          />
        </div>
      ) : (
        <CodeViewer code={variation.code} name={variation.name} onCopy={copyCode} copied={copied} />
      )}
    </div>
  )

  /* ── Fullscreen portal ── */
  if (fullscreen) {
    return createPortal(
      <div
        className="fixed inset-0 z-[200] bg-white animate-fade-in flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label={`Fullscreen preview: ${variation.name}`}
      >
        <TabBar inFullscreen />
        <PreviewContent inFullscreen />
      </div>,
      document.body
    )
  }

  /* ── Card ── */
  return (
    <div className="group h-full flex flex-col bg-white rounded-[1.125rem] border border-black/[0.07] shadow-card overflow-hidden hover:shadow-card-hover hover:border-black/[0.11] transition-all duration-250">
      {/* Card header */}
      <div className="px-4 py-3 border-b border-neutral-100 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h3 className="font-display font-700 text-neutral-900 text-sm tracking-tight truncate">{variation.name}</h3>
          <span className={`shrink-0 inline-flex items-center gap-1 text-[9px] font-display font-700 uppercase tracking-widest px-2 py-0.5 rounded-full ${meta.bg} ${meta.text}`}>
            <span className={`w-1 h-1 rounded-full ${meta.dot}`} aria-hidden="true" />
            {meta.label}
          </span>
        </div>
        <div className="flex items-center gap-0.5 shrink-0 ml-2">
          <button
            onClick={() => setIframeKey(k => k + 1)}
            className="p-1.5 text-neutral-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors active:scale-95"
            title="Refresh"
            aria-label="Refresh preview"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button
            onClick={copyCode}
            className={`p-1.5 rounded-lg transition-all active:scale-95 ${copied ? 'text-emerald-500 bg-emerald-50' : 'text-neutral-400 hover:text-orange-500 hover:bg-orange-50'}`}
            title="Copy code"
            aria-label={copied ? 'Code copied' : 'Copy code'}
          >
            {copied
              ? <Check className="w-3.5 h-3.5" aria-hidden="true" />
              : <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            }
          </button>
          <button
            onClick={() => setFullscreen(true)}
            className="p-1.5 text-neutral-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors active:scale-95"
            title="Expand"
            aria-label="Expand to fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center border-b border-neutral-100 bg-neutral-50/60 px-3 pt-1.5" role="tablist">
        {(['preview', 'code'] as const).map(t => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-display font-700 uppercase tracking-wider border-b-2 transition-all -mb-px ${
              tab === t ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {t === 'preview'
              ? <Eye className="w-3 h-3" aria-hidden="true" />
              : <Code className="w-3 h-3" aria-hidden="true" />
            }
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 relative min-h-[260px] overflow-hidden" role="tabpanel">
        {tab === 'preview' ? (
          <iframe
            key={iframeKey}
            ref={iframeRef}
            title={`${variation.name} preview`}
            srcDoc={wrapInTemplate(variation.code)}
            sandbox="allow-scripts allow-modals allow-forms"
            className="w-full h-full border-0 bg-white absolute inset-0"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0">
            <CodeViewer code={variation.code} name={variation.name} onCopy={copyCode} copied={copied} />
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Code viewer ───────────────────────────────────────────────────────────── */
function CodeViewer({
  code, name, onCopy, copied,
}: {
  code: string
  name: string
  onCopy: () => void
  copied: boolean
}) {
  const lineCount = code.split('\n').length

  return (
    <div className="w-full h-full flex flex-col code-block overflow-hidden">
      {/* Header bar */}
      <div className="code-block-header flex items-center justify-between px-4 py-2.5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-600">
            {name.toLowerCase().replace(/\s+/g, '-')}.html
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-neutral-600 font-mono font-600 uppercase tracking-wider">
            {lineCount} lines
          </span>
          <button
            onClick={onCopy}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-600 transition-all ${
              copied ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
            }`}
            aria-label={copied ? 'Copied' : 'Copy code'}
          >
            {copied ? <Check className="w-3 h-3" aria-hidden="true" /> : <Copy className="w-3 h-3" aria-hidden="true" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      {/* Code */}
      <div className="flex-1 overflow-auto scrollbar-hide selection:bg-orange-500/30">
        <pre className="p-5 whitespace-pre-wrap break-all text-xs leading-relaxed">
          <code className="text-[#e6edf3]">{code}</code>
        </pre>
      </div>
    </div>
  )
}
