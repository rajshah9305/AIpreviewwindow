// src/components/ComponentPreview.tsx
import { useState } from 'react'
import { Code, Eye, Copy, Check, Maximize2, Minimize2, ExternalLink, Download } from 'lucide-react'
import { ComponentVariation } from '../types'

interface ComponentPreviewProps { variation: ComponentVariation }

export default function ComponentPreview({ variation }: ComponentPreviewProps) {
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(variation.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-medium">{variation.name}</div>
          <div className="text-xs text-neutral-500">{variation.style}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCode(v => !v)} aria-label="Toggle code" className="p-2">
            <Code className="w-4 h-4" />
          </button>
          <button onClick={copyCode} aria-label="Copy code" className="p-2">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden mb-3">
        {/* Render preview via srcDoc iframe for safety */}
        <iframe
          title={`${variation.name} preview`}
          srcDoc={variation.code}
          sandbox="allow-scripts allow-modals allow-forms"
          style={{ width: '100%', height: 300, border: 'none' }}
        />
      </div>

      {showCode && (
        <pre className="text-xs bg-neutral-100 p-3 rounded overflow-auto">
          {variation.code}
        </pre>
      )}
    </div>
  )
}
