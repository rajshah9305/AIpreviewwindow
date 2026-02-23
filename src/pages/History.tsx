import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Trash2, Search, Calendar, ChevronRight } from 'lucide-react'
import { useHistory } from '../hooks/useHistory'
import { useToast } from '../components/ToastContainer'
import { ROUTES, ANIMATION_DELAYS } from '../config/constants'
import ComponentPreview from '../components/ComponentPreview'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import type { GenerationResult } from '../types'

export default function History() {
  const {
    history,
    selectedResult,
    searchQuery,
    isEmpty,
    setSelectedResult,
    setSearchQuery,
    clearHistory,
  } = useHistory()

  const [showClearDialog, setShowClearDialog] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleClear = () => {
    clearHistory()
    toast.success('History cleared')
    setShowClearDialog(false)
  }

  if (isEmpty) {
    return (
      <div className="max-w-4xl mx-auto py-24 animate-fade-in">
        <EmptyState
          icon={Clock}
          title="Archive Empty"
          action={{
            label: 'Launch Generator',
            onClick: () => navigate(ROUTES.GENERATOR),
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10 animate-fade-in pb-12 sm:pb-16">
      <PageHeader onClearClick={() => setShowClearDialog(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
        <div className="lg:col-span-4 space-y-3 sm:space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <HistoryList
            items={history}
            selectedTimestamp={selectedResult?.timestamp}
            onSelect={setSelectedResult}
          />
        </div>

        <div className="lg:col-span-8">
          {selectedResult ? (
            <ResultDetail result={selectedResult} />
          ) : (
            <EmptySelection />
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

interface PageHeaderProps {
  onClearClick: () => void
}

const PageHeader = ({ onClearClick }: PageHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-b border-neutral-100 pb-3 sm:pb-4 md:pb-6">
    <h2 className="heading-section">History</h2>
    <button
      onClick={onClearClick}
      className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-display font-bold border border-transparent hover:border-red-100 touch-manipulation tracking-tight active:scale-95"
    >
      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Purge History
    </button>
  </div>
)

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="relative group">
    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-orange-500 transition-colors" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search concepts..."
      className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-white border-2 border-neutral-900 rounded-lg sm:rounded-xl text-sm font-sans font-medium focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-neutral-400"
      style={{ letterSpacing: '-0.015em' }}
      aria-label="Search history"
    />
  </div>
)

interface HistoryListProps {
  items: GenerationResult[]
  selectedTimestamp?: number
  onSelect: (item: GenerationResult) => void
}

const HistoryList = ({ items, selectedTimestamp, onSelect }: HistoryListProps) => (
  <div className="space-y-2 sm:space-y-2.5 max-h-[50vh] sm:max-h-[65vh] overflow-auto pr-1 scrollbar-thin">
    {items.map((item) => (
      <HistoryItem
        key={item.timestamp}
        item={item}
        isSelected={selectedTimestamp === item.timestamp}
        onSelect={() => onSelect(item)}
      />
    ))}
    {items.length === 0 && (
      <div className="text-center py-10 sm:py-12 opacity-40">
        <p className="text-[10px] sm:text-xs font-display font-bold uppercase tracking-[0.12em] text-neutral-400">No Matches</p>
      </div>
    )}
  </div>
)

interface HistoryItemProps {
  item: { timestamp: number; instruction: string }
  isSelected: boolean
  onSelect: () => void
}

const HistoryItem = ({ item, isSelected, onSelect }: HistoryItemProps) => (
  <button
    onClick={onSelect}
    className={`w-full p-3.5 sm:p-4 rounded-lg sm:rounded-xl text-left transition-all duration-300 flex items-center justify-between group touch-manipulation ${
      isSelected
        ? 'bg-gradient-to-br from-black to-neutral-900 text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]'
        : 'bg-white border border-neutral-200 hover:border-orange-500/30 text-neutral-600 hover:bg-neutral-50 hover:shadow-sm'
    }`}
  >
    <div className="min-w-0 flex-1">
      <p className={`text-sm sm:text-base font-display font-bold truncate tracking-tight ${isSelected ? 'text-white' : 'text-black'}`}>
        {item.instruction}
      </p>
      <div className="flex items-center gap-1.5 mt-1.5 opacity-60">
        <Calendar className="w-3 h-3" />
        <p className="text-[10px] sm:text-[11px] font-display font-bold uppercase tracking-wide">
          {new Date(item.timestamp).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
    <ChevronRight
      className={`w-4 h-4 transition-transform shrink-0 ml-2 ${
        isSelected ? 'text-orange-500 translate-x-1' : 'text-neutral-300 group-hover:translate-x-1 group-hover:text-neutral-400'
      }`}
    />
  </button>
)

interface ResultDetailProps {
  result: {
    instruction: string
    provider?: string
    modelName?: string
    variations: Array<{ id: string; name: string; code: string; style: 'minimal' | 'bold' | 'elegant' | 'playful' | 'modern' }>
  }
}

const ResultDetail = ({ result }: ResultDetailProps) => (
  <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in">
    <div className="p-5 sm:p-7 md:p-9 bg-gradient-to-br from-black to-neutral-900 rounded-xl sm:rounded-2xl md:rounded-3xl text-white relative overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.15)]">
      <div className="absolute top-0 right-0 w-40 sm:w-56 md:w-64 h-40 sm:h-56 md:h-64 bg-orange-500/10 rounded-full blur-[60px] sm:blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="relative z-10">
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-display tracking-tight leading-tight" style={{ fontWeight: 750 }}>
          &ldquo;{result.instruction}&rdquo;
        </p>
        <div className="flex flex-wrap gap-2 sm:gap-2.5 md:gap-3 mt-4 sm:mt-5 md:mt-6">
          {result.provider && (
            <MetadataBadge label="Provider" value={result.provider} />
          )}
          {result.modelName && (
            <MetadataBadge label="Model" value={result.modelName} />
          )}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
      {result.variations.map((variation, i) => (
        <div
          key={variation.id}
          className="h-[400px] sm:h-[450px] md:h-[500px] animate-slide-up"
          style={{ animationDelay: `${i * ANIMATION_DELAYS.STAGGER_BASE}ms` }}
        >
          <ComponentPreview variation={variation} />
        </div>
      ))}
    </div>
  </div>
)

const MetadataBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10">
    <p className="text-[8px] sm:text-[9px] font-display font-bold uppercase tracking-[0.12em] text-neutral-400">
      {label}
    </p>
    <p className="text-[11px] sm:text-xs font-display font-bold text-white mt-0.5 tracking-tight">{value}</p>
  </div>
)

const EmptySelection = () => (
  <div className="h-full min-h-[350px] sm:min-h-[400px] md:min-h-[500px] flex items-center justify-center border-2 border-dashed border-neutral-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 bg-neutral-50/50">
    <div className="text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl border border-neutral-200 flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-sm">
        <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-400" />
      </div>
      <p className="text-neutral-500 text-xs sm:text-sm font-display font-bold uppercase tracking-[0.1em]">
        Select a Concept
      </p>
    </div>
  </div>
)
