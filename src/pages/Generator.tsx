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
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Main Content Area - Single Panel with Horizontal Scroll */}
      <div className="flex-1 overflow-hidden pb-6">
        {loading ? (
          <div className="h-full flex flex-col">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-display font-bold text-neutral-900 mb-1">
                  Generating Variations
                </h3>
                <p className="text-sm text-neutral-600">
                  Creating 5 unique designs based on your description...
                </p>
              </div>
            </div>
            
            {/* Single Panel with Horizontal Scroll for Loading */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex gap-6 h-full min-w-min">
                  {loadingVariations.map((variation) => (
                    <div key={variation.id} className="flex-shrink-0 w-[360px] h-full">
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
          <div className="h-full flex flex-col">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-display font-bold text-neutral-900 mb-1">
                  Generated Variations
                </h3>
                <p className="text-sm text-neutral-600">
                  {result.variations.length} unique variations • Click to view code or copy
                </p>
              </div>
              
              {result.modelName && result.provider && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-neutral-200 shadow-sm">
                  <span className="text-xs font-medium text-neutral-500">{result.provider}</span>
                  <span className="text-xs text-neutral-400" aria-hidden="true">•</span>
                  <span className="text-xs font-semibold text-neutral-700">{result.modelName}</span>
                </div>
              )}
            </div>
            
            {/* Single Panel with Horizontal Scroll for Results */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex gap-6 h-full min-w-min">
                  {result.variations.map((variation) => (
                    <div key={variation.id} className="flex-shrink-0 w-[360px] h-full">
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
            <div className="text-center text-neutral-400 max-w-lg p-12">
              <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-primary-100 to-accent-100 rounded-3xl flex items-center justify-center shadow-xl">
                <Sparkles className="w-14 h-14 text-primary-500" aria-hidden="true" />
              </div>
              <p className="text-2xl font-display font-bold text-neutral-800 mb-3">Ready to Create</p>
              <p className="text-base text-neutral-600 mb-8 leading-relaxed">
                Describe your UI component below and get 5 unique design variations instantly
              </p>
              <div className="inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-200 shadow-sm">
                <kbd className="px-2.5 py-1.5 text-xs font-mono font-semibold bg-white rounded border border-neutral-300 shadow-sm">⌘</kbd>
                <span className="text-sm text-neutral-600 font-medium">+</span>
                <kbd className="px-2.5 py-1.5 text-xs font-mono font-semibold bg-white rounded border border-neutral-300 shadow-sm">Enter</kbd>
                <span className="text-sm text-neutral-600 font-medium ml-2">to generate</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Input Area - Enhanced */}
      <div className="border-t-2 border-neutral-200 bg-white/95 backdrop-blur-xl pt-5 pb-2 shadow-2xl">
        <div className="relative">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 text-sm text-red-800 flex items-start justify-between shadow-sm animate-fade-in" role="alert">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Error</p>
                  <p>{error}</p>
                </div>
              </div>
              <button 
                onClick={clearError} 
                className="text-red-600 hover:text-red-800 text-sm font-semibold ml-4 transition-colors"
                aria-label="Dismiss error"
              >
                Dismiss
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label htmlFor="instruction-input" className="block text-sm font-semibold text-neutral-700 mb-2">
                Describe your component
              </label>
              <div className="relative">
                <textarea
                  id="instruction-input"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="e.g., Create a modern pricing card with three tiers, gradient backgrounds, and feature lists..."
                  className="input-field w-full resize-none pr-32 min-h-[100px] max-h-[240px] text-base leading-relaxed focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                  disabled={loading}
                  aria-label="Component description"
                  rows={3}
                />
                
                {/* Bottom right controls */}
                <div className="absolute bottom-3 right-3 flex items-center space-x-3">
                  <button
                    onClick={() => setShowExamples(!showExamples)}
                    className="text-xs font-medium px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-700 transition-all duration-200 border border-neutral-300 shadow-sm"
                    disabled={loading}
                    aria-label={showExamples ? 'Hide examples' : 'Show examples'}
                  >
                    {showExamples ? '✕ Hide' : '💡 Examples'}
                  </button>
                  <span className="text-xs font-medium text-neutral-500 tabular-nums">
                    {instruction.length} chars
                  </span>
                </div>
              </div>
              
              {/* Examples dropdown - Enhanced */}
              {showExamples && (
                <div className="mt-3 p-4 bg-white rounded-xl border-2 border-primary-200 shadow-xl animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-neutral-800">Try these examples:</p>
                    <button
                      onClick={() => setShowExamples(false)}
                      className="text-xs text-neutral-500 hover:text-neutral-700"
                      aria-label="Close examples"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {examples.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleExampleClick(example)}
                        className="text-sm px-4 py-3 bg-gradient-to-br from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 rounded-lg text-neutral-800 transition-all duration-200 text-left border border-primary-200 hover:border-primary-300 hover:shadow-md font-medium"
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
              className="btn-primary px-10 py-7 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 text-lg font-bold shadow-xl hover:shadow-2xl"
              aria-label="Generate UI components"
            >
              <Wand2 className="w-6 h-6" aria-hidden="true" />
              <span>{loading ? 'Generating...' : 'Generate'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
