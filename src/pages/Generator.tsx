import { Wand2, Sparkles, AlertCircle } from 'lucide-react'
import ComponentPreview from '../components/ComponentPreview'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { useGeneration } from '../contexts/GenerationContext'

export default function Generator() {
  const {
    instruction,
    setInstruction,
    loading,
    result,
    error,
    clearError,
    handleGenerate,
  } = useGeneration()
  
  
  // Loading skeleton variations
  const loadingVariations = [
    { id: 'loading-1', name: 'Minimalist', code: '', style: 'minimal' as const },
    { id: 'loading-2', name: 'Statement', code: '', style: 'bold' as const },
    { id: 'loading-3', name: 'Sophisticated', code: '', style: 'elegant' as const },
    { id: 'loading-4', name: 'Expressive', code: '', style: 'playful' as const },
    { id: 'loading-5', name: 'Contemporary', code: '', style: 'modern' as const },
  ]
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleGenerate()
    }
  }
  
  
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] relative">
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden pb-24">
        {loading ? (
          <div className="h-full flex flex-col animate-fade-in">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h3 className="text-4xl font-display font-black text-neutral-900 tracking-tight">
                  Generating Variations
                </h3>
                <p className="text-base text-neutral-500 font-medium mt-1">
                  Our AI is crafting 5 unique designs for you...
                </p>
              </div>
            </div>
            
            {/* Horizontal Scroll for Loading */}
            <div className="flex-1 overflow-hidden -mx-4">
              <div className="h-full overflow-x-auto overflow-y-hidden px-4 pb-6">
                <div className="flex gap-6 h-full min-w-min">
                  {loadingVariations.map((variation) => (
                    <div key={variation.id} className="flex-shrink-0 w-[450px] h-full group">
                      <LoadingSkeleton
                        style={variation.style}
                        name={variation.name}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : result ? (
          <div className="h-full flex flex-col animate-fade-in">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h3 className="text-4xl font-display font-black text-neutral-900 tracking-tight">
                  Generated Variations
                </h3>
                <p className="text-base text-neutral-500 font-medium mt-1">
                  {result.variations.length} unique interpretations of your request
                </p>
              </div>
              
              {result.modelName && result.provider && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl border border-neutral-200 shadow-sm transition-all hover:shadow-md">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">{result.provider}</span>
                  <span className="text-neutral-300">|</span>
                  <span className="text-xs font-medium text-neutral-600">{result.modelName}</span>
                </div>
              )}
            </div>
            
            {/* Horizontal Scroll for Results */}
            <div className="flex-1 overflow-hidden -mx-4">
              <div className="h-full overflow-x-auto overflow-y-hidden px-4 pb-8">
                <div className="flex gap-8 h-full min-w-min">
                  {result.variations.map((variation) => (
                    <div key={variation.id} className="flex-shrink-0 w-[450px] h-full">
                      <ComponentPreview 
                        variation={variation}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-lg">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-10 h-10 text-primary-500" aria-hidden="true" />
              </div>
              <p className="text-xl font-display font-bold text-neutral-800 mb-2">Ready to Create</p>
              <p className="text-sm text-neutral-600 mb-4">
                Describe your UI component below and get 5 unique variations
              </p>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-200 shadow-sm">
                <kbd className="px-2 py-1 text-xs font-mono font-semibold bg-white rounded border border-neutral-300">⌘</kbd>
                <span className="text-xs text-neutral-600">+</span>
                <kbd className="px-2 py-1 text-xs font-mono font-semibold bg-white rounded border border-neutral-300">Enter</kbd>
                <span className="text-xs text-neutral-600 ml-1">to generate</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Floating Input Area */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-40">
        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-neutral-200/50 transition-all duration-500 hover:shadow-[0_20px_70px_rgba(0,0,0,0.15)] group/input-container">
          {error && (
            <div className="mx-2 mb-3 bg-red-50/50 backdrop-blur-md border border-red-100 rounded-2xl p-4 text-sm text-red-800 flex items-start justify-between animate-fade-in" role="alert">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-bold">Generation Error</p>
                  <p className="text-red-600/80">{error}</p>
                </div>
              </div>
              <button 
                onClick={clearError} 
                className="p-1 hover:bg-red-100 rounded-full transition-colors"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <div className="flex-1 relative group">
              <textarea
                id="instruction-input"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="What can I build for you today?"
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-[2rem] px-7 py-5 pr-32 min-h-[72px] max-h-[200px] text-base font-medium leading-relaxed focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all duration-400 placeholder:text-neutral-400"
                disabled={loading}
                aria-label="Component description"
                rows={1}
              />

              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center">
                <div className="h-4 w-px bg-neutral-200 mr-4" />
                <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-tight">
                  {instruction.length} / 500
                </span>
              </div>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={loading || !instruction.trim()}
              className="group relative flex items-center justify-center h-[72px] px-8 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-[1.75rem] font-bold text-base shadow-[0_10px_20px_-5px_rgba(240,118,11,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(240,118,11,0.4)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:scale-100 overflow-hidden"
              aria-label="Generate UI components"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative flex items-center space-x-2">
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Working...</span>
                  </div>
                ) : (
                  <>
                    <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span>Generate</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
