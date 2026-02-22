/**
 * History page
 * View and manage generation history
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Trash2, Search, Calendar, ChevronRight } from 'lucide-react'
import { useHistory } from '../hooks/useHistory'
import { useToast } from '../components/ToastContainer'
import { ROUTES, ANIMATION_DELAYS } from '../config/constants'
import ComponentPreview from '../components/ComponentPreview'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'

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
    <div className="space-y-8 sm:space-y-10 md:space-y-12 animate-fade-in pb-16 sm:pb-20">
      <PageHeader onClearClick={() => setShowClearDialog(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-12">
        <div className="lg:col-span-4 space-y-3 sm:space-y-4 md:space-y-6">
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
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 border-b border-neutral-100 pb-6 sm:pb-8">
    <h2 className="heading-section">History</h2>
    <button
      onClick={onClearClick}
      className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all text-[10px] sm:text-xs font-display font-bold border border-transparent hover:border-red-100 touch-manipulation tracking-tight"
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
    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-300 group-focus-within:text-orange-500 transition-colors" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search concepts..."
      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-white border border-neutral-100 rounded-xl text-xs sm:text-sm font-normal focus:outline-none focus:border-orange-500/30 focus:ring-4 focus:ring-orange-500/5 transition-all"
      aria-label="Search history"
    />
  </div>
)

interface HistoryListProps {
  items: Array<{ timestamp: number; instruction: string }>
  selectedTimestamp?: number
  onSelect: (item: any) => void
}

const HistoryList = ({ items, selectedTimestamp, onSelect }: HistoryListProps) => (
  <div className="space-y-2.5 sm:space-y-3 max-h-[55vh] sm:max-h-[65vh] overflow-auto pr-1 sm:pr-2 scrollbar-thin">
    {items.map((item) => (
      <HistoryItem
        key={item.timestamp}
        item={item}
        isSelected={selectedTimestamp === item.timestamp}
        onSelect={() => onSelect(item)}
      />
    ))}
    {items.length === 0 && (
      <div className="text-center py-10 sm:py-12 opacity-30">
        <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">No Matches</p>
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
    className={`w-full p-4 sm:p-5 rounded-xl sm:rounded-2xl text-left transition-all duration-500 flex items-center justify-between group touch-manipulation ${
      isSelected
        ? 'bg-black text-white shadow-premium'
        : 'bg-white border border-neutral-50 hover:border-orange-500/20 text-neutral-600 hover:bg-neutral-50/50'
    }`}
  >
    <div className="min-w-0 flex-1">
<p className={`text-fluid-sm font-display font-semibold truncate tracking-tight ${isSelected ? 'text-white' : 'text-black'}`}>
        {item.instruction}
      </p>
      <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 opacity-50">
        <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        <p className="text-[9px] sm:text-[10px] font-display font-bold uppercase tracking-wider">
          {new Date(item.timestamp).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
    <ChevronRight
      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform shrink-0 ml-2 ${
        isSelected ? 'text-orange-500 translate-x-1' : 'text-neutral-200 group-hover:translate-x-1'
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
  <div className="space-y-6 sm:space-y-8 md:space-y-10 animate-fade-in">
    <div className="p-6 sm:p-8 md:p-10 bg-black rounded-2xl sm:rounded-3xl text-white relative overflow-hidden shadow-premium">
      <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-orange-500/10 rounded-full blur-[60px] sm:blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="relative z-10">
      <p className="text-fluid-xl md:text-fluid-2xl font-display font-bold tracking-tighter leading-tight">
          "{result.instruction}"
        </p>
        <div className="flex flex-wrap gap-2.5 sm:gap-3 md:gap-4 mt-5 sm:mt-6 md:mt-8">
          {result.provider && (
            <MetadataBadge label="Provider" value={result.provider} />
          )}
          {result.modelName && (
            <MetadataBadge label="Model" value={result.modelName} />
          )}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
      {result.variations.map((variation, i) => (
        <div
          key={variation.id}
          className="h-[450px] sm:h-[500px] md:h-[550px] animate-slide-up"
          style={{ animationDelay: `${i * ANIMATION_DELAYS.STAGGER_BASE}ms` }}
        >
          <ComponentPreview variation={variation} />
        </div>
      ))}
    </div>
  </div>
)

const MetadataBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 rounded-lg sm:rounded-xl border border-white/10">
    <p className="text-[7px] sm:text-[8px] font-display font-bold uppercase tracking-widest-xl text-neutral-500">
      {label}
    </p>
    <p className="text-[10px] sm:text-[11px] font-display font-bold text-white mt-0.5 sm:mt-1 tracking-tight">{value}</p>
  </div>
)

const EmptySelection = () => (
  <div className="h-full min-h-[350px] sm:min-h-[400px] md:min-h-[500px] flex items-center justify-center border-2 border-dashed border-neutral-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 bg-neutral-50/30">
    <div className="text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl border border-neutral-100 flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-sm">
        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" />
      </div>
      <p className="text-neutral-400 text-xs sm:text-sm font-display font-bold uppercase tracking-widest">
        Select a Concept
      </p>
    </div>
  </div>
)
