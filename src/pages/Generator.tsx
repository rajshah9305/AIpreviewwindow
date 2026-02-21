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
  const maxChars = 500
  
  useEffect(() => {
    const settings = loadSettings()
    setHasSettings(!!(settings && settings.apiKey))
  }, [])
  
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
    <div className="flex flex-col min-h-[calc(100vh-8rem)] relative">
      <div className="flex-1 pb-40">
        {!loading && !result && (
          <div className="max-w-4xl mx-auto text-center pt-12 md:pt-20 mb-12 md:mb-16 animate-slide-up">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50/50 text-orange-600 mb-10 border border-orange-100/50 shadow-sm">
               <Sparkles className="w-4 h-4" />
               <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Next-Gen Component Engine</span>
             </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 italic leading-[0.85]">
              BUILD <span className="text-orange-500">FASTER.</span><br />
              DESIGN <span className="text-orange-500">BETTER.</span>
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 font-medium max-w-2xl mx-auto leading-relaxed px-4">
              Transform your thoughts into premium UI components with AI.<br className="hidden md:block" /> Describe your vision, we'll handle the rest.
            </p>

            {!hasSettings && (
              <div className="mt-10 md:mt-14 p-8 md:p-10 bg-white/70 backdrop-blur-2xl rounded-3xl md:rounded-[2.5rem] border border-white/60 inline-block text-left animate-float shadow-2xl shadow-black/10 max-w-md mx-4">
                <div className="flex items-start gap-5 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
                    <AlertCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm md:text-base text-black mb-1">Configuration Required</p>
                    <p className="text-xs md:text-sm text-neutral-500 font-normal mb-5 md:mb-6 leading-relaxed">Setup your API provider to start generating components.</p>
                    <button
                      onClick={() => navigate('/settings')}
                      className="mt-4 px-5 md:px-6 py-2 md:py-2.5 bg-black text-white rounded-lg text-[11px] md:text-xs font-semibold hover:bg-neutral-900 transition-all flex items-center gap-2 group active:scale-95"
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
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Generating Variations</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {loadingVariations.map((v, i) => (
                <div key={v.id} className="h-[550px] animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <LoadingSkeleton />
                </div>
              ))}
            </div>
          </div>
        ) : result ? (
          <div className="space-y-8 md:space-y-12 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 border-b border-neutral-100 pb-6 md:pb-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">The Collection</h3>
              </div>
              <button
                onClick={handleClearAndNew}
                className="flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-neutral-100 text-black rounded-lg md:rounded-xl text-[11px] md:text-xs font-semibold hover:bg-neutral-200 transition-all active:scale-95"
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
      <div className="fixed bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 md:px-8 z-50">
        <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-3 md:p-4 shadow-2xl shadow-black/5 group/input transition-all duration-500 focus-within:border-orange-500/20 focus-within:shadow-orange-500/5">
          {error && (
            <div className="mx-3 md:mx-4 mb-3 p-4 bg-red-50 rounded-2xl text-[11px] font-bold text-red-600 flex items-center justify-between animate-slide-up">
              <span className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error.toUpperCase()}
              </span>
              <button onClick={clearError} className="p-1 hover:bg-red-100 rounded-lg transition-colors">✕</button>
            </div>
          )}
          
          <div className="flex items-center gap-4 px-4">
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value.slice(0, maxChars))}
              onKeyDown={handleKeyPress}
              placeholder="Describe your vision..."
              className="flex-1 bg-transparent border-none focus:ring-0 py-4 text-base md:text-lg font-medium placeholder:text-neutral-300 resize-none min-h-[56px] max-h-[150px] scrollbar-hide"
              disabled={loading}
              rows={1}
            />
            
            <button
              onClick={handleGenerateClick}
              disabled={loading || !instruction.trim()}
              className={`h-14 w-14 shrink-0 flex items-center justify-center rounded-full transition-all duration-500 ${
                loading || !instruction.trim()
                ? 'bg-neutral-100 text-neutral-300'
                : 'bg-black text-white hover:bg-orange-500 hover:scale-105 shadow-xl active:scale-95'
              }`}
            >
              {loading ? <div className="spinner !w-5 !h-5" /> : <Wand2 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
