import { useState, useEffect } from 'react'
import { Clock, Trash2 } from 'lucide-react'
import { GenerationResult } from '../types'
import { loadHistory } from '../services/api'
import ComponentPreview from '../components/ComponentPreview'

export default function History() {
  const [history, setHistory] = useState<GenerationResult[]>([])
  const [selectedResult, setSelectedResult] = useState<GenerationResult | null>(null)
  
  useEffect(() => {
    setHistory(loadHistory())
  }, [])
  
  const clearHistory = () => {
    localStorage.removeItem('generationHistory')
    setHistory([])
    setSelectedResult(null)
  }
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }
  
  return (
    <div className="pb-12 animate-fade-in">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-neutral-900 mb-2 tracking-tight">
            Generation History
          </h2>
          <p className="text-base text-neutral-500 font-medium">
            Retrieve and reuse your previous design masterpieces
          </p>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center space-x-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all active:scale-95 shadow-sm border-2 border-red-100"
          >
            <Trash2 className="w-4 h-4" />
            <span>Wipe History</span>
          </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="bg-white border-2 border-neutral-100 rounded-[32px] p-20 text-center shadow-xl shadow-neutral-200/20">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl flex items-center justify-center shadow-inner">
            <Clock className="w-12 h-12 text-primary-300" />
          </div>
          <h3 className="text-2xl font-display font-bold text-neutral-800 mb-3">
            Your vault is empty
          </h3>
          <p className="text-neutral-500 max-w-sm mx-auto font-medium">
            Once you start generating components, they'll be automatically saved here for eternity.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4 overflow-y-auto max-h-[calc(100vh-20rem)] pr-4 scrollbar-thin scrollbar-thumb-neutral-200">
            {history.map((result) => (
              <div
                key={result.timestamp}
                onClick={() => setSelectedResult(result)}
                className={`group p-5 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
                  selectedResult?.timestamp === result.timestamp
                    ? 'bg-primary-50 border-primary-500 shadow-md ring-4 ring-primary-100'
                    : 'bg-white border-neutral-100 hover:border-neutral-200 hover:shadow-lg'
                }`}
              >
                <p className="font-medium text-neutral-900 mb-2 line-clamp-2">
                  {result.instruction}
                </p>
                <div className="flex items-center text-sm text-neutral-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(result.timestamp)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-2">
            {selectedResult ? (
              <div className="space-y-6">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-neutral-900">Instruction</h3>
                    {selectedResult.modelName && selectedResult.provider && (
                      <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-50 rounded-lg border border-neutral-200">
                        <span className="text-xs font-medium text-neutral-500">{selectedResult.provider}</span>
                        <span className="text-xs text-neutral-400">•</span>
                        <span className="text-xs font-medium text-neutral-700">{selectedResult.modelName}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-neutral-700">{selectedResult.instruction}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedResult.variations.map((variation) => (
                    <div key={variation.id} className="flex flex-col h-[600px]">
                      <ComponentPreview 
                        variation={variation}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-[32px] p-24 text-center">
                <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">
                  Select a record from the history to preview
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
