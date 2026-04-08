import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Trash2, Search, X, Wand2, ArrowLeft, Layers, Calendar } from 'lucide-react'
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
  const toast    = useToast()
  const navigate = useNavigate()

  const handleClear = () => {
    clearHistory()
    toast.success('History cleared')
    setShowClearDialog(false)
  }

  if (isEmpty) {
    return (
      <div className="max-w-lg mx-auto py-20 sm:py-28 animate-fade-in">
        <EmptyState
          icon={Clock}
          title="No history yet"
          description="Generated components will appear here. Start by creating your first component."
          action={{ label: 'Start generating', onClick: () => navigate(ROUTES.GENERATOR) }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-24">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-4 pb-5 border-b border-black/[0.07]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-800 tracking-tightest text-neutral-900 leading-none">
            Collection
          </h1>
          <p className="text-sm text-neutral-400 mt-1.5 font-accent">
            {filteredHistory.length} generation{filteredHistory.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <button
          onClick={() => setShowClearDialog(true)}
          className="btn-ghost text-red-500 hover:text-red-600 hover:bg-red-50 self-start sm:self-auto text-[11px] uppercase tracking-widest"
          aria-label="Clear all history"
        >
          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
          Clear all
        </button>
      </div>

      {/* Search */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Content */}
      {isSearchEmpty ? (
        <div className="flex items-center justify-center min-h-[280px] rounded-2xl border border-dashed border-black/[0.09] bg-white/40 animate-fade-in">
          <div className="text-center p-10">
            <div className="w-11 h-11 bg-white rounded-xl border border-black/[0.07] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Search className="w-4.5 h-4.5 text-neutral-300" aria-hidden="true" />
            </div>
            <p className="text-neutral-400 text-xs font-display font-700 uppercase tracking-widest">
              No matches for &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        </div>
      ) : selectedResult ? (
        <div className="animate-fade-in">
          <button
            onClick={() => setSelectedResult(null)}
            className="flex items-center gap-2 mb-6 px-4 py-2 bg-neutral-900 text-white rounded-full text-[11px] font-display font-700 uppercase tracking-widest hover:bg-black transition-colors shadow-xs active:scale-95"
            aria-label="Back to collection"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Back
          </button>
          <ResultDetail result={selectedResult} />
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          role="list"
          aria-label="Generation history"
        >
          {filteredHistory.map((item, i) => (
            <HistoryCard
              key={item.timestamp}
              item={item}
              index={i}
              onClick={() => setSelectedResult(item)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={showClearDialog}
        title="Clear all history?"
        description="This permanently removes all saved generations and cannot be undone."
        confirmText="Clear History"
        cancelText="Cancel"
        onConfirm={handleClear}
        onCancel={() => setShowClearDialog(false)}
        variant="danger"
      />
    </div>
  )
}

/* ─── History card ──────────────────────────────────────────────────────────── */
const HistoryCard = ({
  item, index, onClick,
}: {
  item: GenerationResult
  index: number
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    role="listitem"
    className="text-left p-5 rounded-[1.125rem] bg-white border border-black/[0.07] hover:border-black/[0.12] card-hover animate-scale-in relative group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40"
    style={{ animationDelay: `${index * 40}ms` }}
    aria-label={`View generation: ${item.instruction}`}
  >
    {/* Hover accent */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[1.125rem]"
      style={{ background: 'radial-gradient(ellipse at top right, rgba(249,115,22,0.04) 0%, transparent 70%)' }}
      aria-hidden="true"
    />

    <div className="relative z-10">
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-xl bg-neutral-50 group-hover:bg-orange-50 flex items-center justify-center transition-colors duration-200 shrink-0 border border-black/[0.05]">
          <Wand2 className="w-3.5 h-3.5 text-neutral-300 group-hover:text-orange-400 transition-colors duration-200" aria-hidden="true" />
        </div>
        <time
          dateTime={new Date(item.timestamp).toISOString()}
          className="flex items-center gap-1 text-[10px] font-display font-600 text-neutral-350 tabular-nums"
        >
          <Calendar className="w-2.5 h-2.5 text-neutral-300" aria-hidden="true" />
          {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </time>
      </div>

      <p className="text-sm font-display font-600 leading-snug line-clamp-2 mb-3 tracking-tight text-neutral-800 group-hover:text-neutral-900 transition-colors">
        &ldquo;{item.instruction}&rdquo;
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-neutral-300" aria-hidden="true" />
          <span className="text-[10px] font-display font-600 text-neutral-400 uppercase tracking-wider">
            {item.variations.length} variations
          </span>
        </div>
        {item.provider && (
          <span className="text-[9px] font-accent font-500 text-neutral-300 uppercase tracking-wider">
            {item.provider}
          </span>
        )}
      </div>
    </div>
  </button>
)

/* ─── Search bar ────────────────────────────────────────────────────────────── */
const SearchBar = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div className="relative group">
    <Search
      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-neutral-500 transition-colors duration-200 pointer-events-none"
      aria-hidden="true"
    />
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search generations…"
      className="w-full pl-11 pr-10 py-3 bg-white border border-black/[0.07] rounded-xl text-sm font-accent font-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400/50 transition-all placeholder:text-neutral-300 min-h-[44px] hover:border-black/[0.12]"
      style={{ fontSize: 'max(16px, 1rem)', letterSpacing: '-0.01em' }}
      aria-label="Search history"
      type="search"
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-neutral-300 hover:text-neutral-600 transition-colors touch-manipulation rounded-lg hover:bg-neutral-100"
        aria-label="Clear search"
      >
        <X className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    )}
  </div>
)

/* ─── Result detail ─────────────────────────────────────────────────────────── */
interface ResultDetailProps {
  result: {
    instruction: string
    provider?: string
    modelName?: string
    timestamp?: number
    variations: Array<{ id: string; name: string; code: string; style: 'minimal'|'bold'|'elegant'|'playful'|'modern' }>
  }
}

const ResultDetail = ({ result }: ResultDetailProps) => (
  <div className="space-y-5 animate-fade-in">
    {/* Instruction card */}
    <div className="p-6 sm:p-8 bg-neutral-900 rounded-2xl text-white relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
        aria-hidden="true"
      />
      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Wand2 className="w-4 h-4 text-orange-400" aria-hidden="true" />
          </div>
          <blockquote className="text-xl sm:text-2xl font-display font-700 tracking-tight leading-snug">
            &ldquo;{result.instruction}&rdquo;
          </blockquote>
        </div>
        <div className="flex flex-wrap gap-2" role="list" aria-label="Generation metadata">
          {result.timestamp && (
            <MetaBadge label="Date" value={new Date(result.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} />
          )}
          {result.provider  && <MetaBadge label="Provider"   value={result.provider} />}
          {result.modelName && <MetaBadge label="Model"      value={result.modelName} />}
          <MetaBadge label="Variations" value={String(result.variations.length)} />
        </div>
      </div>
    </div>

    {/* Variations grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {result.variations.map((variation, i) => (
        <div
          key={variation.id}
          className="h-[340px] sm:h-[380px] md:h-[420px] animate-slide-up"
          style={{ animationDelay: `${i * ANIMATION_DELAYS.STAGGER_BASE}ms` }}
        >
          <ComponentPreview variation={variation} />
        </div>
      ))}
    </div>
  </div>
)

const MetaBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="px-3 py-1.5 bg-white/[0.07] rounded-lg border border-white/[0.09]" role="listitem">
    <p className="text-[8px] font-display font-700 uppercase tracking-widest text-neutral-500 leading-none">{label}</p>
    <p className="text-[11px] font-display font-600 text-white mt-0.5 tracking-tight leading-none">{value}</p>
  </div>
)
