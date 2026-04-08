import { useEffect, useCallback, useRef, useState } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, RefreshCw, ChevronLeft, ChevronRight, Sparkles, ArrowRight, Zap } from 'lucide-react'
import { useGeneration } from '../contexts/GenerationContext'
import { useToast } from '../components/ToastContainer'
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut'
import { storage } from '../lib/storage'
import { APP_CONFIG, ROUTES, LOADING_VARIATIONS, ANIMATION_DELAYS } from '../config/constants'
import ComponentPreview from '../components/ComponentPreview'
import LoadingSkeleton from '../components/LoadingSkeleton'

export default function Generator() {
  const {
    instruction, setInstruction,
    loading, result, error,
    clearError, handleGenerate, clearResult,
  } = useGeneration()

  const toast    = useToast()
  const navigate = useNavigate()
  const [hasSettings, setHasSettings] = useState(false)

  useEffect(() => {
    const s = storage.loadSettings()
    setHasSettings(!!(s?.apiKey && s?.modelName && s?.baseUrl))
  }, [])

  const handleGenerateClick = useCallback(async () => {
    const s = storage.loadSettings()
    if (!s?.apiKey || !s?.modelName || !s?.baseUrl) {
      toast.warning('Configure your AI provider in Settings first')
      navigate(ROUTES.SETTINGS)
      return
    }
    await handleGenerate()
  }, [handleGenerate, navigate, toast])

  const handleClearAndNew = useCallback(() => {
    clearResult()
    setInstruction('')
  }, [clearResult, setInstruction])

  const handleInstructionChange = useCallback(
    (value: string) => setInstruction(value.slice(0, APP_CONFIG.MAX_INSTRUCTION_LENGTH)),
    [setInstruction]
  )

  useKeyboardShortcut('Enter', handleGenerateClick, {
    ctrl: true, meta: true,
    enabled: !loading && !!instruction.trim(),
  })

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] relative w-full overflow-x-hidden">
      <div className="flex-1 w-full">
        {!loading && !result && <HeroSection hasSettings={hasSettings} onNavigateSettings={() => navigate(ROUTES.SETTINGS)} />}
        {loading && <LoadingState />}
        {result  && <ResultsState result={result} onClearAndNew={handleClearAndNew} />}
      </div>

      <InputArea
        instruction={instruction}
        loading={loading}
        error={error}
        hasSettings={hasSettings}
        onInstructionChange={handleInstructionChange}
        onGenerate={handleGenerateClick}
        onClearError={clearError}
        onNavigateSettings={() => navigate(ROUTES.SETTINGS)}
      />
    </div>
  )
}

/* ─── Hero ──────────────────────────────────────────────────────────────────── */

const HeroSection = ({
  hasSettings,
  onNavigateSettings,
}: {
  hasSettings: boolean
  onNavigateSettings: () => void
}) => {
  return (
    <section
      aria-label="Hero"
      className="max-w-4xl mx-auto text-center pt-32 sm:pt-40 md:pt-48 pb-8 px-4 sm:px-6 w-full"
    >
      {/* Headline */}
      <h1
        className="font-display font-900 tracking-tightest leading-[0.9] mb-10 animate-text-reveal-up"
        style={{ fontSize: 'var(--text-hero)', animationDelay: '0.05s' }}
      >
        <span className="block text-neutral-900">Describe it.</span>
        <span className="block text-gradient italic">Ship it.</span>
      </h1>

      {/* Settings nudge */}
      {!hasSettings && (
        <div
          className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border border-black rounded-full text-[11px] font-display font-700 text-white uppercase tracking-widest animate-text-reveal-up cursor-pointer hover:bg-orange-500 transition-colors duration-200"
          style={{ animationDelay: '0.3s' }}
          onClick={onNavigateSettings}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onNavigateSettings()}
          aria-label="Configure AI settings"
        >
          <Zap className="w-3 h-3" aria-hidden="true" />
          Configure your AI provider to get started
          <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </div>
      )}
    </section>
  )
}

/* ─── Loading state ─────────────────────────────────────────────────────────── */
const LoadingState = () => {
  const scrollRef  = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const scroll = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -440 : 440, behavior: 'smooth' })

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const w = el.scrollWidth / LOADING_VARIATIONS.length
      setActive(Math.min(Math.round(el.scrollLeft / w), LOADING_VARIATIONS.length - 1))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="space-y-5 animate-fade-in w-full overflow-x-hidden">
      <ResultsHeader
        status="loading"
        title="Crafting variations"
        subtitle="Designing 5 unique components in parallel…"
      />
      <Carousel scrollRef={scrollRef} onScrollLeft={() => scroll('left')} onScrollRight={() => scroll('right')}>
        {LOADING_VARIATIONS.map((v, i) => (
          <div
            key={v.id}
            className="flex-shrink-0 snap-start snap-always card-size animate-scale-in"
            style={{ animationDelay: `${i * ANIMATION_DELAYS.STAGGER_BASE}ms` }}
          >
            <LoadingSkeleton />
          </div>
        ))}
      </Carousel>
      <ScrollDots count={LOADING_VARIATIONS.length} active={active}
        onDotClick={i => {
          if (scrollRef.current) {
            const w = scrollRef.current.scrollWidth / LOADING_VARIATIONS.length
            scrollRef.current.scrollTo({ left: w * i, behavior: 'smooth' })
          }
        }}
      />
    </div>
  )
}

/* ─── Results state ─────────────────────────────────────────────────────────── */
interface ResultsStateProps {
  result: { variations: Array<{ id: string; name: string; code: string; style: 'minimal'|'bold'|'elegant'|'playful'|'modern' }> }
  onClearAndNew: () => void
}

const ResultsState = ({ result, onClearAndNew }: ResultsStateProps) => {
  const scrollRef  = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const scroll = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -440 : 440, behavior: 'smooth' })

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const w = el.scrollWidth / result.variations.length
      setActive(Math.min(Math.round(el.scrollLeft / w), result.variations.length - 1))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [result.variations.length])

  return (
    <div className="space-y-5 animate-fade-in w-full overflow-x-hidden">
      <ResultsHeader
        status="done"
        title="Your collection"
        subtitle={`${result.variations.length} variations ready — scroll to explore`}
        action={
          <button
            onClick={onClearAndNew}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/[0.09] text-[11px] font-display font-700 uppercase tracking-widest text-neutral-600 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-200 active:scale-95 group shadow-xs"
            aria-label="Start a new generation"
          >
            <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" aria-hidden="true" />
            New
          </button>
        }
      />

      <Carousel
        scrollRef={scrollRef}
        onScrollLeft={() => scroll('left')}
        onScrollRight={() => scroll('right')}
        fadeEdges
      >
        {result.variations.map((v, i) => (
          <div
            key={v.id}
            className="flex-shrink-0 snap-start snap-always card-size animate-scale-in hover-lift"
            style={{ animationDelay: `${i * ANIMATION_DELAYS.STAGGER_BASE}ms` }}
          >
            <ComponentPreview variation={v} />
          </div>
        ))}
      </Carousel>

      <ScrollDots count={result.variations.length} active={active}
        onDotClick={i => {
          if (scrollRef.current) {
            const w = scrollRef.current.scrollWidth / result.variations.length
            scrollRef.current.scrollTo({ left: w * i, behavior: 'smooth' })
          }
        }}
      />
    </div>
  )
}

/* ─── Shared sub-components ─────────────────────────────────────────────────── */
const ResultsHeader = ({
  status, title, subtitle, action,
}: {
  status: 'loading' | 'done'
  title: string
  subtitle: string
  action?: React.ReactNode
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/[0.07]">
    <div className="flex items-center gap-3 min-w-0">
      <div
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-display font-700 uppercase tracking-widest border ${
          status === 'done'
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
            : 'bg-orange-50 text-orange-600 border-orange-100'
        }`}
        role="status"
        aria-live="polite"
      >
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            status === 'done' ? 'bg-emerald-500' : 'bg-orange-500 animate-pulse-dot'
          }`}
          aria-hidden="true"
        />
        {status === 'done' ? 'Complete' : 'Processing'}
      </div>
      <div className="min-w-0">
        <h2 className="font-display text-xl sm:text-2xl font-700 tracking-tight text-neutral-900 leading-none">{title}</h2>
        <p className="text-xs text-neutral-400 font-accent mt-0.5">{subtitle}</p>
      </div>
    </div>
    {action}
  </div>
)

const Carousel = ({
  children, scrollRef, onScrollLeft, onScrollRight, fadeEdges,
}: {
  children: React.ReactNode
  scrollRef: React.RefObject<HTMLDivElement>
  onScrollLeft: () => void
  onScrollRight: () => void
  fadeEdges?: boolean
}) => (
  <div className="relative group">
    {/* Nav arrows — desktop only */}
    <button
      onClick={onScrollLeft}
      className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm border border-black/[0.09] shadow-sm items-center justify-center text-neutral-600 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-white hover:shadow-md active:scale-95"
      aria-label="Scroll left"
    >
      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
    </button>
    <button
      onClick={onScrollRight}
      className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm border border-black/[0.09] shadow-sm items-center justify-center text-neutral-600 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-white hover:shadow-md active:scale-95"
      aria-label="Scroll right"
    >
      <ChevronRight className="w-4 h-4" aria-hidden="true" />
    </button>

    <div className="relative">
      {fadeEdges && (
        <>
          <div className="absolute left-0 top-0 bottom-4 w-10 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" aria-hidden="true" />
          <div className="absolute right-0 top-0 bottom-4 w-10 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" aria-hidden="true" />
        </>
      )}
      <div
        ref={scrollRef}
        className="overflow-x-auto overflow-y-hidden pb-3 snap-x scroll-smooth scrollbar-hide"
        role="region"
        aria-label="Component variations"
        tabIndex={0}
      >
        <div className="flex gap-4 sm:gap-5">
          {children}
        </div>
      </div>
    </div>
  </div>
)

const ScrollDots = ({
  count, active, onDotClick,
}: {
  count: number
  active: number
  onDotClick: (i: number) => void
}) => (
  <div className="flex justify-center gap-1.5" role="tablist" aria-label="Variation navigation">
    {Array.from({ length: count }).map((_, i) => (
      <button
        key={i}
        role="tab"
        aria-selected={i === active}
        aria-label={`Variation ${i + 1}`}
        onClick={() => onDotClick(i)}
        className={`rounded-full transition-all duration-300 ${
          i === active ? 'bg-orange-500 w-5 h-1.5' : 'bg-neutral-200 w-1.5 h-1.5 hover:bg-neutral-300'
        }`}
      />
    ))}
  </div>
)

/* ─── Input area ────────────────────────────────────────────────────────────── */
interface InputAreaProps {
  instruction: string
  loading: boolean
  error: string | null
  hasSettings: boolean
  onInstructionChange: (v: string) => void
  onGenerate: () => void
  onClearError: () => void
  onNavigateSettings: () => void
}

const InputArea = ({
  instruction, loading, error,
  onInstructionChange, onGenerate, onClearError,
}: InputAreaProps) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const charCount   = instruction.length
  const maxChars    = APP_CONFIG.MAX_INSTRUCTION_LENGTH
  const pct         = (charCount / maxChars) * 100
  const nearLimit   = pct > 80
  const atLimit     = pct >= 100

  React.useEffect(() => {
    const el = textareaRef.current
    if (el) { el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 140)}px` }
  }, [instruction])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (!loading && instruction.trim()) onGenerate()
    }
  }

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
  const canGenerate = !loading && !!instruction.trim()

  return (
    <div
      className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] sm:bottom-8 left-0 right-0 z-[90] px-4 sm:px-8 animate-slide-up"
      style={{ animationDelay: '0.45s' }}
    >
      <div className="w-full max-w-3xl mx-auto">
        {/* Error banner */}
        {error && (
          <div
            className="mb-2 flex items-center justify-between gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 animate-slide-up shadow-xs"
            role="alert"
            aria-live="assertive"
          >
            <span className="flex items-center gap-2 min-w-0 flex-1">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" aria-hidden="true" />
              <span className="line-clamp-2 font-accent font-500">{error}</span>
            </span>
            <button
              onClick={onClearError}
              className="p-1.5 rounded-lg hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors shrink-0 touch-manipulation"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input pill */}
        <div
          className="w-full bg-white rounded-[1.75rem] overflow-hidden border border-black"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
        >
          <div className="flex items-end gap-2 p-2.5 sm:p-3">
            {/* Textarea */}
            <div className="flex-1 min-w-0">
              <label htmlFor="component-prompt" className="sr-only">
                Describe the component you want to generate
              </label>
              <textarea
                id="component-prompt"
                ref={textareaRef}
                value={instruction}
                onChange={e => onInstructionChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your component…"
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-3 sm:px-4 py-3.5 font-accent font-500 resize-none min-h-[56px] max-h-[140px] scrollbar-hide text-neutral-800 leading-relaxed placeholder:text-neutral-300 placeholder:font-400"
                style={{ fontSize: 'max(17px, 1.0625rem)' }}
                disabled={loading}
                rows={1}
                aria-label="Component description"
                aria-describedby={charCount > 0 ? 'char-count' : undefined}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="sentences"
                spellCheck
              />
              {charCount > 0 && (
                <div className="flex items-center justify-between px-3 sm:px-4 pb-2">
                  <p className="text-[11px] font-accent text-neutral-300">
                    <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-[10px] font-mono border border-neutral-200 text-neutral-400">
                      {isMac ? '⌘' : 'Ctrl'}+↵
                    </kbd>
                    {' '}to generate
                  </p>
                  <p
                    id="char-count"
                    className={`text-[11px] font-mono tabular-nums transition-colors ${
                      atLimit ? 'text-red-500 font-700' : nearLimit ? 'text-orange-500' : 'text-neutral-300'
                    }`}
                    aria-live="polite"
                    aria-label={`${charCount} of ${maxChars} characters`}
                  >
                    {charCount}/{maxChars}
                  </p>
                </div>
              )}
            </div>

            {/* Generate button */}
            <div className="shrink-0 pb-2 pr-1">
              <button
                onClick={onGenerate}
                disabled={loading}
                type="button"
                className="flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-[1.25rem] text-[12px] font-display font-700 uppercase tracking-widest touch-manipulation min-h-[48px] bg-black text-white focus-visible:outline-none"
                aria-label={loading ? 'Generating components…' : 'Generate components'}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    <span>Creating</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Create</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
