import { useEffect, useState, useCallback } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, RefreshCw, Zap, ArrowRight } from 'lucide-react'
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
    setHasSettings(!!(settings?.apiKey))
  }, [])

  const handleGenerateClick = useCallback(async () => {
    if (!hasSettings) {
      toast.warning('Please configure your AI settings first')
      setTimeout(() => navigate(ROUTES.SETTINGS), ANIMATION_DELAYS.NAVIGATION_DELAY)
      return
    }
    await handleGenerate()
  }, [hasSettings, handleGenerate, toast, navigate])

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
          <HeroSection
            hasSettings={hasSettings}
            onNavigateToSettings={() => navigate(ROUTES.SETTINGS)}
          />
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
  onNavigateToSettings: () => void
}

const HeroSection = ({ hasSettings, onNavigateToSettings }: HeroSectionProps) => (
  <div className="max-w-5xl mx-auto text-center pt-20 sm:pt-24 md:pt-32 pb-12 animate-slide-up px-4 sm:px-6 w-full">
    <div className="inline-flex items-center justify-center mb-10 sm:mb-12 animate-text-reveal-up" style={{ animationDelay: '0.1s' }}>
      <div className="px-5 py-2.5 rounded-full bg-white border border-neutral-200 flex items-center gap-2.5 shadow-sm transition-all duration-300">
        <Zap className="w-4 h-4 text-[#f97316]" fill="currentColor" />
        <span className="text-[10px] font-display font-700 text-neutral-900 tracking-widest-xl uppercase">
          Next-Gen AI Component Engine
        </span>
      </div>
    </div>

    <h1 className="text-6xl sm:text-7xl md:text-8xl font-display font-700 tracking-tightest leading-[0.95] mb-8 sm:mb-10 px-2 break-words">
      <span className="text-black animate-text-reveal-up inline-block" style={{ animationDelay: '0.2s' }}>Build </span>
      <span className="text-brand-primary animate-text-reveal-up inline-block animate-gradient-shift" style={{ animationDelay: '0.3s' }}>Faster</span>
      <br />
      <span className="text-black animate-text-reveal-up inline-block" style={{ animationDelay: '0.4s' }}>Design </span>
      <span className="text-brand-primary animate-text-reveal-up inline-block animate-gradient-shift" style={{ animationDelay: '0.5s' }}>Better</span>
    </h1>

    <p className="text-xl sm:text-2xl md:text-3xl text-neutral-500 max-w-3xl mx-auto px-4 sm:px-6 animate-text-reveal-up font-accent leading-relaxed break-words mb-16 font-400 tracking-snug" style={{ animationDelay: '0.6s' }}>
      Transform your ideas into production-ready UI components with AI-powered precision.
    </p>

    {!hasSettings && (
      <div className="mt-12 sm:mt-14 md:mt-16 p-7 sm:p-8 bg-white border border-neutral-200 rounded-2xl inline-block text-left max-w-lg mx-auto w-[calc(100%-2rem)] sm:w-auto animate-text-reveal-scale shadow-[0_8px_32px_rgba(0,0,0,0.04)]" style={{ animationDelay: '0.7s' }}>
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-md shrink-0">
            <AlertCircle className="w-7 h-7 text-[#f97316]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-700 text-base text-neutral-900 tracking-tight mb-2">Setup Required</p>
            <p className="text-sm text-neutral-600 mb-5 leading-relaxed font-accent font-400">Connect your AI provider to unlock the full power of component generation</p>
            <button
              onClick={onNavigateToSettings}
              className="btn-primary w-full flex items-center justify-center gap-2.5 group min-h-[52px]"
            >
              <span>Connect Provider</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)

const LoadingState = () => (
  <div className="space-y-6 sm:space-y-7 md:space-y-9 animate-fade-in w-full max-w-full overflow-x-hidden">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-4 border-b border-neutral-200/60 pb-5 sm:pb-5 md:pb-7">
      <div className="min-w-0">
        <h3 className="font-display text-3xl sm:text-4xl font-700 tracking-tighter text-neutral-900 mb-2">Generating</h3>
        <p className="text-sm sm:text-base text-neutral-500 font-accent font-400 tracking-snug">Creating 5 unique design variations with AI precision...</p>
      </div>
      <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl border border-neutral-200 shadow-sm">
        <div className="w-2.5 h-2.5 bg-[#f97316] rounded-full animate-pulse" />
        <span className="text-[10px] font-display font-700 text-neutral-900 tracking-widest-xl uppercase">Processing</span>
      </div>
    </div>

    <div className="relative -mx-3 sm:-mx-3 md:-mx-4 lg:-mx-6 w-screen max-w-full" style={{ maxWidth: 'calc(100vw - 1rem)' }}>
      <div className="overflow-x-auto overflow-y-hidden pb-4 px-3 sm:px-3 md:px-4 lg:px-6 snap-x snap-mandatory scroll-smooth scrollbar-thin">
        <div className="flex gap-5 sm:gap-5 md:gap-6 lg:gap-7">
          {LOADING_VARIATIONS.map((v, i) => (
            <div
              key={v.id}
              className="flex-shrink-0 snap-start snap-always animate-slide-up w-[88vw] sm:w-[75vw] md:w-[55vw] lg:w-[450px] xl:w-[500px] h-[380px] xs:h-[420px] sm:h-[460px] md:h-[500px] lg:h-[550px]"
              style={{ animationDelay: `${i * ANIMATION_DELAYS.STAGGER_BASE}ms` }}
            >
              <LoadingSkeleton />
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile scroll indicator */}
      <div className="flex justify-center gap-2 mt-4 sm:hidden">
        {LOADING_VARIATIONS.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-orange-300 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  </div>
)

interface ResultsStateProps {
  result: { variations: Array<{ id: string; name: string; code: string; style: 'minimal' | 'bold' | 'elegant' | 'playful' | 'modern' }> }
  onClearAndNew: () => void
}

const ResultsState = ({ result, onClearAndNew }: ResultsStateProps) => (
  <div className="space-y-6 sm:space-y-7 md:space-y-9 animate-fade-in w-full max-w-full overflow-x-hidden">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-5 border-b border-neutral-200/60 pb-5 sm:pb-5 md:pb-7">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 mb-3 bg-white px-5 py-2.5 rounded-xl border border-emerald-200 inline-flex shadow-sm">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-display font-700 text-emerald-600 tracking-widest-xl uppercase">Complete</span>
        </div>
        <h3 className="font-display text-3xl sm:text-4xl font-700 tracking-tighter text-neutral-900 mb-2">Your Collection</h3>
        <p className="text-sm sm:text-base text-neutral-500 font-accent font-400 tracking-snug">
          {result.variations.length} premium variations generated — scroll to explore each design
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

    <div className="relative -mx-3 sm:-mx-3 md:-mx-4 lg:-mx-6 w-screen max-w-full" style={{ maxWidth: 'calc(100vw - 1rem)' }}>
      <div className="absolute left-0 top-0 bottom-4 w-12 sm:w-16 bg-gradient-to-r from-[#f5f5f5] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-4 w-12 sm:w-16 bg-gradient-to-l from-[#f5f5f5] to-transparent z-10 pointer-events-none" />
      
      <div className="overflow-x-auto overflow-y-hidden pb-4 px-3 sm:px-3 md:px-4 lg:px-6 snap-x snap-mandatory scroll-smooth scrollbar-thin">
        <div className="flex gap-5 sm:gap-5 md:gap-6 lg:gap-7">
          {result.variations.map((variation, i) => (
            <div
              key={variation.id}
              className="flex-shrink-0 snap-start snap-always animate-slide-up w-[88vw] sm:w-[75vw] md:w-[55vw] lg:w-[450px] xl:w-[500px] h-[380px] xs:h-[420px] sm:h-[460px] md:h-[500px] lg:h-[550px] hover-lift"
              style={{ animationDelay: `${i * ANIMATION_DELAYS.STAGGER_BASE}ms` }}
            >
              <ComponentPreview variation={variation} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll dots for mobile */}
      <div className="flex justify-center gap-2.5 mt-4 sm:hidden">
        {result.variations.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-orange-500 w-8' : 'bg-neutral-300 w-2'}`}
          />
        ))}
      </div>
    </div>
  </div>
)

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

  React.useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [instruction])

  return (
    <div className="fixed bottom-[calc(6.5rem+env(safe-area-inset-bottom))] sm:bottom-10 left-0 right-0 z-[90] w-full px-4 sm:px-6 animate-slide-up" style={{ animationDelay: '0.8s' }}>
      <div className="w-full max-w-[calc(100%-1rem)] sm:max-w-4xl mx-auto">
        <div className="bg-white border border-neutral-200 p-1.5 sm:p-2.5 group/input transition-all duration-500 shadow-[0_12px_48px_rgba(0,0,0,0.12)] focus-within:shadow-[0_20px_64px_rgba(0,0,0,0.16)] focus-within:border-orange-500/30 rounded-[2rem] w-full">
          {error && (
            <div className="mx-1 mb-1 p-3 bg-red-50 rounded-2xl text-xs font-accent font-500 text-red-600 flex items-center justify-between animate-slide-up border border-red-100">
              <span className="flex items-center gap-2.5 min-w-0 flex-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="break-words line-clamp-2">{error}</span>
              </span>
              <button
                onClick={onClearError}
                className="p-2.5 hover:bg-red-100 rounded-xl transition-colors touch-manipulation shrink-0 ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center sm:min-h-0 sm:min-w-0 sm:p-2"
                aria-label="Clear error"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={instruction}
                onChange={(e) => onInstructionChange(e.target.value)}
                placeholder="Describe your component in detail..."
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-5 py-4 text-base font-accent font-medium resize-none min-h-[60px] max-h-[120px] scrollbar-hide text-neutral-700 leading-relaxed rounded-xl placeholder:text-neutral-400 placeholder:font-400 tracking-snug"
                style={{ fontSize: 'max(16px, 1rem)' }}
                disabled={loading}
                rows={1}
                aria-label="Component description"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="sentences"
                spellCheck="true"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0 pr-2">
              <button
                onClick={onGenerate}
                disabled={loading || !instruction.trim()}
                type="button"
                className={`px-5 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-display font-700 tracking-widest uppercase transition-all duration-300 touch-manipulation flex items-center gap-2.5 ${
                  loading || !instruction.trim()
                    ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
                    : 'bg-black text-white hover:shadow-xl hover:shadow-neutral-900/20 active:scale-95'
                }`}
                aria-label="Generate components"
              >
                {loading ? (
                  <>
                    <div className="spinner !w-4 !h-4 !border-2 !border-white/30 !border-t-white" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span>Create</span>
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
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
