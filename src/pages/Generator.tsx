import { useEffect, useState, useCallback, useRef } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, RefreshCw, Zap, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
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

  const handleGenerateClick = useCallback(async () => {
    await handleGenerate()
  }, [handleGenerate])

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
          <HeroSection />
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

const HeroSection = () => (
  <div className="max-w-5xl mx-auto text-center pt-20 sm:pt-24 md:pt-32 pb-12 animate-slide-up px-4 sm:px-6 w-full">
    <div className="inline-flex items-center justify-center mb-10 sm:mb-12 animate-text-reveal-up" style={{ animationDelay: '0.1s' }}>
      <div className="px-5 py-2.5 rounded-full bg-white border border-neutral-200 flex items-center gap-2.5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-orange-200">
        <Zap className="w-4 h-4 text-[#f97316]" fill="currentColor" />
        <span className="text-[10px] font-display font-700 text-neutral-900 tracking-widest-xl uppercase">
          Next-Gen AI Component Engine
        </span>
      </div>
    </div>

    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-700 tracking-tightest leading-[0.95] mb-8 sm:mb-10 px-2 break-words">
      <span className="text-black animate-text-reveal-up inline-block" style={{ animationDelay: '0.2s' }}>Build </span>
      <span className="text-brand-primary animate-text-reveal-up inline-block animate-gradient-shift" style={{ animationDelay: '0.3s' }}>Faster</span>
      <br />
      <span className="text-black animate-text-reveal-up inline-block" style={{ animationDelay: '0.4s' }}>Design </span>
      <span className="text-brand-primary animate-text-reveal-up inline-block animate-gradient-shift" style={{ animationDelay: '0.5s' }}>Better</span>
    </h1>

    <p className="text-lg sm:text-xl md:text-2xl text-neutral-500 max-w-3xl mx-auto px-4 sm:px-6 animate-text-reveal-up font-accent leading-relaxed break-words mb-16 font-400 tracking-snug" style={{ animationDelay: '0.6s' }}>
      Transform your ideas into production-ready UI components with AI-powered precision.
    </p>
  </div>
)

const LoadingState = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
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

      <div className="relative group">
        <div className="hidden md:block">
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 shadow-lg text-neutral-900 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-0"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 shadow-lg text-neutral-900 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-0"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="relative -mx-3 sm:-mx-3 md:-mx-4 lg:-mx-6 w-screen max-w-full" style={{ maxWidth: 'calc(100vw - 1rem)' }}>
          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden pb-4 px-3 sm:px-3 md:px-4 lg:px-6 snap-x snap-mandatory scroll-smooth scrollbar-thin"
          >
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
  )
}

interface ResultsStateProps {
  result: { variations: Array<{ id: string; name: string; code: string; style: 'minimal' | 'bold' | 'elegant' | 'playful' | 'modern' }> }
  onClearAndNew: () => void
}

const ResultsState = ({ result, onClearAndNew }: ResultsStateProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
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

      <div className="relative group">
        <div className="hidden md:block">
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 shadow-lg text-neutral-900 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-0"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 shadow-lg text-neutral-900 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-0"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="relative -mx-3 sm:-mx-3 md:-mx-4 lg:-mx-6 w-screen max-w-full" style={{ maxWidth: 'calc(100vw - 1rem)' }}>
          <div className="absolute left-0 top-0 bottom-4 w-12 sm:w-16 bg-gradient-to-r from-[#f5f5f5] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-12 sm:w-16 bg-gradient-to-l from-[#f5f5f5] to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden pb-4 px-3 sm:px-3 md:px-4 lg:px-6 snap-x snap-mandatory scroll-smooth scrollbar-thin"
          >
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

  React.useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [instruction])

  return (
    <div className="fixed bottom-[calc(8rem+env(safe-area-inset-bottom))] sm:bottom-20 left-0 right-0 z-[90] w-full px-4 sm:px-8 animate-slide-up" style={{ animationDelay: '0.8s' }}>
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white border border-neutral-200 p-2 sm:p-3 group/input transition-all duration-500 shadow-[0_32px_128px_rgba(0,0,0,0.18)] focus-within:shadow-[0_48px_160px_rgba(0,0,0,0.22)] focus-within:border-orange-500/50 rounded-[2.5rem] w-full overflow-hidden">
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

          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={instruction}
                onChange={(e) => onInstructionChange(e.target.value)}
                placeholder="Describe your component in detail..."
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-6 py-5 text-base font-accent font-500 resize-none min-h-[64px] max-h-[140px] scrollbar-hide text-neutral-800 leading-relaxed rounded-2xl placeholder:text-neutral-400 placeholder:font-400 tracking-snug"
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

            <div className="flex items-center gap-2 shrink-0 pr-4">
              <button
                onClick={onGenerate}
                disabled={loading || !instruction.trim()}
                type="button"
                className={`px-6 sm:px-8 py-3.5 rounded-full text-xs font-display font-800 tracking-widest uppercase transition-all duration-500 touch-manipulation flex items-center gap-3 ${
                  loading || !instruction.trim()
                    ? 'bg-neutral-50 text-neutral-300 cursor-not-allowed border border-neutral-100'
                    : 'bg-black text-white hover:shadow-2xl hover:shadow-neutral-900/30 active:scale-95'
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
