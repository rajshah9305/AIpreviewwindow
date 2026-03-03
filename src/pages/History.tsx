import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Trash2, Search, Calendar, ChevronRight, Layers, X, Wand2, ArrowLeft } from 'lucide-react'
import { useHistory } from '../hooks/useHistory'
import { useToast } from '../components/ToastContainer'
import { ROUTES, ANIMATION_DELAYS } from '../config/constants'
import ComponentPreview from '../components/ComponentPreview'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import type { GenerationResult } from '../types'

export default function History() {
  const {
    history: filteredHistory,
    selectedResult,
    searchQuery,
    isEmpty,
    setSelectedResult,
    setSearchQuery,
    clearHistory,
  } = useHistory()

  const [showClearDialog, setShowClearDialog] = useState(false)
  const isSearchEmpty = !isEmpty && filteredHistory.length === 0
  const toast = useToast()
  const navigate = useNavigate()

  const handleClear = () => {
    clearHistory()
    toast.success('History cleared')
    setShowClearDialog(false)
  }

  if (isEmpty) {
    return (
      <div className="max-w-4xl mx-auto py-16 sm:py-24 animate-fade-in">
        <EmptyState
          icon={Clock}
          title="No History Yet"
          description="Generated components will appear here. Start by creating your first component!"
          action={{
            label: 'Start Generating',
            onClick: () => navigate(ROUTES.GENERATOR),
          }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-24">
      <PageHeader
        count={filteredHistory.length}
        onClearClick={() => setShowClearDialog(true)}
      />

      {/* Search bar */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {isSearchEmpty ? (
        <div className="h-full min-h-[350px] flex items-center justify-center border-2 border-dashed border-black/5 rounded-[3rem] p-12 bg-white/30 backdrop-blur-sm animate-fade-in">
          <div className="text-center">
            <div className="w-14 h-14 bg-white rounded-3xl border border-black/5 flex items-center justify-center mx-auto mb-6 shadow-glass">
              <Search className="w-6 h-6 text-neutral-200" />
            </div>
            <p className="text-neutral-400 text-[11px] font-display font-bold uppercase tracking-widest">
              No matches found for &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        </div>
      ) : selectedResult ? (
        <div className="animate-fade-in">
          <button
            onClick={() => setSelectedResult(null)}
            className="flex items-center gap-2 mb-8 px-5 py-2.5 bg-black text-white rounded-full text-xs font-display font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collection</span>
          </button>
          <ResultDetail result={selectedResult} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHistory.map((item, i) => (
            <button
              key={item.timestamp}
              onClick={() => setSelectedResult(item)}
              className="text-left p-6 rounded-[2.5rem] bg-white border border-black/5 hover:border-black/10 hover:shadow-glass transition-all duration-500 animate-scale-in relative group overflow-hidden"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="p-2.5 rounded-2xl bg-neutral-50 group-hover:bg-orange-50 transition-colors">
                    <Wand2 className="w-4 h-4 text-neutral-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <span className="text-[10px] font-display font-bold uppercase tracking-widest text-neutral-400">
                    {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-base font-display font-700 leading-tight line-clamp-2 mb-4 tracking-tight group-hover:text-orange-500 transition-colors">
                  &ldquo;{item.instruction}&rdquo;
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-display font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-neutral-50 text-neutral-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    {item.variations.length} variations
                  </span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={showClearDialog}
        title="Clear all history?"
        description="This will permanently remove all saved generations. This action cannot be undone."
        confirmText="Clear History"
        cancelText="Cancel"
        onConfirm={handleClear}
        onCancel={() => setShowClearDialog(false)}
        variant="danger"
      />
    </div>
  )
}

const PageHeader = ({ count, onClearClick }: { count: number; onClearClick: () => void }) => (
  <div className="flex flex-col items-center justify-center text-center gap-4 border-b-2 border-black/5 pb-10 sm:pb-12">
    <div>
      <h2 className="text-4xl sm:text-5xl font-display font-800 tracking-tightest text-neutral-900">Collection</h2>
      <p className="text-sm text-neutral-400 mt-2 font-accent font-400 tracking-snug">
        {count} generation{count !== 1 ? 's' : ''} curated by you
      </p>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onClearClick}
        className="flex items-center justify-center gap-2.5 px-5 py-2.5 text-red-500 hover:bg-red-50 rounded-full transition-all text-[11px] font-display font-bold uppercase tracking-widest border border-transparent hover:border-red-100 touch-manipulation active:scale-95"
      >
        <Trash2 className="w-4 h-4" /> Clear All
      </button>
    </div>
  </div>
)

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="relative group">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-black transition-colors duration-300" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search generations..."
      className="w-full pl-11 pr-11 py-3.5 bg-white border-2 border-black rounded-xl text-base font-sans font-medium focus:outline-none focus:border-black focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-neutral-300 min-h-[48px]"
      style={{ letterSpacing: '-0.015em', fontSize: 'max(16px, 1rem)' }}
      aria-label="Search history"
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-300 hover:text-neutral-500 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Clear search"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
)


interface ResultDetailProps {
  result: {
    instruction: string
    provider?: string
    modelName?: string
    timestamp?: number
    variations: Array<{ id: string; name: string; code: string; style: 'minimal' | 'bold' | 'elegant' | 'playful' | 'modern' }>
  }
}

const ResultDetail = ({ result }: ResultDetailProps) => (
  <div className="space-y-6 sm:space-y-8 animate-fade-in">
    {/* Instruction card */}
    <div className="p-8 sm:p-10 bg-black rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center shrink-0 mt-1">
            <Wand2 className="w-6 h-6 text-orange-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-display font-800 tracking-tightest leading-[1.1]">
            &ldquo;{result.instruction}&rdquo;
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.timestamp && (
            <MetadataBadge label="Date" value={new Date(result.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} />
          )}
          {result.provider && (
            <MetadataBadge label="Provider" value={result.provider} />
          )}
          {result.modelName && (
            <MetadataBadge label="Model" value={result.modelName} />
          )}
          <MetadataBadge label="Variations" value={String(result.variations.length)} />
        </div>
      </div>
    </div>

    {/* Variations grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {result.variations.map((variation, i) => (
        <div
          key={variation.id}
          className="h-[360px] sm:h-[400px] md:h-[440px] animate-slide-up"
          style={{ animationDelay: `${i * ANIMATION_DELAYS.STAGGER_BASE}ms` }}
        >
          <ComponentPreview variation={variation} />
        </div>
      ))}
    </div>
  </div>
)

const MetadataBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
    <p className="text-[8px] font-display font-bold uppercase tracking-[0.1em] text-neutral-500 leading-none">
      {label}
    </p>
    <p className="text-[11px] font-display font-bold text-white mt-0.5 tracking-tight leading-none">{value}</p>
  </div>
)
