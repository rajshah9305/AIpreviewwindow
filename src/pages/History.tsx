import { useState, useEffect } from 'react'
import { Clock, Trash2, Search, Filter } from 'lucide-react'
import { GenerationResult } from '../types'
import { loadHistory, clearHistory } from '../services/api'
import ComponentPreview from '../components/ComponentPreview'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../components/ToastContainer'
import { useNavigate } from 'react-router-dom'

export default function History() {
  const [history, setHistory] = useState<GenerationResult[]>([])
  const [selectedResult, setSelectedResult] = useState<GenerationResult | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showClearDialog, setShowClearDialog] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()
  
  useEffect(() => {
    const loadedHistory = loadHistory()
    setHistory(loadedHistory)
    if (loadedHistory.length > 0) {
      setSelectedResult(loadedHistory[0])
    }
  }, [])
  
  const handleClearHistory = () => {
    clearHistory()
    setHistory([])
    setSelectedResult(null)
    toast.success('History cleared successfully')
  }
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
  
  const filteredHistory = history.filter((result) =>
    result.instruction.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  if (history.length === 0) {
    return (
      <div className="pb-12 animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-display font-black text-neutral-900 mb-2 tracking-tight">
            Generation History
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 font-medium">
            Your component generation history will appear here
          </p>
        </div>
        
        <EmptyState
          icon={Clock}
          title="No History Yet"
          description="Start generating components to build your history. All your creations will be automatically saved here for easy access."
          action={{
            label: 'Create Your First Component',
            onClick: () => navigate('/generator'),
          }}
        />
      </div>
    )
  }
  
  return (
    <div className="pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-neutral-900 mb-2 tracking-tight">
            Generation History
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 font-medium">
            {history.length} {history.length === 1 ? 'generation' : 'generations'} saved
          </p>
        </div>
        
        <button
          onClick={() => setShowClearDialog(true)}
          className="flex items-center self-start sm:self-auto space-x-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all duration-300 active:scale-95 shadow-sm border border-red-100 text-sm sm:text-base"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* History List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-300 bg-white text-sm"
            />
          </div>
          
          {/* Results count */}
          {searchQuery && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 px-2">
              <Filter className="w-3.5 h-3.5" />
              <span>
                {filteredHistory.length} {filteredHistory.length === 1 ? 'result' : 'results'} found
              </span>
            </div>
          )}
          
          {/* History items */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:max-h-[calc(100vh-24rem)] pb-4 lg:pb-0 lg:pr-2 scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12 text-neutral-400 text-sm">
                No results found for "{searchQuery}"
              </div>
            ) : (
              filteredHistory.map((result) => (
                <button
                  key={result.timestamp}
                  onClick={() => setSelectedResult(result)}
                  className={`group p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border transition-all duration-300 flex-shrink-0 w-[280px] lg:w-full text-left ${
                    selectedResult?.timestamp === result.timestamp
                      ? 'bg-gradient-to-br from-primary-50 to-orange-50 border-primary-400 shadow-lg ring-4 ring-primary-500/10'
                      : 'bg-white border-neutral-200/60 hover:border-primary-300 hover:shadow-xl'
                  }`}
                >
                  <p className="font-bold text-neutral-900 mb-3 line-clamp-2 text-sm sm:text-base leading-snug">
                    {result.instruction}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[11px] sm:text-xs text-neutral-500 font-medium">
                      <Clock className="w-3 h-3 mr-1.5" />
                      {formatDate(result.timestamp)}
                    </div>
                    {result.variations && (
                      <div className="badge badge-primary text-[10px]">
                        {result.variations.length} variants
                      </div>
                    )}
                  </div>
                  {result.modelName && (
                    <div className="mt-3 pt-3 border-t border-neutral-200/50">
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                        <span className="font-mono">{result.modelName}</span>
                      </div>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
        
        {/* Preview Area */}
        <div className="lg:col-span-2">
          {selectedResult ? (
            <div className="space-y-6 sm:space-y-8 animate-fade-in">
              {/* Instruction Card */}
              <div className="bg-gradient-to-br from-white to-neutral-50 border border-neutral-200/60 rounded-[2rem] p-6 sm:p-8 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h3 className="font-bold text-neutral-900 uppercase tracking-widest text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                    Original Instruction
                  </h3>
                  {selectedResult.modelName && selectedResult.provider && (
                    <div className="flex items-center self-start sm:self-auto space-x-2 px-4 py-2 bg-white rounded-xl border border-neutral-200 shadow-sm">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{selectedResult.provider}</span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-[10px] font-mono text-neutral-700">{selectedResult.modelName}</span>
                    </div>
                  )}
                </div>
                <p className="text-neutral-700 text-sm sm:text-base leading-relaxed font-medium">
                  "{selectedResult.instruction}"
                </p>
                <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center gap-2 text-xs text-neutral-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Generated {formatDate(selectedResult.timestamp)}</span>
                </div>
              </div>
              
              {/* Variations Grid */}
              <div>
                <h3 className="font-bold text-neutral-900 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-500" />
                  Generated Variations ({selectedResult.variations.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedResult.variations.map((variation) => (
                    <div key={variation.id} className="flex flex-col h-[500px] sm:h-[600px]">
                      <ComponentPreview variation={variation} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-100/50 border-2 border-dashed border-neutral-200 rounded-[2rem] p-12 sm:p-24 text-center h-full flex items-center justify-center">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 bg-neutral-200 rounded-2xl flex items-center justify-center">
                  <Clock className="w-8 h-8 text-neutral-400" />
                </div>
                <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                  Select a generation to preview
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Clear History Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearDialog}
        title="Clear All History?"
        message="This will permanently delete all your generation history. This action cannot be undone."
        confirmText="Clear History"
        cancelText="Keep History"
        onConfirm={handleClearHistory}
        onCancel={() => setShowClearDialog(false)}
        variant="danger"
      />
    </div>
  )
}
