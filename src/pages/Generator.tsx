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
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Main Content Area - Compact and Visible */}
      <div className="flex-1 overflow-hidden pb-3">
        {loading ? (
          <div className="h-full flex flex-col">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-neutral-900">
                  Generating Variations
                </h3>
                <p className="text-xs text-neutral-600">
                  Creating 5 unique designs...
                </p>
              </div>
            </div>
            
            {/* Compact Horizontal Scroll for Loading */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-x-auto overflow-y-hidden pb-2">
                <div className="flex gap-3 h-full min-w-min">
                  {loadingVariations.map((variation) => (
                    <div key={variation.id} className="flex-shrink-0 w-[280px] h-full">
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
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-neutral-900">
                  Generated Variations
                </h3>
                <p className="text-xs text-neutral-600">
                  {result.variations.length} variations • Click to view code or copy
                </p>
              </div>
              
              {result.modelName && result.provider && (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-white rounded-lg border border-neutral-200 shadow-sm">
                  <span className="text-xs font-medium text-neutral-500">{result.provider}</span>
                  <span className="text-xs text-neutral-400" aria-hidden="true">•</span>
                  <span className="text-xs font-semibold text-neutral-700">{result.modelName}</span>
                </div>
              )}
            </div>
            
            {/* Compact Horizontal Scroll for Results */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-x-auto overflow-y-hidden pb-2">
                <div className="flex gap-3 h-full min-w-min">
                  {result.variations.map((variation) => (
                    <div key={variation.id} className="flex-shrink-0 w-[280px] h-full">
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
      
      {/* Compact Input Area */}
      <div className="border-t-2 border-neutral-200 bg-white/95 backdrop-blur-xl pt-3 pb-2 shadow-2xl">
        <div className="relative">
          {error && (
            <div className="mb-2 bg-red-50 border-l-4 border-red-500 rounded-lg p-3 text-xs text-red-800 flex items-start justify-between shadow-sm animate-fade-in" role="alert">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Error</p>
                  <p>{error}</p>
                </div>
              </div>
              <button 
                onClick={clearError} 
                className="text-red-600 hover:text-red-800 text-xs font-semibold ml-3 transition-colors"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label htmlFor="instruction-input" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Describe your component
              </label>
              <div className="relative">
                <textarea
                  id="instruction-input"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="e.g., Create a modern pricing card with three tiers..."
                  className="input-field w-full resize-none pr-28 min-h-[70px] max-h-[140px] text-sm leading-relaxed focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                  disabled={loading}
                  aria-label="Component description"
                  rows={2}
                />
                
                <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                  <button
                    onClick={() => setShowExamples(!showExamples)}
                    className="text-xs font-medium px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-700 transition-all duration-200 border border-neutral-300"
                    disabled={loading}
                    aria-label={showExamples ? 'Hide examples' : 'Show examples'}
                  >
                    {showExamples ? '✕' : '💡'}
                  </button>
                  <span className="text-xs font-medium text-neutral-500 tabular-nums">
                    {instruction.length}
                  </span>
                </div>
              </div>
              
              {showExamples && (
                <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-white rounded-lg border-2 border-primary-200 shadow-xl animate-fade-in z-50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-neutral-800">Try these:</p>
                    <button
                      onClick={() => setShowExamples(false)}
                      className="text-xs text-neutral-500 hover:text-neutral-700"
                      aria-label="Close examples"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {examples.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleExampleClick(example)}
                        className="text-xs px-3 py-2 bg-gradient-to-br from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 rounded-lg text-neutral-800 transition-all duration-200 text-left border border-primary-200 hover:border-primary-300 hover:shadow-md font-medium"
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
              className="btn-primary px-8 py-5 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 text-base font-bold shadow-xl hover:shadow-2xl"
              aria-label="Generate UI components"
            >
              <Wand2 className="w-5 h-5" aria-hidden="true" />
              <span>{loading ? 'Generating...' : 'Generate'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
