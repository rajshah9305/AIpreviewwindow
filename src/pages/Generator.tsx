import { Wand2, Sparkles } from 'lucide-react'
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
      handleGenerate()
    }
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Main Content Area - Single Panel with Horizontal Scroll */}
      <div className="flex-1 overflow-hidden pb-4">
        {loading ? (
          <div className="h-full flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-neutral-900">
                  Generating Variations
                </h3>
                <p className="text-sm text-neutral-600">
                  Creating 5 unique designs...
                </p>
              </div>
            </div>
            
            {/* Single Panel with Horizontal Scroll for Loading */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex gap-4 h-full min-w-min">
                  {loadingVariations.map((variation) => (
                    <div key={variation.id} className="flex-shrink-0 w-[340px] h-full">
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
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-neutral-900">
                  Generated Variations
                </h3>
                <p className="text-sm text-neutral-600">
                  {result.variations.length} variations ready
                </p>
              </div>
              
              {result.modelName && result.provider && (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-white rounded-lg border border-neutral-200 shadow-sm">
                  <span className="text-xs font-medium text-neutral-500">{result.provider}</span>
                  <span className="text-xs text-neutral-400" aria-hidden="true">•</span>
                  <span className="text-xs font-medium text-neutral-700">{result.modelName}</span>
                </div>
              )}
            </div>
            
            {/* Single Panel with Horizontal Scroll for Results */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex gap-4 h-full min-w-min">
                  {result.variations.map((variation) => (
                    <div key={variation.id} className="flex-shrink-0 w-[340px] h-full">
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
            <div className="text-center text-neutral-400 max-w-md p-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-accent-100 rounded-3xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-12 h-12 text-primary-500" aria-hidden="true" />
              </div>
              <p className="text-xl font-display font-semibold text-neutral-700 mb-3">Ready to Create</p>
              <p className="text-sm text-neutral-500 mb-6">
                Describe your UI component below and get 5 unique variations instantly
              </p>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 rounded-lg border border-primary-200">
                <kbd className="px-2 py-1 text-xs font-mono bg-white rounded border border-neutral-300">⌘</kbd>
                <span className="text-xs text-neutral-600">+</span>
                <kbd className="px-2 py-1 text-xs font-mono bg-white rounded border border-neutral-300">Enter</kbd>
                <span className="text-xs text-neutral-600 ml-2">to generate</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Input Area */}
      <div className="border-t border-neutral-200 bg-white/90 backdrop-blur-lg pt-4 shadow-lg">
        <div className="relative">
          {error && (
            <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 flex items-center justify-between" role="alert">
              <span>{error}</span>
              <button 
                onClick={() => {}} 
                className="text-red-600 hover:text-red-800 text-xs font-medium"
              >
                Dismiss
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  id="instruction-input"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Describe your UI component... (⌘+Enter to generate)"
                  className="input-field w-full resize-none pr-24 min-h-[80px] max-h-[200px]"
                  disabled={loading}
                  aria-label="Component description"
                  rows={2}
                />
                
                {/* Character count and examples button */}
                <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                  <button
                    onClick={() => setShowExamples(!showExamples)}
                    className="text-xs px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-600 transition-colors"
                    disabled={loading}
                  >
                    {showExamples ? 'Hide' : 'Examples'}
                  </button>
                  <span className="text-xs text-neutral-400">
                    {instruction.length}
                  </span>
                </div>
              </div>
              
              {/* Examples dropdown */}
              {showExamples && (
                <div className="mt-2 p-3 bg-white rounded-lg border border-neutral-200 shadow-lg">
                  <p className="text-xs font-medium text-neutral-700 mb-2">Try these examples:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {examples.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInstruction(example)
                          setShowExamples(false)
                        }}
                        className="text-xs px-3 py-2 bg-primary-50 hover:bg-primary-100 rounded-lg text-neutral-700 transition-all duration-200 text-left border border-primary-200"
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
              className="btn-primary px-8 py-6 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              aria-label="Generate UI components"
            >
              <Wand2 className="w-5 h-5" aria-hidden="true" />
              <span className="font-semibold">{loading ? 'Generating...' : 'Generate'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
