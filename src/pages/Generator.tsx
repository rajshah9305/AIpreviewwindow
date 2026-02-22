import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wand2, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react'
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
    <div className="flex flex-col min-h-[calc(100vh-12rem)] relative w-full max-w-full overflow-x-hidden">
      <div className="flex-1 pb-20 sm:pb-24 md:pb-28 lg:pb-32 w-full">
        {!loading && !result && (
          <HeroSection hasSettings={hasSettings} onNavigateToSettings={() => navigate(ROUTES.SETTINGS)} />
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
  <div className="max-w-4xl mx-auto text-center mb-4 sm:mb-6 md:mb-10 lg:mb-14 xl:mb-16 animate-slide-up px-2 sm:px-3 md:px-4 w-full">
    <div className="text-label text-orange-500 mb-3 sm:mb-4 md:mb-6 lg:mb-8 animate-text-reveal tracking-[0.12em]">
      {APP_CONFIG.TAGLINE.toUpperCase()}
    </div>
    <h2 className="heading-hero mb-4 sm:mb-5 md:mb-7 lg:mb-9 text-black px-2 break-words">
      <span className="text-black animate-text-reveal inline-block" style={{ animationDelay: '0.1s' }}>BUILD</span>{' '}
      <span className="text-orange-500 animate-text-reveal inline-block" style={{ animationDelay: '0.2s' }}>FASTER</span>
      <br />
      <span className="text-black animate-text-reveal inline-block" style={{ animationDelay: '0.3s' }}>DESIGN</span>{' '}
      <span className="text-orange-500 animate-text-reveal inline-block" style={{ animationDelay: '0.4s' }}>BETTER</span>
    </h2>
    <p className="text-body-lg text-neutral-700 max-w-2xl mx-auto px-2 sm:px-3 md:px-4 animate-text-reveal font-sans leading-relaxed break-words" style={{ animationDelay: '0.5s' }}>
      Transform your <span className="text-elegant text-black font-semibold">thoughts</span> into premium UI components with AI. Describe your <span className="text-elegant text-black font-semibold">vision</span>, we'll handle the rest.
    </p>

    {!hasSettings && (
      <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12 p-4 sm:p-5 md:p-6 lg:p-7 bg-white rounded-xl sm:rounded-2xl md:rounded-3xl border border-neutral-200 inline-block text-left shadow-[0_8px_32px_rgba(0,0,0,0.08)] max-w-md mx-auto w-full sm:w-auto animate-scale-in hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] transition-shadow duration-300" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4 lg:gap-5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-orange-500/10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm border border-orange-500/10 shrink-0">
            <AlertCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-[11px] sm:text-xs md:text-sm lg:text-base text-neutral-700 tracking-tight mb-0.5 sm:mb-1 break-words">Configuration Required</p>
            <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-neutral-500 mb-2.5 sm:mb-3 md:mb-3.5 lg:mb-4 break-words">Connect your AI provider to start generating</p>
            <button
              onClick={onNavigateToSettings}
              className="px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 bg-black text-white rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] md:text-xs lg:text-sm font-display font-semibold hover:bg-neutral-900 transition-all flex items-center gap-1 sm:gap-1.5 md:gap-2 group active:scale-95 touch-manipulation tracking-tight shadow-sm hover:shadow-lg whitespace-nowrap"
            >
              Connect Provider{' '}
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)

const LoadingState = () => (
  <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 animate-fade-in w-full max-w-full overflow-x-hidden">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3 border-b border-neutral-100 pb-2 sm:pb-3 md:pb-4 lg:pb-6">
      <div className="min-w-0">
        <h3 className="heading-section truncate">Generating Variations</h3>
        <p className="text-[10px] sm:text-xs md:text-sm text-neutral-500 mt-1 font-sans truncate">Creating 5 unique design variations...</p>
      </div>
    </div>

    <div className="relative -mx-2 sm:-mx-3 md:-mx-4 lg:-mx-6 w-screen max-w-full" style={{ maxWidth: 'calc(100vw - 1rem)' }}>
      <div className="overflow-x-auto overflow-y-hidden pb-3 sm:pb-4 px-2 sm:px-3 md:px-4 lg:px-6 snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent">
        <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
          {LOADING_VARIATIONS.map((v, i) => (
            <div
              key={v.id}
              className="flex-shrink-0 snap-start snap-always animate-slide-up w-[85vw] sm:w-[75vw] md:w-[55vw] lg:w-[450px] xl:w-[500px] h-[350px] xs:h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px]"
              style={{ animationDelay: `${i * ANIMATION_DELAYS.STAGGER_BASE}ms` }}
            >
              <LoadingSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

interface ResultsStateProps {
  result: { variations: Array<{ id: string; name: string; code: string; style: 'minimal' | 'bold' | 'elegant' | 'playful' | 'modern' }> }
  onClearAndNew: () => void
}

const ResultsState = ({ result, onClearAndNew }: ResultsStateProps) => (
  <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 animate-fade-in w-full max-w-full overflow-x-hidden">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3 md:gap-4 border-b border-neutral-100 pb-2 sm:pb-3 md:pb-4 lg:pb-6">
      <div className="min-w-0 flex-1">
        <h3 className="heading-section truncate">The Collection</h3>
        <p className="text-[10px] sm:text-xs md:text-sm text-neutral-500 mt-1 font-sans truncate">Scroll horizontally to explore all variations</p>
      </div>
      <button
        onClick={onClearAndNew}
        className="flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-neutral-100 text-black rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-display font-semibold hover:bg-neutral-200 transition-all active:scale-95 touch-manipulation tracking-tight shrink-0 whitespace-nowrap"
      >
        <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
        <span>New Generation</span>
      </button>
    </div>

    <div className="relative -mx-2 sm:-mx-3 md:-mx-4 lg:-mx-6 w-screen max-w-full" style={{ maxWidth: 'calc(100vw - 1rem)' }}>
      {/* Gradient fade on edges for visual hint */}
      <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 md:w-12 bg-gradient-to-r from-[#faf8f6] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-8 md:w-12 bg-gradient-to-l from-[#faf8f6] to-transparent z-10 pointer-events-none" />
      
      <div className="overflow-x-auto overflow-y-hidden pb-3 sm:pb-4 px-2 sm:px-3 md:px-4 lg:px-6 snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent hover:scrollbar-thumb-neutral-400">
        <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
          {result.variations.map((variation, i) => (
            <div
              key={variation.id}
              className="flex-shrink-0 snap-start snap-always animate-slide-up w-[85vw] sm:w-[75vw] md:w-[55vw] lg:w-[450px] xl:w-[500px] h-[350px] xs:h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px]"
              style={{ animationDelay: `${i * ANIMATION_DELAYS.STAGGER_BASE}ms` }}
            >
              <ComponentPreview variation={variation} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll indicator for mobile */}
      <div className="flex justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-3 sm:hidden">
        {result.variations.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-neutral-300 transition-colors"
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
}: InputAreaProps) => (
  <div className="fixed bottom-1 sm:bottom-2 md:bottom-4 lg:bottom-6 xl:bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] md:w-[calc(100%-3rem)] max-w-3xl px-0 z-50 safe-bottom">
    <div className="bg-white/95 backdrop-blur-xl border border-neutral-200 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl p-1.5 sm:p-2 md:p-2.5 shadow-[0_12px_48px_rgba(0,0,0,0.1)] group/input transition-all duration-300 focus-within:border-orange-500/50 focus-within:shadow-[0_16px_64px_rgba(249,115,22,0.15)] w-full">
      {error && (
        <div className="mx-1.5 sm:mx-2 md:mx-2.5 lg:mx-3 mb-1.5 sm:mb-2 md:mb-2.5 p-2 sm:p-2.5 md:p-3 lg:p-3.5 bg-red-50 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-display font-bold text-red-600 flex items-center justify-between animate-slide-up tracking-wide border border-red-100">
          <span className="flex items-center gap-1 sm:gap-1.5 md:gap-2 min-w-0 flex-1">
            <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0" />
            <span className="break-words truncate">{error.toUpperCase()}</span>
          </span>
          <button
            onClick={onClearError}
            className="p-1 sm:p-1.5 hover:bg-red-100 rounded-lg transition-colors touch-manipulation shrink-0 ml-1 sm:ml-2"
            aria-label="Clear error"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 px-2 sm:px-2.5 md:px-3 lg:px-4">
        <textarea
          value={instruction}
          onChange={(e) => onInstructionChange(e.target.value)}
          placeholder="Describe your vision"
          className="flex-1 bg-transparent border-none focus:ring-0 px-1 py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-sm sm:text-base font-sans font-normal placeholder:text-neutral-400 resize-none min-h-[44px] sm:min-h-[48px] md:min-h-[52px] lg:min-h-[56px] max-h-[80px] sm:max-h-[100px] md:max-h-[120px] lg:max-h-[140px] scrollbar-hide text-neutral-800 leading-relaxed"
          style={{ fontSize: 'max(16px, 1rem)' }}
          disabled={loading}
          rows={1}
          aria-label="Component description"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck="true"
        />

        <button
          onClick={onGenerate}
          disabled={loading || !instruction.trim()}
          className={`h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 lg:h-12 lg:w-12 shrink-0 flex items-center justify-center rounded-lg sm:rounded-xl transition-all duration-300 touch-manipulation ${
            loading || !instruction.trim()
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : 'bg-neutral-100 text-neutral-700 hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-500/25 active:scale-95'
          }`}
          aria-label="Generate components"
        >
          {loading ? (
            <div className="spinner !w-3.5 !h-3.5 sm:!w-4 sm:!h-4 md:!w-4.5 md:!h-4.5 lg:!w-5 lg:!h-5 !border-neutral-400" />
          ) : (
            <Wand2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 lg:w-5.5 lg:h-5.5" />
          )}
        </button>
      </div>
    </div>
  </div>
)
