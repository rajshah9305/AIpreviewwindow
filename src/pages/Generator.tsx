import { Wand2, Sparkles, AlertCircle } from 'lucide-react'
import ComponentPreview from '../components/ComponentPreview'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { useGeneration } from '../contexts/GenerationContext'
import { useState } from 'react'

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
  
  const [showExamples, setShowExamples] = useState(false)
  
  const examples = [
    'Create a pricing card with three tiers',
    'Design a contact form with name, email, and message fields',
    'Build a product showcase with image and details',
    'Make a testimonial card with avatar and quote',
    'Design a hero section with headline and CTA',
    'Create a feature grid with icons',
  ]
  
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
  
  const handleExampleClick = (example: string) => {
    setInstruction(example)
    setShowExamples(false)
    // Focus the textarea after setting example
    setTimeout(() => {
      const textarea = document.getElementById('instruction-input') as HTMLTextAreaElement
      textarea?.focus()
    }, 0)
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] relative">
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden pb-24">
        {loading ? (
          <div className="h-full flex flex-col animate-fade-in">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h3 className="text-3xl font-display font-extrabold text-neutral-900 tracking-tight">
                  Generating Variations
                </h3>
                <p className="text-sm text-neutral-500 font-medium">
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
                      <div className="h-full rounded-2xl border-2 border-neutral-200 bg-white overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-primary-200">
                        <LoadingSkeleton
                          style={variation.style}
                          name={variation.name}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : result ? (
          <div className="h-full flex flex-col animate-fade-in">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h3 className="text-3xl font-display font-extrabold text-neutral-900 tracking-tight">
                  Generated Variations
                </h3>
                <p className="text-sm text-neutral-500 font-medium">
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
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-40">
        <div className="glass-effect rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-2 border-primary-100 transition-all duration-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)]">
          {error && (
            <div className="mb-4 bg-red-50 border-2 border-red-100 rounded-2xl p-4 text-sm text-red-800 flex items-start justify-between shadow-inner animate-fade-in" role="alert">
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
          
          <div className="flex items-center gap-4">
            <div className="flex-1 relative group">
              <textarea
                id="instruction-input"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe your vision (e.g., 'Modern SaaS Pricing Table')"
                className="w-full bg-neutral-50/50 border-2 border-neutral-100 rounded-2xl px-5 py-4 pr-32 min-h-[70px] max-h-[150px] text-base font-medium leading-relaxed focus:outline-none focus:border-primary-400 focus:bg-white transition-all duration-300 shadow-sm"
                disabled={loading}
                aria-label="Component description"
                rows={1}
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-neutral-600 hover:text-primary-600 hover:border-primary-200 transition-all duration-200 shadow-sm text-xs font-bold"
                  disabled={loading}
                >
                  <span>{showExamples ? 'Close' : 'Examples'}</span>
                  <Sparkles className="w-3 h-3" />
                </button>
                <div className="h-6 w-px bg-neutral-200 mx-1" />
                <span className="text-[10px] font-mono font-bold text-neutral-400 w-8 text-right">
                  {instruction.length}
                </span>
              </div>
              
              {showExamples && (
                <div className="absolute bottom-full left-0 right-0 mb-4 p-5 glass-effect rounded-3xl border-2 border-primary-200 shadow-2xl animate-fade-in z-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-extrabold text-neutral-800 uppercase tracking-widest flex items-center space-x-2">
                      <Wand2 className="w-4 h-4 text-primary-500" />
                      <span>Inspiration</span>
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {examples.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleExampleClick(example)}
                        className="text-xs px-4 py-3 bg-white border border-neutral-100 hover:border-primary-300 hover:bg-primary-50 rounded-xl text-neutral-700 transition-all duration-200 text-left font-semibold shadow-sm hover:shadow-md"
                        disabled={loading}
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={loading || !instruction.trim()}
              className="group relative flex items-center justify-center h-[70px] min-w-[160px] bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl font-bold text-lg shadow-[0_10px_25px_-5px_rgba(240,118,11,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(240,118,11,0.5)] transition-all duration-300 disabled:opacity-50 disabled:grayscale overflow-hidden"
              aria-label="Generate UI components"
            >
              <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full transition-transform duration-700 -skew-x-12" />
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
