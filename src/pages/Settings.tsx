import React, { useState, useCallback } from 'react'
import { Save, Key, Server, Tag, Eye, EyeOff, CheckCircle, Zap, ChevronDown, ChevronUp, Shield, Info } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { useToast } from '../components/ToastContainer'

interface ProviderPreset {
  name: string
  baseUrl: string
  modelPlaceholder: string
  models: string[]
  icon: string
  description: string
}

const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    modelPlaceholder: 'gpt-4o',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    icon: '⚡',
    description: 'GPT-4o and family',
  },
  {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com',
    modelPlaceholder: 'claude-3-5-sonnet-20241022',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
    icon: '🔮',
    description: 'Claude 3.5 and family',
  },
  {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    modelPlaceholder: 'llama-3.3-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    icon: '🚀',
    description: 'Ultra-fast inference',
  },
  {
    name: 'Together',
    baseUrl: 'https://api.together.xyz/v1',
    modelPlaceholder: 'meta-llama/Llama-3-70b-chat-hf',
    models: ['meta-llama/Llama-3-70b-chat-hf', 'mistralai/Mixtral-8x7B-Instruct-v0.1'],
    icon: '🤝',
    description: 'Open-source models',
  },
  {
    name: 'Custom',
    baseUrl: '',
    modelPlaceholder: 'your-model-name',
    models: [],
    icon: '⚙️',
    description: 'Any OpenAI-compatible API',
  },
]

export default function Settings() {
  const { settings, errors, isModified, isSaved, updateField, save } = useSettings()
  const toast = useToast()

  const [showApiKey,     setShowApiKey]     = useState(false)
  const [testing,        setTesting]        = useState(false)
  const [testResult,     setTestResult]     = useState<'success' | 'error' | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [showModels,     setShowModels]     = useState(false)

  const handleSave = () => {
    if (save()) toast.success('Settings saved successfully')
  }

  const handlePresetSelect = useCallback((preset: ProviderPreset) => {
    setSelectedPreset(preset.name)
    if (preset.name !== 'Custom') {
      updateField('baseUrl', preset.baseUrl)
      if (!settings.modelName) updateField('modelName', preset.modelPlaceholder)
      toast.info(`${preset.name} configured`)
    }
  }, [updateField, settings.modelName, toast])

  const handleModelSelect = useCallback((model: string) => {
    updateField('modelName', model)
    setShowModels(false)
  }, [updateField])

  const handleTestConnection = useCallback(async () => {
    if (!settings.baseUrl) { toast.warning('Enter a provider endpoint first'); return }
    setTesting(true)
    setTestResult(null)
    try {
      const res  = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseUrl: settings.baseUrl, apiKey: settings.apiKey }),
      })
      const data = await res.json()
      if (res.ok && data.reachable) {
        setTestResult('success')
        toast.success(`Connected! ${selectedPreset ? `${selectedPreset} ` : ''}endpoint is reachable.`)
      } else {
        setTestResult('error')
        toast.error(data.message || `Server responded with ${data.statusCode || 'an error'}`)
      }
    } catch (err) {
      setTestResult('error')
      toast.error(err instanceof Error ? err.message : 'Connection failed')
    } finally {
      setTesting(false)
      setTimeout(() => setTestResult(null), 3000)
    }
  }, [settings, toast, selectedPreset])

  const currentPreset   = PROVIDER_PRESETS.find(p => p.name === selectedPreset)
  const suggestedModels = currentPreset?.models ?? []

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in pb-16 w-full pt-4">

      {/* Page header */}
      <div className="pb-5 border-b border-black/[0.07]">
        <h1 className="text-3xl sm:text-4xl font-display font-800 tracking-tightest text-neutral-900 leading-none">
          Preferences
        </h1>
        <p className="text-sm text-neutral-400 mt-1.5 font-accent">
          Configure your AI engine and connection
        </p>
      </div>

      {/* Provider presets */}
      <section aria-labelledby="presets-heading" className="bg-white rounded-2xl border border-black/[0.07] p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <h2 id="presets-heading" className="section-label">
            Quick Setup
          </h2>
          <span className="badge-orange">Presets</span>
        </div>
        <div className="grid grid-cols-5 gap-2" role="list">
          {PROVIDER_PRESETS.map(preset => {
            const active = selectedPreset === preset.name
            return (
              <button
                key={preset.name}
                role="listitem"
                onClick={() => handlePresetSelect(preset)}
                aria-pressed={active}
                title={preset.description}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 text-center touch-manipulation active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 ${
                  active
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-black/[0.07] bg-neutral-50/60 text-neutral-600 hover:border-black/[0.12] hover:bg-white'
                }`}
              >
                <span className="text-base leading-none" aria-hidden="true">{preset.icon}</span>
                <span className={`text-[9px] font-display font-700 uppercase tracking-wider leading-none ${
                  active ? 'text-white' : 'text-neutral-500'
                }`}>{preset.name}</span>
              </button>
            )
          })}
        </div>
        {selectedPreset && currentPreset && (
          <p className="mt-3 text-[11px] text-neutral-400 font-accent animate-slide-down">
            {currentPreset.description}
            {currentPreset.baseUrl && (
              <span className="ml-1 font-mono text-neutral-300">{currentPreset.baseUrl}</span>
            )}
          </p>
        )}
      </section>

      {/* Main form */}
      <section aria-labelledby="config-heading" className="bg-white rounded-2xl border border-black/[0.07] p-5 sm:p-6 space-y-5 shadow-card">
        <h2 id="config-heading" className="sr-only">Configuration</h2>

        <FormField
          id="provider-endpoint"
          icon={Server}
          label="Provider Endpoint"
          value={settings.baseUrl}
          error={errors.baseUrl}
          placeholder="https://api.openai.com/v1"
          onChange={v => updateField('baseUrl', v)}
          hint="Base URL of your AI provider's API"
        />

        {/* Model */}
        <div className="space-y-2">
          <label htmlFor="model-name" className="section-label">
            <Tag className="w-3 h-3 text-orange-500" aria-hidden="true" /> Model
          </label>
          <div className="relative">
            <input
              id="model-name"
              type="text"
              value={settings.modelName}
              onChange={e => updateField('modelName', e.target.value)}
              placeholder={currentPreset?.modelPlaceholder ?? 'e.g., gpt-4o'}
              className={`input-base ${suggestedModels.length > 0 ? 'pr-10' : ''} ${errors.modelName ? 'input-error' : ''}`}
              aria-describedby={errors.modelName ? 'model-error' : undefined}
            />
            {suggestedModels.length > 0 && (
              <button
                type="button"
                onClick={() => setShowModels(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors rounded-lg hover:bg-neutral-100"
                aria-expanded={showModels}
                aria-label="Show model suggestions"
              >
                {showModels
                  ? <ChevronUp className="w-3.5 h-3.5" />
                  : <ChevronDown className="w-3.5 h-3.5" />
                }
              </button>
            )}
          </div>
          {errors.modelName && (
            <p id="model-error" className="text-xs text-red-500 font-accent" role="alert">{errors.modelName}</p>
          )}
          {showModels && suggestedModels.length > 0 && (
            <div
              className="border border-black/[0.07] rounded-xl overflow-hidden shadow-xs bg-white animate-slide-down"
              role="listbox"
              aria-label="Suggested models"
            >
              {suggestedModels.map(model => (
                <button
                  key={model}
                  role="option"
                  aria-selected={settings.modelName === model}
                  onClick={() => handleModelSelect(model)}
                  className={`w-full text-left px-4 py-2.5 text-xs font-mono hover:bg-orange-50 hover:text-orange-700 transition-colors border-b border-neutral-50 last:border-0 ${
                    settings.modelName === model ? 'bg-orange-50 text-orange-700 font-700' : 'text-neutral-600'
                  }`}
                >
                  {model}
                  {settings.modelName === model && (
                    <span className="ml-2 text-[9px] font-sans font-700 uppercase tracking-widest text-orange-500">Active</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <FormField
          id="api-key"
          icon={Key}
          label="API Key"
          value={settings.apiKey}
          error={errors.apiKey}
          placeholder="sk-…"
          type={showApiKey ? 'text' : 'password'}
          onChange={v => updateField('apiKey', v)}
          rightElement={
            <button
              type="button"
              onClick={() => setShowApiKey(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-600 transition-colors touch-manipulation rounded-lg hover:bg-neutral-100"
              aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
            >
              {showApiKey
                ? <EyeOff className="w-3.5 h-3.5" />
                : <Eye className="w-3.5 h-3.5" />
              }
            </button>
          }
        />

        {/* Privacy notice */}
        <div className="flex items-start gap-2.5 p-3.5 bg-neutral-50 rounded-xl border border-black/[0.05]">
          <Shield className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[11px] text-neutral-500 font-accent leading-relaxed">
            Your API key is stored only in your browser's local storage — never sent to any server.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 pt-1">
          <button
            onClick={handleTestConnection}
            disabled={testing || !settings.baseUrl}
            aria-busy={testing}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-display font-700 uppercase tracking-widest text-[10px] transition-all duration-200 border min-h-[48px] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 ${
              testResult === 'success' ? 'border-emerald-300 bg-emerald-50 text-emerald-600' :
              testResult === 'error'   ? 'border-red-300 bg-red-50 text-red-500' :
              'border-black/[0.07] bg-neutral-50 text-neutral-600 hover:border-black/[0.13] hover:bg-neutral-100'
            } ${testing || !settings.baseUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {testing ? (
              <div className="spinner-dark" aria-hidden="true" />
            ) : testResult === 'success' ? (
              <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            {testing ? 'Testing…' : testResult === 'success' ? 'Connected!' : testResult === 'error' ? 'Failed' : 'Test'}
          </button>

          <button
            onClick={handleSave}
            disabled={!isModified}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-display font-700 uppercase tracking-widest text-[10px] transition-all duration-200 min-h-[48px] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 ${
              isModified
                ? 'bg-neutral-900 text-white hover:bg-black shadow-xs active:scale-[0.97]'
                : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
            }`}
          >
            {isSaved
              ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              : <Save className="w-3.5 h-3.5" aria-hidden="true" />
            }
            {isSaved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </section>

      {/* How to use */}
      <section aria-labelledby="howto-heading" className="bg-white rounded-2xl border border-black/[0.07] p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <h2 id="howto-heading" className="section-label">
            <Info className="w-3 h-3 text-orange-500" aria-hidden="true" />
            How to use
          </h2>
        </div>
        <ol className="space-y-3">
          {[
            'Select a provider preset or enter a custom endpoint',
            'Enter your model name (or pick from suggestions)',
            "Paste your API key from your provider's dashboard",
            'Click "Test" to verify, then "Save"',
            'Head to Generate and start creating components',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="shrink-0 w-5 h-5 rounded-full bg-orange-500 text-white text-[9px] font-display font-700 flex items-center justify-center mt-0.5"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <p className="text-xs text-neutral-500 font-accent leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>

    </div>
  )
}

/* ─── Form field ────────────────────────────────────────────────────────────── */
interface FormFieldProps {
  id: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  error?: string
  placeholder: string
  type?: string
  onChange: (v: string) => void
  rightElement?: React.ReactNode
  hint?: string
}

const FormField = ({
  id, icon: Icon, label, value, error, placeholder, type = 'text', onChange, rightElement, hint,
}: FormFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={id} className="section-label">
      <Icon className="w-3 h-3 text-orange-500" aria-hidden="true" /> {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input-base ${rightElement ? 'pr-10' : ''} ${error ? 'input-error' : ''}`}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-invalid={!!error}
      />
      {rightElement}
    </div>
    {hint  && !error && <p id={`${id}-hint`}  className="text-[11px] text-neutral-400 font-accent">{hint}</p>}
    {error &&           <p id={`${id}-error`} className="text-xs text-red-500 font-accent" role="alert">{error}</p>}
  </div>
)
