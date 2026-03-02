import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Trash2, Search, Calendar, ChevronRight, Layers, X, Wand2 } from 'lucide-react'
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
  const [view, setView] = useState<'split' | 'list'>('split')
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
    <div className="max-w-5xl mx-auto space-y-5 sm:space-y-7 md:space-y-9 animate-fade-in pb-16 sm:pb-12">
      <PageHeader
        count={filteredHistory.length}
        view={view}
        onViewChange={setView}
        onClearClick={() => setShowClearDialog(true)}
      />

      {/* Search bar */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {isSearchEmpty ? (
        <div className="h-full min-h-[350px] sm:min-h-[400px] flex items-center justify-center border border-dashed border-neutral-200/60 rounded-2xl p-8 bg-neutral-50/30 animate-fade-in">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl border border-neutral-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" />
            </div>
            <p className="text-neutral-400 text-[10px] sm:text-xs font-display font-bold uppercase tracking-[0.08em]">
              No matches found for &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        </div>
      ) : view === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 sm:gap-6">
          {/* History list */}
          <div className="space-y-2">
            <p className="text-[10px] font-display font-bold uppercase tracking-widest text-neutral-400 px-1">
              {filteredHistory.length} generation{filteredHistory.length !== 1 ? 's' : ''}
            </p>
            <HistoryList
              items={filteredHistory}
              selectedTimestamp={selectedResult?.timestamp}
              onSelect={setSelectedResult}
            />
          </div>

          {/* Detail panel */}
          <div className="min-w-0">
            {selectedResult ? (
              <ResultDetail result={selectedResult} />
            ) : (
              <EmptySelection />
            )}
          </div>
        </div>
      ) : (
        /* Full list view */
        <div className="space-y-6">
          {filteredHistory.map((item, i) => (
            <div key={item.timestamp} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
              <ResultDetail result={item} />
            </div>
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

interface PageHeaderProps {
  count: number
  view: 'split' | 'list'
  onViewChange: (v: 'split' | 'list') => void
  onClearClick: () => void
}

const PageHeader = ({ count, view, onViewChange, onClearClick }: PageHeaderProps) => (
  <div className="flex flex-col items-center justify-center text-center gap-3 sm:gap-4 border-b-2 border-black pb-8 sm:pb-10">
    <div>
      <h2 className="heading-section text-neutral-900">History</h2>
      <p className="text-sm sm:text-sm text-neutral-400 mt-1.5 font-accent" style={{ fontWeight: 300 }}>
        {count} generation{count !== 1 ? 's' : ''} saved
      </p>
    </div>
    <div className="flex items-center gap-2">
      {/* View toggle */}
      <div className="flex items-center gap-0.5 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
        <button
          onClick={() => onViewChange('split')}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-display font-bold uppercase tracking-wider transition-all ${
            view === 'split' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Split
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-display font-bold uppercase tracking-wider transition-all ${
            view === 'list' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          All
        </button>
      </div>

      <button
        onClick={onClearClick}
        className="flex items-center justify-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all text-xs font-display border border-transparent hover:border-red-100 touch-manipulation tracking-tight active:scale-95"
        style={{ fontWeight: 500 }}
      >
        <Trash2 className="w-3.5 h-3.5" /> Clear All
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

interface HistoryListProps {
  items: GenerationResult[]
  selectedTimestamp?: number
  onSelect: (item: GenerationResult) => void
}

const HistoryList = ({ items, selectedTimestamp, onSelect }: HistoryListProps) => (
  <div className="flex flex-col gap-2 max-h-[60vh] overflow-auto pr-1 scrollbar-thin">
    {items.map((item, i) => (
      <HistoryItem
        key={item.timestamp}
        item={item}
        isSelected={selectedTimestamp === item.timestamp}
        onSelect={() => onSelect(item)}
        index={i}
      />
    ))}
    {items.length === 0 && (
      <div className="text-center py-12 opacity-40">
        <p className="text-[10px] sm:text-xs font-display font-bold uppercase tracking-[0.1em] text-neutral-400">No matches found</p>
      </div>
    )}
  </div>
)

interface HistoryItemProps {
  item: { timestamp: number; instruction: string; variations: Array<{ style: string }> }
  isSelected: boolean
  onSelect: () => void
  index: number
}

const HistoryItem = ({ item, isSelected, onSelect, index }: HistoryItemProps) => (
  <button
    onClick={onSelect}
    className={`w-full p-4 sm:p-3.5 rounded-xl text-left transition-all duration-300 flex items-center justify-between group touch-manipulation animate-slide-up min-h-[72px] ${
      isSelected
        ? 'bg-neutral-900 text-white shadow-lg shadow-black/10'
        : 'bg-white border-2 border-black hover:bg-neutral-50 text-neutral-600 hover:shadow-sm'
    }`}
    style={{ animationDelay: `${index * 30}ms` }}
  >
    <div className="min-w-0 flex-1">
      <p className={`text-sm font-display font-bold truncate tracking-tight ${isSelected ? 'text-white' : 'text-neutral-800'}`}>
        {item.instruction}
      </p>
      <div className="flex items-center gap-3 mt-1.5">
        <div className={`flex items-center gap-1.5 ${isSelected ? 'opacity-60' : 'opacity-50'}`}>
          <Calendar className="w-3 h-3" />
          <p className="text-[10px] font-display font-semibold tracking-wide">
            {new Date(item.timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 ${isSelected ? 'opacity-60' : 'opacity-50'}`}>
          <Layers className="w-3 h-3" />
          <p className="text-[10px] font-display font-semibold tracking-wide">
            {item.variations?.length || 0} variations
          </p>
        </div>
      </div>
    </div>
    <ChevronRight
      className={`w-4 h-4 transition-all shrink-0 ml-3 ${
        isSelected ? 'text-orange-400 translate-x-0.5' : 'text-neutral-200 group-hover:translate-x-0.5 group-hover:text-neutral-400'
      }`}
    />
  </button>
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
  <div className="space-y-4 sm:space-y-5 animate-fade-in">
    {/* Instruction card */}
    <div className="p-5 sm:p-6 bg-neutral-900 rounded-2xl text-white relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
      <div className="absolute top-0 right-0 w-40 sm:w-56 h-40 sm:h-56 bg-orange-500/8 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Wand2 className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-base sm:text-lg font-display tracking-tight leading-snug" style={{ fontWeight: 700 }}>
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

const EmptySelection = () => (
  <div className="h-full min-h-[350px] sm:min-h-[400px] flex items-center justify-center border border-dashed border-neutral-200/60 rounded-2xl p-8 bg-neutral-50/30">
    <div className="text-center">
      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl border border-neutral-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" />
      </div>
      <p className="text-neutral-400 text-[10px] sm:text-xs font-display font-bold uppercase tracking-[0.08em]">
        Select a generation to preview
      </p>
    </div>
  </div>
)
