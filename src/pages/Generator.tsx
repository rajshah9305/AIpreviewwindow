/**
 * Generator page
 * Main UI component generation interface
 */

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
    <div className="flex flex-col min-h-[calc(100vh-16rem)] relative">
      <div className="flex-1 pb-32 sm:pb-36 md:pb-40">
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

// Sub-components for better organization

interface HeroSectionProps {
  hasSettings: boolean
  onNavigateToSettings: () => void
}

const HeroSection = ({ hasSettings, onNavigateToSettings }: HeroSectionProps) => (
  <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12 md:mb-16 animate-slide-up px-4">
    <div className="text-label text-orange-500 mb-4 sm:mb-6 md:mb-8 animate-text-reveal">
      {APP_CONFIG.TAGLINE.toUpperCase()}
    </div>
    <h2 className="heading-hero mb-4 sm:mb-6 md:mb-8 text-black">
      <span className="text-black animate-text-reveal inline-block" style={{ animationDelay: '0.1s' }}>BUILD</span>{' '}
      <span className="text-gradient-sunset animate-text-reveal inline-block" style={{ animationDelay: '0.2s' }}>FASTER</span>
      <br />
      <span className="text-black animate-text-reveal inline-block" style={{ animationDelay: '0.3s' }}>DESIGN</span>{' '}
      <span className="text-gradient-sunset animate-text-reveal inline-block" style={{ animationDelay: '0.4s' }}>BETTER</span>
    </h2>
    <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto px-4 animate-text-reveal font-sans" style={{ animationDelay: '0.5s' }}>
      Transform your <span className="text-elegant text-black">thoughts</span> into premium UI components with AI. Describe your <span className="text-elegant text-black">vision</span>, we'll handle the rest.
    </p>

    {!hasSettings && (
      <div className="mt-6 sm:mt-8 md:mt-12 p-5 sm:p-6 md:p-8 bg-neutral-50 rounded-2xl md:rounded-3xl border border-neutral-100 inline-block text-left shadow-premium max-w-md mx-auto w-full sm:w-auto animate-scale-in" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
          <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white rounded-lg md:rounded-xl flex items-center justify-center shadow-sm border border-neutral-100 shrink-0">
            <AlertCircle className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-xs sm:text-sm text-neutral-600 tracking-tight">Configuration Required</p>
            <button
              onClick={onNavigateToSettings}
              className="mt-3 sm:mt-4 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-black text-white rounded-lg text-[10px] sm:text-[11px] md:text-xs font-display font-semibold hover:bg-neutral-900 transition-all flex items-center gap-2 group active:scale-95 touch-manipulation tracking-tight"
            >
              Connect Provider{' '}
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)

const LoadingState = () => (
  <div className="space-y-6 sm:space-y-8 md:space-y-12 animate-fade-in">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-b border-neutral-100 pb-4 sm:pb-6 md:pb-8">
      <h3 className="heading-section">Generating Variations</h3>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {LOADING_VARIATIONS.map((v, i) => (
        <div
          key={v.id}
          className="h-[450px] sm:h-[500px] md:h-[550px] animate-slide-up"
          style={{ animationDelay: `${i * ANIMATION_DELAYS.STAGGER_BASE}ms` }}
        >
          <LoadingSkeleton />
        </div>
      ))}
    </div>
  </div>
)

interface ResultsStateProps {
  result: { variations: Array<{ id: string; name: string; code: string; style: 'minimal' | 'bold' | 'elegant' | 'playful' | 'modern' }> }
  onClearAndNew: () => void
}

const ResultsState = ({ result, onClearAndNew }: ResultsStateProps) => (
  <div className="space-y-6 sm:space-y-8 md:space-y-12 animate-fade-in">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 md:gap-6 border-b border-neutral-100 pb-4 sm:pb-6 md:pb-8">
      <h3 className="heading-section">The Collection</h3>
      <button
        onClick={onClearAndNew}
        className="flex items-center justify-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-neutral-100 text-black rounded-lg md:rounded-xl text-[10px] sm:text-[11px] md:text-xs font-display font-semibold hover:bg-neutral-200 transition-all active:scale-95 touch-manipulation tracking-tight"
      >
        <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>New Generation</span>
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {result.variations.map((variation, i) => (
        <div
          key={variation.id}
          className="h-[500px] sm:h-[550px] md:h-[600px] animate-slide-up"
          style={{ animationDelay: `${i * ANIMATION_DELAYS.STAGGER_BASE}ms` }}
        >
          <ComponentPreview variation={variation} />
        </div>
      ))}
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
  <div className="fixed bottom-3 sm:bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-3 sm:px-4 md:px-6 z-50">
    <div className="bg-white/90 backdrop-blur-3xl border-2 border-black rounded-xl sm:rounded-2xl md:rounded-3xl p-1.5 sm:p-2 md:p-3 shadow-premium group/input transition-all duration-500 focus-within:border-orange-500 focus-within:shadow-orange">
      {error && (
        <div className="mx-2 sm:mx-3 md:mx-4 mb-2 sm:mb-2.5 md:mb-3 p-2.5 sm:p-3 md:p-4 bg-red-50 rounded-lg sm:rounded-xl md:rounded-2xl text-[9px] sm:text-[10px] md:text-[11px] font-display font-bold text-red-600 flex items-center justify-between animate-slide-up tracking-wide">
          <span className="flex items-center gap-1.5 sm:gap-2">
            <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0" />
            <span className="break-words">{error.toUpperCase()}</span>
          </span>
          <button
            onClick={onClearError}
            className="p-1 hover:bg-red-100 rounded-lg transition-colors touch-manipulation shrink-0 ml-2"
            aria-label="Clear error"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 px-1.5 sm:px-2 md:px-3">
        <textarea
          value={instruction}
          onChange={(e) => onInstructionChange(e.target.value)}
          placeholder="Describe your vision (e.g., 'A premium checkout card')"
          className="flex-1 bg-transparent border-none focus:ring-0 px-1 py-2.5 sm:py-3 md:py-4 text-fluid-sm md:text-fluid-base font-sans font-normal placeholder:text-neutral-300 resize-none min-h-[44px] sm:min-h-[48px] md:min-h-[56px] max-h-[100px] sm:max-h-[120px] md:max-h-[150px] scrollbar-hide"
          disabled={loading}
          rows={1}
          aria-label="Component description"
        />

        <button
          onClick={onGenerate}
          disabled={loading || !instruction.trim()}
          className={`h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 shrink-0 flex items-center justify-center rounded-full transition-all duration-500 touch-manipulation ${
            loading || !instruction.trim()
              ? 'bg-neutral-100 text-neutral-300'
              : 'bg-black text-white hover:bg-orange-500 hover:scale-110 shadow-lg hover:shadow-orange active:scale-95'
          }`}
          aria-label="Generate components"
        >
          {loading ? (
            <div className="spinner !w-3.5 !h-3.5 sm:!w-4 sm:!h-4 md:!w-5 md:!h-5" />
          ) : (
            <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          )}
        </button>
      </div>
    </div>
  </div>
)
