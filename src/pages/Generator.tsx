import { Wand2, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react'
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
  const [focusMode, setFocusMode] = useState(false)
  const maxChars = 500
  
  useEffect(() => {
    const settings = loadSettings()
    setHasSettings(!!(settings && settings.apiKey))
  }, [])
  
  useEffect(() => {
    setCharCount(instruction.length)
  }, [instruction])
  
  // Loading skeleton variations
  const loadingVariations = [
    { id: 'loading-1', name: 'Minimalist', code: '', style: 'minimal' as const },
    { id: 'loading-2', name: 'Statement', code: '', style: 'bold' as const },
    { id: 'loading-3', name: 'Sophisticated', code: '', style: 'elegant' as const },
    { id: 'loading-4', name: 'Expressive', code: '', style: 'playful' as const },
    { id: 'loading-5', name: 'Contemporary', code: '', style: 'modern' as const },
  ]
  
  // Helper function to generate example code for each style
  const getExampleCode = (index: number): string => {
    const examples = [
      // Minimalist - Clean pricing card
      `<div class="max-w-sm mx-auto">
  <div class="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300">
    <div class="text-center">
      <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Starter</h3>
      <div class="flex items-baseline justify-center mb-6">
        <span class="text-5xl font-bold text-gray-900">$29</span>
        <span class="text-gray-500 ml-2">/month</span>
      </div>
      <ul class="space-y-4 mb-8 text-left">
        <li class="flex items-center text-gray-700">
          <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          5 Projects
        </li>
        <li class="flex items-center text-gray-700">
          <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          10GB Storage
        </li>
        <li class="flex items-center text-gray-700">
          <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          Email Support
        </li>
      </ul>
      <button class="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200">
        Get Started
      </button>
    </div>
  </div>
</div>`,
      
      // Statement - Bold hero section
      `<div class="bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 p-12 rounded-2xl">
  <div class="max-w-3xl mx-auto text-center">
    <div class="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
      <span class="text-white font-bold text-sm uppercase tracking-wider">🚀 New Launch</span>
    </div>
    <h1 class="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
      Build Faster.<br/>Ship Smarter.
    </h1>
    <p class="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
      The ultimate platform for modern developers. Create, deploy, and scale your applications with confidence.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button class="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-200">
        Start Free Trial
      </button>
      <button class="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-200">
        Watch Demo
      </button>
    </div>
    <div class="mt-8 flex items-center justify-center gap-6 text-white/80 text-sm">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        No credit card required
      </div>
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        14-day free trial
      </div>
    </div>
  </div>
</div>`,
      
      // Sophisticated - Elegant testimonial
      `<div class="max-w-2xl mx-auto">
  <div class="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-10 shadow-xl border border-orange-100">
    <div class="flex items-start gap-6">
      <div class="flex-shrink-0">
        <div class="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
          S
        </div>
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-1 mb-4">
          ${Array(5).fill(0).map(() => `<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>`).join('')}
        </div>
        <blockquote class="text-gray-700 text-lg leading-relaxed mb-6 italic">
          "This product has completely transformed how we work. The attention to detail and thoughtful design make every interaction a pleasure. Highly recommended!"
        </blockquote>
        <div class="border-t border-orange-200 pt-4">
          <p class="font-semibold text-gray-900 text-lg">Sarah Mitchell</p>
          <p class="text-gray-600 text-sm">Head of Design at TechCorp</p>
        </div>
      </div>
    </div>
  </div>
</div>`,
      
      // Expressive - Playful feature card
      `<div class="max-w-md mx-auto">
  <div class="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-1 shadow-2xl transform hover:scale-105 transition-transform duration-300">
    <div class="bg-white rounded-[22px] p-8">
      <div class="bg-gradient-to-br from-orange-100 to-yellow-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform -rotate-6">
        <svg class="w-8 h-8 text-orange-600 transform rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      </div>
      <h3 class="text-2xl font-black text-gray-900 mb-3">Lightning Fast</h3>
      <p class="text-gray-600 leading-relaxed mb-6">
        Experience blazing speeds with our optimized infrastructure. Your apps load in milliseconds, not seconds.
      </p>
      <div class="flex items-center gap-3">
        <div class="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
          <div class="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full" style="width: 95%"></div>
        </div>
        <span class="text-sm font-bold text-gray-700">95% faster</span>
      </div>
      <button class="mt-6 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow duration-200">
        Learn More →
      </button>
    </div>
  </div>
</div>`,
      
      // Contemporary - Modern contact form
      `<div class="max-w-lg mx-auto">
  <div class="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
    <div class="bg-gradient-to-r from-orange-600 to-red-600 p-8 text-white">
      <h2 class="text-3xl font-bold mb-2">Get in Touch</h2>
      <p class="text-orange-100">We'd love to hear from you. Send us a message!</p>
    </div>
    <form class="p-8 space-y-6">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
        <input 
          type="text" 
          placeholder="John Doe"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
        />
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
        <input 
          type="email" 
          placeholder="john@example.com"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
        />
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Message</label>
        <textarea 
          rows="4"
          placeholder="Tell us what's on your mind..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
        ></textarea>
      </div>
      <button 
        type="submit"
        class="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200"
      >
        Send Message
      </button>
    </form>
  </div>
</div>`
    ]
    
    return examples[index] || examples[0]
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      if (!loading && instruction.trim()) {
        handleGenerate()
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
    toast.success('Ready for a new generation!')
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] relative">
      {/* Main Content Area */}
      <div className="flex-1 pb-16 overflow-hidden">
        {loading ? (
          <div className="h-full flex flex-col animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-primary-500 animate-ping opacity-75" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-neutral-900 tracking-tight">
                  Generating Variations
                </h3>
              </div>
              <p className="text-sm text-neutral-500 font-medium">
                AI is crafting 5 unique designs tailored to your requirements
              </p>
            </div>
            
            {/* Horizontal Scrollable Loading */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 scrollbar-thin scrollbar-thumb-primary-300 scrollbar-track-neutral-100">
              <div className="flex gap-4 h-full px-2">
                {loadingVariations.map((variation, index) => (
                  <div 
                    key={variation.id} 
                    className="flex-1 min-w-[280px] max-w-[calc(20%-1rem)] h-[calc(100vh-20rem)]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <LoadingSkeleton
                      style={variation.style}
                      name={variation.name}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : result ? (
          <div className="h-full flex flex-col animate-fade-in">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                  <h3 className="text-2xl sm:text-3xl font-display font-black text-neutral-900 tracking-tight">
                    Generated Variations
                  </h3>
                </div>
                <p className="text-sm text-neutral-500 font-medium">
                  {result.variations.length} unique interpretations • Scroll to explore all designs
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {result.modelName && result.provider && (
                  <div className="flex items-center self-start sm:self-auto space-x-2 px-4 py-2 bg-gradient-to-r from-white to-neutral-50 rounded-xl border border-neutral-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/50" />
                    <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">{result.provider}</span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-[10px] font-medium text-neutral-600">{result.modelName}</span>
                  </div>
                )}
                
                <button
                  onClick={handleClearAndNew}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold text-sm hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Generation</span>
                  <span className="sm:hidden">New</span>
                </button>
              </div>
            </div>
            
            {/* Horizontal Scrollable Results */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 scrollbar-thin scrollbar-thumb-primary-300 scrollbar-track-neutral-100">
              <div className="flex gap-4 h-full px-2">
                {result.variations.map((variation, index) => (
                  <div 
                    key={variation.id} 
                    className="flex-1 min-w-[280px] max-w-[calc(20%-1rem)] h-[calc(100vh-20rem)] animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ComponentPreview 
                      variation={variation}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col animate-fade-in">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 tracking-tight mb-2">
                AI Component Generator
              </h3>
              <p className="text-sm text-neutral-500 font-normal">
                Describe your UI component and watch AI create 5 unique design variations instantly
              </p>
            </div>
            
            {/* Configuration Warning */}
            {!hasSettings && (
              <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-amber-100 rounded-xl shadow-inner">
                    <AlertCircle className="w-5 h-5 text-amber-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-amber-900 mb-1.5">AI Configuration Required</p>
                    <p className="text-xs text-amber-800 mb-3">
                      Configure your AI provider to start generating beautiful components.
                    </p>
                    <button
                      onClick={() => navigate('/settings')}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold text-xs hover:bg-amber-700 transition-all duration-200 shadow-sm hover:shadow-md inline-flex items-center gap-2"
                    >
                      Configure Now <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Horizontal Scrollable Preview */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 scrollbar-thin scrollbar-thumb-primary-300 scrollbar-track-neutral-100">
              <div className="flex gap-4 h-full px-2">
                {loadingVariations.map((variation, index) => (
                  <div 
                    key={variation.id} 
                    className="flex-1 min-w-[280px] max-w-[calc(20%-1rem)] h-[calc(100vh-20rem)] animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ComponentPreview 
                      variation={{
                        id: variation.id,
                        name: variation.name,
                        style: variation.style,
                        code: getExampleCode(index)
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Fixed Input Area at Bottom - No Extra Whitespace */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-neutral-200 z-40 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5">
          {error && (
            <div className="mb-1.5 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-2 text-xs text-red-800 flex items-start justify-between animate-fade-in shadow-sm" role="alert">
              <div className="flex items-center space-x-2 flex-1">
                <div className="p-1 bg-red-200 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 text-red-700 flex-shrink-0" />
                </div>
                <div>
                  <p className="font-bold text-xs">Generation Error</p>
                  <p className="text-red-700 mt-0.5 text-[11px]">{error}</p>
                </div>
              </div>
              <button 
                onClick={clearError} 
                className="p-1 hover:bg-red-200 rounded-lg transition-colors ml-2"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <textarea
                id="instruction-input"
                value={instruction}
                onChange={(e) => {
                  if (e.target.value.length <= maxChars) {
                    setInstruction(e.target.value)
                  }
                }}
                onKeyDown={handleKeyPress}
                onFocus={() => setFocusMode(true)}
                onBlur={() => setFocusMode(false)}
                placeholder="Describe your component... (e.g., Create a pricing card with three tiers)"
                className={`w-full bg-white border-2 rounded-xl px-4 py-2 pr-16 min-h-[44px] max-h-[100px] text-sm font-medium leading-relaxed focus:outline-none transition-all resize-none placeholder:text-neutral-400 disabled:bg-neutral-50 disabled:cursor-not-allowed shadow-sm ${
                  focusMode 
                    ? 'border-primary-500 ring-4 ring-primary-500/10 shadow-lg' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
                disabled={loading}
                aria-label="Component description"
                rows={1}
                maxLength={maxChars}
              />

              <div className={`absolute right-3 bottom-2 flex items-center gap-1.5 text-[10px] font-bold transition-colors ${
                charCount > maxChars * 0.9 ? 'text-red-600' : 'text-neutral-400'
              }`}>
                <span className="px-1.5 py-0.5 bg-neutral-100 rounded">{charCount}/{maxChars}</span>
              </div>
            </div>
            
            <button
              onClick={handleGenerateClick}
              disabled={loading || !instruction.trim()}
              className="flex items-center justify-center h-[44px] px-6 bg-gradient-to-br from-primary-600 via-primary-600 to-primary-700 text-white rounded-xl font-black text-sm shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:from-primary-700 hover:to-primary-800 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:grayscale disabled:scale-100 disabled:cursor-not-allowed border border-primary-700/50"
              aria-label="Generate UI components"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="spinner" />
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Wand2 className="w-4 h-4" />
                  <span>Generate</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
