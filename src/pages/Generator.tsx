import { Wand2 } from 'lucide-react'
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
    handleGenerate,
  } = useGeneration()
  
  const examples = [
    'Create a pricing card with three tiers',
    'Design a contact form with name, email, and message fields',
    'Build a product showcase with image and details',
    'Make a testimonial card with avatar and quote',
  ]
  
  // Loading skeleton variations
  const loadingVariations = [
    { id: 'loading-1', name: 'Minimalist', code: '', style: 'minimal' as const },
    { id: 'loading-2', name: 'Statement', code: '', style: 'bold' as const },
    { id: 'loading-3', name: 'Sophisticated', code: '', style: 'elegant' as const },
    { id: 'loading-4', name: 'Expressive', code: '', style: 'playful' as const },
    { id: 'loading-5', name: 'Contemporary', code: '', style: 'modern' as const },
  ]
  
  return (
    <div className="flex gap-0 h-[calc(100vh-8rem)]">
      {/* Left Pane - Input */}
      <div className="w-[420px] flex-shrink-0 flex flex-col pr-6">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-2">
            Generate UI Components
          </h2>
          <p className="text-sm text-neutral-600">
            Describe what you want and get five unique variations
          </p>
        </div>
        
        <div className="card p-6 flex flex-col flex-1 overflow-hidden">
          <label htmlFor="instruction-input" className="block text-sm font-medium text-neutral-700 mb-3">
            What would you like to create?
          </label>
          
          <textarea
            id="instruction-input"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g., Design a contact form with name, email, and message fields"
            className="input-field flex-1 resize-none mb-4 min-h-[200px]"
            disabled={loading}
            aria-label="Component description"
          />
          
          <div className="mb-4 space-y-2">
            <span className="text-xs text-neutral-500 block">Try these examples:</span>
            <div className="flex flex-col gap-2" role="list">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setInstruction(example)}
                  className="text-xs px-3 py-2 bg-orange-50 hover:bg-orange-600 hover:text-white rounded-lg text-neutral-700 transition-all duration-200 text-left border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  disabled={loading}
                  role="listitem"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Generate UI components"
          >
            <Wand2 className="w-5 h-5" aria-hidden="true" />
            <span>{loading ? 'Generating...' : 'Generate Components'}</span>
          </button>
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>
      
      {/* Vertical Divider */}
      <div className="relative w-px flex-shrink-0 mx-6" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-400 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-400/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      {/* Right Pane - Preview */}
      <div className="flex-1 flex flex-col overflow-hidden pl-6">
        {loading ? (
          <>
            <div className="mb-4">
              <h3 className="text-xl font-display font-bold text-neutral-900">
                Generating Variations
              </h3>
              <p className="text-sm text-neutral-600">
                Creating 5 unique designs...
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {loadingVariations.map((variation) => (
                <LoadingSkeleton 
                  key={variation.id}
                  style={variation.style}
                  name={variation.name}
                />
              ))}
            </div>
          </>
        ) : result ? (
          <>
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
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {result.variations.map((variation) => (
                <ComponentPreview 
                  key={variation.id} 
                  variation={variation}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-neutral-400 max-w-md p-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center">
                <Wand2 className="w-10 h-10 text-primary-400" aria-hidden="true" />
              </div>
              <p className="text-lg font-semibold text-neutral-600 mb-2">No components yet</p>
              <p className="text-sm text-neutral-500">
                Enter a description on the left and click Generate to see your UI variations here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
