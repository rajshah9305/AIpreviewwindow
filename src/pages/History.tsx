import { useState, useEffect } from 'react'
import { Clock, Trash2, Search, Calendar, ChevronRight } from 'lucide-react'
import { GenerationResult } from '../types'
import { loadHistory, clearHistory } from '../services/api'
import ComponentPreview from '../components/ComponentPreview'
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
      <div className="max-w-4xl mx-auto py-24 animate-fade-in px-4">
        <div className="bg-white rounded-[2.5rem] border border-neutral-100 p-12 md:p-20 text-center shadow-premium relative">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-8">
            <Clock className="w-10 h-10 text-neutral-200" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Archive Empty</h2>
          <p className="text-neutral-400 font-medium mb-10 max-w-sm mx-auto">Your design history is waiting to be written. Start creating your vision today.</p>
          <button
            onClick={() => navigate('/generator')}
            className="px-8 py-3 bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-neutral-900 transition-all active:scale-95"
          >
            Start Creating
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-10 md:space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-100 pb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">History</h2>
        </div>
        <button
          onClick={() => setShowClearDialog(true)}
          className="flex items-center gap-2 px-6 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all text-xs font-semibold border border-transparent hover:border-red-100 w-fit"
        >
          <Trash2 className="w-4 h-4" /> Purge History
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-4 space-y-4 md:space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-orange-500 transition-colors" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-100 rounded-xl text-sm font-normal focus:outline-none focus:border-orange-500/30 focus:ring-4 focus:ring-orange-500/5 transition-all"
            />
          </div>
          
          <div className="space-y-3 max-h-[65vh] overflow-auto pr-2 scrollbar-thin">
            {filtered.map((r) => (
              <button
                key={r.timestamp}
                onClick={() => setSelectedResult(r)}
                className={`w-full p-5 rounded-2xl text-left transition-all duration-500 flex items-center justify-between group ${
                  selectedResult?.timestamp === r.timestamp
                    ? 'bg-black text-white shadow-premium'
                    : 'bg-white border border-neutral-50 hover:border-orange-500/20 text-neutral-600 hover:bg-neutral-50/50'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold truncate tracking-tight ${selectedResult?.timestamp === r.timestamp ? 'text-white' : 'text-black'}`}>
                    {r.instruction}
                  </p>
                  <div className="flex items-center gap-2 mt-2 opacity-50">
                    <Calendar className="w-3 h-3" />
                    <p className="text-[10px] font-semibold uppercase tracking-wider">{new Date(r.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedResult?.timestamp === r.timestamp ? 'text-orange-500 translate-x-1' : 'text-neutral-200 group-hover:translate-x-1'}`} />
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 opacity-30">
                <p className="text-xs font-black uppercase tracking-[0.2em]">No Matches</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-8">
          {selectedResult ? (
              <div className="space-y-8 md:space-y-10 animate-fade-in">
              <div className="p-8 md:p-10 bg-black rounded-3xl text-white relative shadow-premium">
                 <div className="relative z-10">
                  <p className="text-lg md:text-xl font-bold leading-tight tracking-tight">"{selectedResult.instruction}"</p>
                  <div className="flex flex-wrap gap-3 md:gap-4 mt-6 md:mt-8">
                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-[8px] font-semibold uppercase tracking-widest text-neutral-500">Provider</p>
                      <p className="text-[11px] font-bold text-white mt-1">{selectedResult.provider}</p>
                    </div>
                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-[8px] font-semibold uppercase tracking-widest text-neutral-500">Model</p>
                      <p className="text-[11px] font-bold text-white mt-1">{selectedResult.modelName}</p>
                    </div>
                  </div>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {selectedResult.variations.map((v, i) => (
                  <div key={v.id} className="h-[550px] animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                    <ComponentPreview variation={v} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] md:min-h-[500px] flex items-center justify-center border-2 border-dashed border-neutral-100 rounded-3xl p-8 md:p-12 bg-neutral-50/30">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl border border-neutral-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Clock className="w-6 h-6 text-neutral-300" />
                </div>
                <p className="text-neutral-400 text-sm font-semibold uppercase tracking-widest">Select a Concept</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ConfirmDialog
        isOpen={showClearDialog}
        title="Purge Archive?"
        confirmText="Yes, Purge Everything"
        cancelText="Keep My History"
        onConfirm={handleClear}
        onCancel={() => setShowClearDialog(false)}
        variant="danger"
      />
    </div>
  )
}
