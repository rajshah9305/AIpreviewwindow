import { useState, useEffect } from 'react'
import { Clock, Trash2, Search } from 'lucide-react'
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
    const loaded = loadHistory()
    setHistory(loaded)
    if (loaded.length > 0) setSelectedResult(loaded[0])
  }, [])
  
  const handleClear = () => {
    clearHistory()
    setHistory([])
    setSelectedResult(null)
    toast.success('History cleared')
    setShowClearDialog(false)
  }
  
  const filtered = history.filter(r =>
    r.instruction.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 animate-fade-in">
        <EmptyState
          icon={Clock}
          title="No history"
          description="Your generations will appear here."
          action={{ label: 'Start generating', onClick: () => navigate('/generator') }}
        />
      </div>
    )
  }
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">History</h2>
          <p className="text-neutral-500">{history.length} components saved</p>
        </div>
        <button
          onClick={() => setShowClearDialog(true)}
          className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" /> Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-100 rounded-xl text-sm focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>
          
          <div className="space-y-2 max-h-[600px] overflow-auto pr-2 scrollbar-thin">
            {filtered.map((r) => (
              <button
                key={r.timestamp}
                onClick={() => setSelectedResult(r)}
                className={`w-full p-4 rounded-2xl text-left transition-all ${
                  selectedResult?.timestamp === r.timestamp
                    ? 'bg-neutral-900 text-white shadow-lg'
                    : 'bg-white border border-neutral-100 hover:border-neutral-900 text-neutral-600'
                }`}
              >
                <p className="text-xs font-bold truncate mb-1">{r.instruction}</p>
                <p className="text-[10px] opacity-60">{new Date(r.timestamp).toLocaleDateString()}</p>
              </button>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-3">
          {selectedResult ? (
            <div className="space-y-8">
              <div className="p-6 bg-white border border-neutral-100 rounded-3xl">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Prompt</p>
                <p className="text-sm font-medium text-neutral-900">"{selectedResult.instruction}"</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedResult.variations.map((v) => (
                  <div key={v.id} className="h-[500px]">
                    <ComponentPreview variation={v} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-neutral-100 rounded-3xl p-12">
              <p className="text-neutral-400 text-sm font-medium">Select a generation to preview</p>
            </div>
          )}
        </div>
      </div>
      
      <ConfirmDialog
        isOpen={showClearDialog}
        title="Clear history?"
        message="This cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        onConfirm={handleClear}
        onCancel={() => setShowClearDialog(false)}
        variant="danger"
      />
    </div>
  )
}
