import { Wand2, AlertCircle, RefreshCw, ChevronRight, Sparkles } from 'lucide-react'
import ComponentPreview from '../components/ComponentPreview'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { useGeneration } from '../contexts/GenerationContext'
import { useToast } from '../components/ToastContainer'
import { useNavigate } from 'react-router-dom'
import { loadSettings } from '../services/api'
import { useEffect, useState } from 'react'

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
  const [charCount, setCharCount] = useState(0)
  const maxChars = 500
  
  useEffect(() => {
    const settings = loadSettings()
    setHasSettings(!!(settings && settings.apiKey))
  }, [])
  
  useEffect(() => {
    setCharCount(instruction.length)
  }, [instruction])
  
  const loadingVariations = [
    { id: 'loading-1', name: 'Minimalist' },
    { id: 'loading-2', name: 'Statement' },
    { id: 'loading-3', name: 'Sophisticated' },
    { id: 'loading-4', name: 'Expressive' },
    { id: 'loading-5', name: 'Contemporary' },
  ]
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      if (!loading && instruction.trim()) {
        handleGenerateClick()
      }
    }
  }
  
  const handleGenerateClick = async () => {
    if (!hasSettings) {
      toast.warning('Please configure your AI settings first')
      setTimeout(() => navigate('/settings'), 1500)
      return
    }
    await handleGenerate()
  }
  
  const handleClearAndNew = () => {
    clearResult()
    setInstruction('')
  }
  
  return (
    <div className="flex flex-col min-h-[calc(100vh-16rem)] relative">
      <div className="flex-1 pb-40">
        {!loading && !result && (
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 animate-slide-up">
             <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-orange-50 text-orange-600 mb-6 md:mb-8 border border-orange-100">
               <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
               <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Next-Gen Component Engine</span>
             </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-4 md:mb-6 italic uppercase leading-none">
              Build <span className="text-orange-500">Faster</span>.<br />
              Design <span className="text-orange-500">Better</span>.
            </h2>
            <p className="text-base md:text-lg text-neutral-400 font-medium max-w-xl mx-auto leading-relaxed px-4">
              Transform your thoughts into premium UI components with AI. Describe your vision, we'll handle the rest.
            </p>

            {!hasSettings && (
              <div className="mt-8 md:mt-12 p-6 md:p-8 bg-neutral-50 rounded-[2rem] md:rounded-[2.5rem] border border-neutral-100 inline-block text-left animate-float shadow-premium max-w-md mx-4">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm border border-neutral-100 shrink-0">
                    <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-black text-xs md:text-sm uppercase italic tracking-tight">Configuration Required</p>
                    <p className="text-[11px] md:text-xs text-neutral-400 font-medium mb-4 md:mb-6 mt-1">Setup your API provider to start the engine.</p>
                    <button
                      onClick={() => navigate('/settings')}
                      className="px-5 md:px-6 py-2 md:py-2.5 bg-black text-white rounded-xl text-[11px] md:text-xs font-bold hover:bg-neutral-900 transition-all flex items-center gap-2 group shadow-lg shadow-black/10 active:scale-95"
                    >
                      Connect Provider <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="space-y-8 md:space-y-12 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-100 pb-6 md:pb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-3 md:mb-4">
                  Processing
                </div>
                <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">Generating Variations</h3>
                <p className="text-xs md:text-sm text-neutral-400 font-medium mt-2">Our AI is distilling your prompt into five high-end designs.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {loadingVariations.map((v, i) => (
                <div key={v.id} className="h-[550px] animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <LoadingSkeleton name={v.name} />
                </div>
              ))}
            </div>
          </div>
        ) : result ? (
          <div className="space-y-8 md:space-y-12 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 border-b border-neutral-100 pb-6 md:pb-8">
              <div>
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-3 md:mb-4">
                  Complete
                </div>
                <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">The Collection</h3>
                <p className="text-xs md:text-sm text-neutral-400 font-medium mt-2">Five distinct interpretations powered by <span className="text-black font-bold uppercase italic tracking-tight">{result.provider}</span></p>
              </div>
              <button
                onClick={handleClearAndNew}
                className="flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-neutral-100 text-black rounded-xl md:rounded-2xl text-[11px] md:text-xs font-black uppercase tracking-widest hover:bg-neutral-200 transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>New Generation</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {result.variations.map((variation, i) => (
                <div key={variation.id} className="h-[600px] animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <ComponentPreview variation={variation} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      
      {/* Input Area */}
      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 md:px-6 z-50">
        <div className="bg-white/90 backdrop-blur-3xl border border-neutral-100 rounded-[2rem] md:rounded-[2.5rem] p-2 md:p-3 shadow-orange group/input transition-all duration-500 focus-within:shadow-[0_30px_60px_-12px_rgb(249_115_22_0.2)] focus-within:border-orange-500/20">
          {error && (
            <div className="mx-3 md:mx-4 mb-2 md:mb-3 p-3 md:p-4 bg-red-50 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-bold text-red-600 flex items-center justify-between animate-slide-up">
              <span className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {error.toUpperCase()}
              </span>
              <button onClick={clearError} className="p-1 hover:bg-red-100 rounded-lg transition-colors">✕</button>
            </div>
          )}
          
          <div className="flex items-center gap-2 md:gap-4 px-2 md:px-3">
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value.slice(0, maxChars))}
              onKeyDown={handleKeyPress}
              placeholder="Describe your vision (e.g., 'A premium checkout card with glassmorphism')"
              className="flex-1 bg-transparent border-none focus:ring-0 px-1 py-3 md:py-4 text-sm md:text-[15px] font-medium placeholder:text-neutral-300 resize-none min-h-[48px] md:min-h-[56px] max-h-[120px] md:max-h-[150px] scrollbar-hide"
              disabled={loading}
              rows={1}
            />
            
            <button
              onClick={handleGenerateClick}
              disabled={loading || !instruction.trim()}
              className={`h-12 w-12 md:h-14 md:w-14 shrink-0 flex items-center justify-center rounded-full transition-all duration-500 ${
                loading || !instruction.trim()
                ? 'bg-neutral-100 text-neutral-300'
                : 'bg-black text-white hover:bg-orange-500 hover:scale-110 shadow-lg active:scale-95'
              }`}
            >
              {loading ? <div className="spinner !w-4 !h-4 md:!w-5 md:!h-5" /> : <Wand2 className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          </div>
          <div className="px-3 md:px-5 pb-1 md:pb-2 flex justify-between items-center opacity-40">
            <span className="text-[9px] md:text-[10px] font-bold tracking-tight uppercase">
              {navigator.platform.includes('Mac') ? '⌘' : 'CTRL'} + ENTER TO DEPLOY
            </span>
            <span className={`text-[9px] md:text-[10px] font-bold tracking-tight uppercase ${charCount > maxChars * 0.9 ? 'text-red-500' : ''}`}>
              {charCount} / {maxChars}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
