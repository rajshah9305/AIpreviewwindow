import { useEffect, useState, useCallback, useRef } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, RefreshCw, Zap, ChevronLeft, ChevronRight, Sparkles, Settings, ArrowRight } from 'lucide-react'
import { useGeneration } from '../contexts/GenerationContext'
import { useToast } from '../components/ToastContainer'
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut'
import { storage } from '../lib/storage'
import { APP_CONFIG, ROUTES, LOADING_VARIATIONS, ANIMATION_DELAYS } from '../config/constants'
import ComponentPreview from '../components/ComponentPreview'
import LoadingSkeleton from '../components/LoadingSkeleton'

export default function Generator() {
  const {
    instruction,
    setInstruction,
    loading,
    result,
    error,
    clearError,
    handleGenerate,
    clearResult,
  } = useGeneration()

  const toast = useToast()
  const navigate = useNavigate()
  const [hasSettings, setHasSettings] = useState(false)

  useEffect(() => {
    const settings = storage.loadSettings()
    setHasSettings(!!(settings?.apiKey && settings?.modelName && settings?.baseUrl))
  }, [])

  const handleGenerateClick = useCallback(async () => {
    const settings = storage.loadSettings()
    if (!settings?.apiKey || !settings?.modelName || !settings?.baseUrl) {
      toast.warning('Please configure your AI settings first')
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
    (value: string) => {
      setInstruction(value.slice(0, APP_CONFIG.MAX_INSTRUCTION_LENGTH))
    },
    [setInstruction]
  )

  useKeyboardShortcut('Enter', handleGenerateClick, {
    ctrl: true,
    meta: true,
    enabled: !loading && !!instruction.trim(),
  })

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] relative w-full max-w-full overflow-x-hidden">
      <div className="flex-1 w-full">
        {!loading && !result && (
          <HeroSection hasSettings={hasSettings} onNavigateSettings={() => navigate(ROUTES.SETTINGS)} />
        )}

        {loading && <LoadingState />}
        
        {result && <ResultsState result={result} onClearAndNew={handleClearAndNew} />}
      </div>

      <InputArea
        instruction={instruction}
        loading={loading}
        error={error}
        onInstructionChange={handleInstructionChange}
        onGenerate={handleGenerateClick}
        onClearError={clearError}
      />
    </div>
  )
}

interface HeroSectionProps {
  hasSettings: boolean
  onNavigateSettings: () => void
}

const HeroSection = ({ hasSettings, onNavigateSettings }: HeroSectionProps) => (
  <div className="max-w-5xl mx-auto text-center pt-20 sm:pt-24 md:pt-32 pb-12 animate-slide-up px-4 sm:px-6 w-full">
    <div className="inline-flex items-center justify-center mb-10 sm:mb-12 animate-text-reveal-up" style={{ animationDelay: '0.1s' }}>
      <div className="px-5 py-2.5 rounded-full bg-white border-2 border-black flex items-center gap-2.5 shadow-sm transition-all duration-300 hover:shadow-md">
        <Zap className="w-4 h-4 text-[#f97316]" fill="currentColor" />
        <span className="text-[10px] font-display font-700 text-neutral-900 tracking-widest-xl uppercase">
          Next-Gen AI Component Engine
        </span>
      </div>
    </div>

    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-800 tracking-tightest leading-[0.95] mb-8 sm:mb-10 px-2 break-words animate-float-slow">
      <span className="text-black animate-text-reveal-up inline-block" style={{ animationDelay: '0.2s' }}>Build </span>
      <span className="text-gradient-orange animate-text-reveal-up inline-block" style={{ animationDelay: '0.3s' }}>Faster</span>
      <br />
      <span className="text-black animate-text-reveal-up inline-block" style={{ animationDelay: '0.4s' }}>Design </span>
      <span className="text-gradient-orange animate-text-reveal-up inline-block" style={{ animationDelay: '0.5s' }}>Better</span>
    </h1>

    <p className="text-lg sm:text-xl md:text-2xl text-neutral-500 max-w-3xl mx-auto px-4 sm:px-6 animate-text-reveal-up font-accent leading-relaxed break-words mb-10 font-400 tracking-snug" style={{ animationDelay: '0.6s' }}>
      Transform your ideas into production-ready UI components with AI-powered precision.
    </p>

    {!hasSettings && (
      <div className="animate-text-reveal-up mb-12" style={{ animationDelay: '0.7s' }}>
        <div className="inline-flex items-center gap-3 px-5 py-3.5 bg-orange-50 border-2 border-orange-200 rounded-2xl text-orange-700">
          <Settings className="w-4 h-4 shrink-0" />
          <span className="text-sm font-accent font-500">Configure your AI provider to get started</span>
          <button
            onClick={onNavigateSettings}
            className="flex items-center gap-1.5 text-sm font-display font-700 text-orange-600 hover:text-orange-700 transition-colors underline underline-offset-2"
          >
            Go to Settings
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )}

    {/* Example prompts */}
    <div className="animate-text-reveal-up" style={{ animationDelay: '0.8s' }}>
      <p className="text-xs font-display font-700 uppercase tracking-widest text-neutral-400 mb-4">Try an example</p>
      <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto px-4">
        {[
          'A pricing table with 3 tiers',
          'A hero section with CTA button',
          'A testimonial card with avatar',
          'A dashboard stats overview',
          'A contact form with validation',
        ].map((example) => (
          <ExamplePrompt key={example} text={example} />
        ))}
      </div>
    </div>
  </div>
)

const ExamplePrompt = ({ text }: { text: string }) => {
  const { setInstruction } = useGeneration()
  return (
    <button
      onClick={() => setInstruction(text)}
      className="px-4 py-2 bg-white border-2 border-black rounded-full text-xs font-accent font-500 text-neutral-700 hover:bg-black hover:text-white transition-all duration-200 active:scale-95 touch-manipulation"
    >
      {text}
    </button>
  )
}

const LoadingState = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handleScroll = () => {
      const cardWidth = el.scrollWidth / LOADING_VARIATIONS.length
      const idx = Math.round(el.scrollLeft / cardWidth)
      setActiveIndex(Math.min(idx, LOADING_VARIATIONS.length - 1))
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-9 animate-fade-in w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-4 border-b-2 border-black pb-5 sm:pb-5 md:pb-7">
        <div className="min-w-0">
          <h3 className="font-display text-3xl sm:text-4xl font-700 tracking-tighter text-neutral-900 mb-2">Generating</h3>
          <p className="text-sm sm:text-base text-neutral-500 font-accent font-400 tracking-snug">Creating 5 unique design variations with AI precision...</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl border border-neutral-200 shadow-sm self-start sm:self-auto">
          <div className="w-2.5 h-2.5 bg-[#f97316] rounded-full animate-pulse" />
          <span className="text-[10px] font-display font-700 text-neutral-900 tracking-widest uppercase">Processing</span>
        </div>
      </div>

      <div className="relative group">
        <div className="hidden md:block">
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 shadow-lg text-neutral-900 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 shadow-lg text-neutral-900 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="overflow-x-auto overflow-y-hidden pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide"
        >
          <div className="flex gap-5 sm:gap-5 md:gap-6 lg:gap-7">
            {LOADING_VARIATIONS.map((v, i) => (
              <div
                key={v.id}
                className="flex-shrink-0 snap-start snap-always animate-scale-in w-[88vw] sm:w-[75vw] md:w-[55vw] lg:w-[450px] xl:w-[500px] h-[380px] xs:h-[420px] sm:h-[460px] md:h-[500px] lg:h-[550px]"
                style={{ animationDelay: `${i * ANIMATION_DELAYS.STAGGER_BASE}ms` }}
              >
                <LoadingSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll indicator dots */}
      <div className="flex justify-center gap-2 mt-2">
        {LOADING_VARIATIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (scrollRef.current) {
                const cardWidth = scrollRef.current.scrollWidth / LOADING_VARIATIONS.length
                scrollRef.current.scrollTo({ left: cardWidth * i, behavior: 'smooth' })
              }
            }}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex ? 'bg-orange-500 w-6 h-2' : 'bg-neutral-300 w-2 h-2'
            }`}
            aria-label={`Go to variation ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

interface ResultsStateProps {
  result: { variations: Array<{ id: string; name: string; code: string; style: 'minimal' | 'bold' | 'elegant' | 'playful' | 'modern' }> }
  onClearAndNew: () => void
}

const ResultsState = ({ result, onClearAndNew }: ResultsStateProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handleScroll = () => {
      const cardWidth = el.scrollWidth / result.variations.length
      const idx = Math.round(el.scrollLeft / cardWidth)
      setActiveIndex(Math.min(idx, result.variations.length - 1))
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [result.variations.length])

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-9 animate-fade-in w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-5 border-b-2 border-black pb-5 sm:pb-5 md:pb-7">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-2 mb-3 bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-display font-700 text-emerald-600 tracking-widest uppercase">Complete</span>
          </div>
          <h3 className="font-display text-3xl sm:text-4xl font-700 tracking-tighter text-neutral-900 mb-2">Your Collection</h3>
          <p className="text-sm sm:text-base text-neutral-500 font-accent font-400 tracking-snug">
            {result.variations.length} premium variations — scroll to explore, click expand to fullscreen
          </p>
        </div>
        <button
          onClick={onClearAndNew}
          className="btn-secondary flex items-center justify-center gap-2.5 shrink-0 whitespace-nowrap min-h-[52px] sm:min-h-[44px] group"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span>New Generation</span>
        </button>
      </div>

      <div className="relative group">
        <div className="hidden md:block">
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 shadow-lg text-neutral-900 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 shadow-lg text-neutral-900 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-4 w-8 sm:w-12 bg-gradient-to-r from-[#f5f5f5] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-8 sm:w-12 bg-gradient-to-l from-[#f5f5f5] to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide"
          >
            <div className="flex gap-5 sm:gap-5 md:gap-6 lg:gap-7">
              {result.variations.map((variation, i) => (
                <div
                  key={variation.id}
                  className="flex-shrink-0 snap-start snap-always animate-scale-in w-[88vw] sm:w-[75vw] md:w-[55vw] lg:w-[450px] xl:w-[500px] h-[380px] xs:h-[420px] sm:h-[460px] md:h-[500px] lg:h-[550px] hover-lift"
                  style={{ animationDelay: `${i * ANIMATION_DELAYS.STAGGER_BASE}ms` }}
                >
                  <ComponentPreview variation={variation} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator dots - interactive */}
      <div className="flex justify-center gap-2 mt-2">
        {result.variations.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (scrollRef.current) {
                const cardWidth = scrollRef.current.scrollWidth / result.variations.length
                scrollRef.current.scrollTo({ left: cardWidth * i, behavior: 'smooth' })
              }
            }}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex ? 'bg-orange-500 w-6 h-2' : 'bg-neutral-300 w-2 h-2 hover:bg-neutral-400'
            }`}
            aria-label={`Go to variation ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

interface InputAreaProps {
  instruction: string
  loading: boolean
  error: string | null
  onInstructionChange: (value: string) => void
  onGenerate: () => void
  onClearError: () => void
}

const InputArea = ({
  instruction,
  loading,
  error,
  onInstructionChange,
  onGenerate,
  onClearError,
}: InputAreaProps) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const charCount = instruction.length
  const maxChars = APP_CONFIG.MAX_INSTRUCTION_LENGTH
  const charPercent = (charCount / maxChars) * 100
  const isNearLimit = charPercent > 80
  const isAtLimit = charPercent >= 100

  React.useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [instruction])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (!loading && instruction.trim()) {
        onGenerate()
      }
    }
  }

  return (
    <div className="fixed bottom-[calc(9.5rem+env(safe-area-inset-bottom))] sm:bottom-32 left-0 right-0 z-[90] w-full px-4 sm:px-8 animate-slide-up" style={{ animationDelay: '0.8s' }}>
      <div className="w-full max-w-4xl mx-auto">
        <div className="glass-panel p-2 sm:p-3 transition-all duration-500 shadow-glass focus-within:shadow-inner-glow focus-within:border-orange-500/30 rounded-[3rem] w-full overflow-hidden">
          {error && (
            <div className="mx-1 mb-2 p-3 bg-red-50 rounded-2xl text-xs font-accent font-500 text-red-600 flex items-center justify-between animate-slide-up border border-red-100">
              <span className="flex items-center gap-2.5 min-w-0 flex-1">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span className="break-words line-clamp-2">{error}</span>
              </span>
              <button
                onClick={onClearError}
                className="p-2 hover:bg-red-100 rounded-xl transition-colors touch-manipulation shrink-0 ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center sm:min-h-0 sm:min-w-0 sm:p-2 text-red-400 hover:text-red-600"
                aria-label="Clear error"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={instruction}
                onChange={(e) => onInstructionChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your component... (e.g., 'A pricing card with 3 tiers')"
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 sm:px-6 py-4 sm:py-5 text-base font-accent font-500 resize-none min-h-[60px] max-h-[140px] scrollbar-hide text-neutral-800 leading-relaxed rounded-2xl placeholder:text-neutral-400 placeholder:font-400 tracking-snug"
                style={{ fontSize: 'max(16px, 1rem)' }}
                disabled={loading}
                rows={1}
                aria-label="Component description"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="sentences"
                spellCheck={true}
              />
              {/* Character counter */}
              {charCount > 0 && (
                <div className="flex items-center justify-between px-4 sm:px-6 pb-2">
                  <p className="text-[10px] font-accent text-neutral-400">
                    <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-[9px] font-mono border border-neutral-200">
                      {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Enter
                    </kbd>
                    {' '}to generate
                  </p>
                  <p className={`text-[10px] font-mono transition-colors ${
                    isAtLimit ? 'text-red-500 font-bold' : isNearLimit ? 'text-orange-500' : 'text-neutral-400'
                  }`}>
                    {charCount}/{maxChars}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 pr-3 sm:pr-4 pb-2 sm:pb-3">
              <button
                onClick={onGenerate}
                disabled={loading || !instruction.trim()}
                type="button"
                className={`px-5 sm:px-7 py-3 rounded-full text-xs font-display font-800 tracking-widest uppercase transition-all duration-500 touch-manipulation flex items-center gap-2.5 min-h-[44px] ${
                  loading || !instruction.trim()
                    ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed border border-neutral-200'
                    : 'bg-black text-white hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/20 active:scale-95'
                }`}
                aria-label="Generate components"
              >
                {loading ? (
                  <>
                    <div className="spinner !w-4 !h-4 !border-2 !border-white/30 !border-t-white" />
                    <span>Creating</span>
                  </>
                ) : (
                  <>
                    <span>Create</span>
                    <Sparkles className="w-3.5 h-3.5" />
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
