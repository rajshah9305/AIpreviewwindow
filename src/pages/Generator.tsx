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
  <div className="max-w-4xl mx-auto text-center pt-16 sm:pt-20 md:pt-24 pb-8 animate-slide-up px-3 sm:px-4 w-full">
    <div className="inline-flex items-center justify-center mb-8 sm:mb-10 animate-text-reveal">
      <div className="px-5 py-2 rounded-full bg-orange-50/50 border border-orange-100 flex items-center gap-2.5">
        <Zap className="w-4 h-4 text-orange-500" fill="currentColor" />
        <span className="text-xs font-display font-medium text-orange-500 tracking-[0.12em] uppercase" style={{ fontWeight: 500 }}>
          Next-Gen Component Engine
        </span>
      </div>
    </div>

    <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight leading-[1.05] mb-6 sm:mb-8 px-2 break-words" style={{ fontWeight: 600 }}>
      <span className="text-black animate-text-reveal inline-block" style={{ animationDelay: '0.1s' }}>Build </span>
      <span className="text-orange-500 animate-text-reveal inline-block" style={{ animationDelay: '0.2s' }}>Faster</span>
      <br />
      <span className="text-black animate-text-reveal inline-block" style={{ animationDelay: '0.3s' }}>Design </span>
      <span className="text-orange-500 animate-text-reveal inline-block" style={{ animationDelay: '0.4s' }}>Better</span>
    </h1>

    <p className="text-lg sm:text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto px-3 sm:px-4 animate-text-reveal font-sans leading-relaxed break-words mb-12 font-light" style={{ animationDelay: '0.5s', fontWeight: 300 }}>
      Transform your ideas into production-ready UI components.
      <br className="hidden sm:block" />
      Describe what you need, AI handles the rest.
    </p>

    {!hasSettings && (
      <div className="mt-10 sm:mt-10 md:mt-12 p-6 sm:p-6 md:p-7 bg-white backdrop-blur-xl rounded-2xl sm:rounded-3xl border-2 border-orange-500/20 inline-block text-left shadow-[0_12px_48px_rgba(249,115,22,0.15)] max-w-md mx-auto w-[calc(100%-2rem)] sm:w-auto animate-scale-in transition-all duration-300 hover:shadow-[0_16px_56px_rgba(249,115,22,0.2)] hover:border-orange-500/30" style={{ animationDelay: '0.7s' }}>
        <div className="flex items-start gap-4 sm:gap-4">
          <div className="w-12 h-12 sm:w-11 sm:h-11 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
            <AlertCircle className="w-6 h-6 sm:w-5.5 sm:h-5.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-sm sm:text-sm text-neutral-900 tracking-tight mb-1.5">Setup Required</p>
            <p className="text-xs sm:text-xs text-neutral-600 mb-4 sm:mb-4 leading-relaxed">Connect your AI provider to start generating components</p>
            <button
              onClick={onNavigateToSettings}
              className="w-full px-5 sm:px-5 py-3 sm:py-2.5 bg-gradient-to-r from-neutral-900 to-black text-white rounded-xl text-sm sm:text-xs font-display font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-95 touch-manipulation tracking-tight shadow-md min-h-[48px] sm:min-h-0"
            >
              Connect Provider
              <ArrowRight className="w-4 h-4 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)

const LoadingState = () => (
  <div className="space-y-5 sm:space-y-6 md:space-y-8 animate-fade-in w-full max-w-full overflow-x-hidden">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-3 border-b border-neutral-200/60 pb-4 sm:pb-4 md:pb-6">
      <div className="min-w-0">
        <h3 className="heading-section truncate text-neutral-900" style={{ fontWeight: 600 }}>Generating</h3>
        <p className="text-xs sm:text-xs md:text-sm text-neutral-400 mt-1.5 font-sans truncate" style={{ fontWeight: 300 }}>Creating 5 unique design variations...</p>
      </div>
      <div className="flex items-center gap-2.5 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        <span className="text-xs sm:text-xs font-display text-orange-500 tracking-wide uppercase" style={{ fontWeight: 500 }}>Processing</span>
      </div>
    </div>

    <div className="relative -mx-3 sm:-mx-3 md:-mx-4 lg:-mx-6 w-screen max-w-full" style={{ maxWidth: 'calc(100vw - 1rem)' }}>
      <div className="overflow-x-auto overflow-y-hidden pb-4 px-3 sm:px-3 md:px-4 lg:px-6 snap-x snap-mandatory scroll-smooth scrollbar-thin">
        <div className="flex gap-4 sm:gap-4 md:gap-5 lg:gap-6">
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
      <div className="flex justify-center gap-1.5 mt-3 sm:hidden">
        {LOADING_VARIATIONS.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-pulse"
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
  <div className="space-y-5 sm:space-y-6 md:space-y-8 animate-fade-in w-full max-w-full overflow-x-hidden">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-b border-neutral-200/60 pb-4 sm:pb-4 md:pb-6">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5 mb-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100 inline-flex">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-xs sm:text-xs font-display text-green-500 tracking-wide uppercase" style={{ fontWeight: 500 }}>Complete</span>
        </div>
        <h3 className="heading-section truncate text-neutral-900" style={{ fontWeight: 600 }}>Your Collection</h3>
        <p className="text-xs sm:text-xs md:text-sm text-neutral-400 mt-1.5 font-sans truncate" style={{ fontWeight: 300 }}>
          {result.variations.length} variations generated — scroll to explore
        </p>
      </div>
      <button
        onClick={onClearAndNew}
        className="flex items-center justify-center gap-2 sm:gap-2 px-5 sm:px-5 py-3 sm:py-2.5 bg-white border border-neutral-200 text-neutral-600 rounded-xl text-sm sm:text-xs font-display hover:bg-neutral-50 hover:border-neutral-300 transition-all active:scale-95 touch-manipulation tracking-tight shrink-0 whitespace-nowrap shadow-sm min-h-[48px] sm:min-h-0"
        style={{ fontWeight: 400 }}
      >
        <RefreshCw className="w-4 h-4 sm:w-4 sm:h-4" />
        <span>New Generation</span>
      </button>
    </div>

    <div className="relative -mx-3 sm:-mx-3 md:-mx-4 lg:-mx-6 w-screen max-w-full" style={{ maxWidth: 'calc(100vw - 1rem)' }}>
      <div className="absolute left-0 top-0 bottom-4 w-10 sm:w-12 bg-gradient-to-r from-[#f5f5f5] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-4 w-10 sm:w-12 bg-gradient-to-l from-[#f5f5f5] to-transparent z-10 pointer-events-none" />
      
      <div className="overflow-x-auto overflow-y-hidden pb-4 px-3 sm:px-3 md:px-4 lg:px-6 snap-x snap-mandatory scroll-smooth scrollbar-thin">
        <div className="flex gap-4 sm:gap-4 md:gap-5 lg:gap-6">
          {result.variations.map((variation, i) => (
            <div
              key={variation.id}
              className="flex-shrink-0 snap-start snap-always animate-slide-up w-[88vw] sm:w-[75vw] md:w-[55vw] lg:w-[450px] xl:w-[500px] h-[380px] xs:h-[420px] sm:h-[460px] md:h-[500px] lg:h-[550px]"
              style={{ animationDelay: `${i * ANIMATION_DELAYS.STAGGER_BASE}ms` }}
            >
              <ComponentPreview variation={variation} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll dots for mobile */}
      <div className="flex justify-center gap-2 mt-3 sm:hidden">
        {result.variations.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-orange-500 w-6' : 'bg-neutral-300'}`}
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
    <div className="fixed bottom-0 sm:bottom-8 left-0 right-0 z-[90] w-full px-4 sm:px-6 pb-20 sm:pb-0">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white backdrop-blur-2xl border-2 border-neutral-200 rounded-[2rem] p-2 shadow-[0_8px_40px_rgba(0,0,0,0.08)] group/input transition-all duration-300 focus-within:shadow-[0_12px_56px_rgba(0,0,0,0.12)] focus-within:border-neutral-300 w-full">
          {error && (
            <div className="mx-2 mb-2 p-3.5 bg-red-50 backdrop-blur-sm rounded-2xl text-xs font-display text-red-600 flex items-center justify-between animate-slide-up border border-red-100" style={{ fontWeight: 400 }}>
              <span className="flex items-center gap-2 min-w-0 flex-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="break-words line-clamp-2">{error}</span>
              </span>
              <button
                onClick={onClearError}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors touch-manipulation shrink-0 ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center sm:min-h-0 sm:min-w-0 sm:p-1.5"
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
                placeholder="Describe your component..."
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-5 py-4 text-base font-sans resize-none min-h-[56px] max-h-[120px] scrollbar-hide text-neutral-700 leading-relaxed rounded-lg placeholder:text-neutral-300"
                style={{ fontSize: 'max(16px, 1rem)', letterSpacing: '-0.01em', fontWeight: 400 }}
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
              {/* Attachment icon placeholder */}
              <button
                type="button"
                className="p-2.5 text-neutral-400 hover:text-neutral-600 transition-colors rounded-lg hover:bg-neutral-50"
                aria-label="Attach file"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              <button
                onClick={onGenerate}
                disabled={loading || !instruction.trim()}
                type="button"
                className={`px-6 py-3 rounded-full text-sm font-display transition-all duration-300 touch-manipulation flex items-center gap-2 ${
                  loading || !instruction.trim()
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-neutral-900 text-white hover:bg-black shadow-lg hover:shadow-xl active:scale-95'
                }`}
                style={{ fontWeight: 500 }}
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
