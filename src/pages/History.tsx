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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
            Generation History
          </h2>
          <p className="text-neutral-600">
            View your previously generated components
          </p>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="btn-secondary flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="card p-12 text-center">
          <Clock className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-700 mb-2">
            No history yet
          </h3>
          <p className="text-neutral-500">
            Generate some components to see them here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {history.map((result) => (
              <div
                key={result.timestamp}
                onClick={() => setSelectedResult(result)}
                className={`card p-4 cursor-pointer transition-all duration-200 ${
                  selectedResult?.timestamp === result.timestamp
                    ? 'ring-2 ring-primary-500 shadow-lg'
                    : 'hover:shadow-lg'
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
                
                <div className="grid grid-cols-1 gap-6">
                  {selectedResult.variations.map((variation) => (
                    <ComponentPreview 
                      key={variation.id} 
                      variation={variation}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <p className="text-neutral-500">
                  Select a generation from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
