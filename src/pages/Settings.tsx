import React, { useState, useCallback } from 'react'
import { Save, Key, Server, Tag, Eye, EyeOff, CheckCircle, Zap, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { useToast } from '../components/ToastContainer'

interface ProviderPreset {
  name: string
  baseUrl: string
  modelPlaceholder: string
  models: string[]
  icon: string
}

const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    modelPlaceholder: 'gpt-4o',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    icon: '⚡',
  },
  {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com',
    modelPlaceholder: 'claude-3-5-sonnet-20241022',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
    icon: '🔮',
  },
  {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    modelPlaceholder: 'llama-3.3-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    icon: '🚀',
  },
  {
    name: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1',
    modelPlaceholder: 'meta-llama/Llama-3-70b-chat-hf',
    models: ['meta-llama/Llama-3-70b-chat-hf', 'mistralai/Mixtral-8x7B-Instruct-v0.1'],
    icon: '🤝',
  },
  {
    name: 'Custom',
    baseUrl: '',
    modelPlaceholder: 'your-model-name',
    models: [],
    icon: '⚙️',
  },
]

export default function Settings() {
  const {
    settings,
    errors,
    isModified,
    isSaved,
    updateField,
    save,
  } = useSettings()

  const toast = useToast()
  const [showApiKey, setShowApiKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [showModels, setShowModels] = useState(false)

  const handleSave = () => {
    if (save()) {
      toast.success('Settings saved successfully')
    }
  }

  const handlePresetSelect = useCallback((preset: ProviderPreset) => {
    if (preset.name === 'Custom') {
      setSelectedPreset('Custom')
      return
    }
    setSelectedPreset(preset.name)
    updateField('baseUrl', preset.baseUrl)
    if (!settings.modelName) {
      updateField('modelName', preset.modelPlaceholder)
    }
    toast.info(`${preset.name} endpoint configured`)
  }, [updateField, settings.modelName, toast])

  const handleModelSelect = useCallback((model: string) => {
    updateField('modelName', model)
    setShowModels(false)
  }, [updateField])

  const handleTestConnection = useCallback(async () => {
    if (!settings.baseUrl) {
      toast.warning('Fill in provider endpoint first')
      return
    }
    setTesting(true)
    setTestResult(null)
    try {
      const response = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseUrl: settings.baseUrl,
          apiKey: settings.apiKey
        })
      })

      const data = await response.json()

      if (response.ok && data.reachable) {
        setTestResult('success')
        toast.success(`Connected! ${selectedPreset ? `${selectedPreset} ` : ''}endpoint is reachable.`)
      } else {
        setTestResult('error')
        const errorMessage = data.message || (data.statusCode ? `Server responded with ${data.statusCode}` : 'Could not reach provider endpoint')
        toast.error(errorMessage)
      }
    } catch (err) {
      setTestResult('error')
      const msg = err instanceof Error ? err.message : 'Failed to test connection'
      toast.error(msg)
    } finally {
      setTesting(false)
      setTimeout(() => setTestResult(null), 3000)
    }
  }, [settings, toast, selectedPreset])

  // Find the current preset's model list
  const currentPreset = PROVIDER_PRESETS.find(p => p.name === selectedPreset)
  const suggestedModels = currentPreset?.models || []

  return (
    <div className="max-w-5xl mx-auto space-y-5 sm:space-y-7 md:space-y-9 animate-fade-in pb-16 sm:pb-12 w-full overflow-x-hidden">
      <PageHeader />

      <div className="max-w-2xl mx-auto w-full space-y-5">
        {/* Provider Presets */}
        <div className="glass-panel rounded-[2.5rem] p-6 sm:p-8 shadow-glass">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-sm font-display font-bold text-neutral-900 tracking-tight">Quick Setup</h3>
            <span className="text-[9px] font-display font-bold uppercase tracking-widest text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full">Provider Presets</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PROVIDER_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePresetSelect(preset)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 text-center touch-manipulation active:scale-95 ${
                  selectedPreset === preset.name
                    ? 'border-black bg-black text-white shadow-xl scale-105'
                    : 'border-black/5 bg-white/50 hover:border-black/10 hover:bg-white text-neutral-700'
                }`}
              >
                <span className="text-lg leading-none">{preset.icon}</span>
                <span className={`text-[10px] font-display font-bold uppercase tracking-wider ${
                  selectedPreset === preset.name ? 'text-white' : 'text-neutral-600'
                }`}>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Settings Form */}
        <div className="glass-panel rounded-[2.5rem] p-8 sm:p-10 space-y-8 shadow-glass w-full">
          <FormField
            icon={Server}
            label="Provider Endpoint"
            value={settings.baseUrl}
            error={errors.baseUrl}
            placeholder="https://api.openai.com/v1"
            onChange={(value) => updateField('baseUrl', value)}
            hint="The base URL of your AI provider's API"
          />

          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-xs sm:text-[11px] font-display text-neutral-400 uppercase tracking-[0.08em] ml-0.5" style={{ fontWeight: 500 }}>
              <Tag className="w-3.5 h-3.5 text-orange-500/70" /> Model
            </label>
            <div className="relative">
              <input
                type="text"
                value={settings.modelName}
                onChange={(e) => updateField('modelName', e.target.value)}
                placeholder={currentPreset?.modelPlaceholder || 'e.g., gpt-4o'}
                className={`w-full px-4 py-3.5 sm:py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/40 transition-all bg-white placeholder:text-neutral-300 text-base font-sans tracking-tight min-h-[52px] ${
                  suggestedModels.length > 0 ? 'pr-12' : ''
                } ${errors.modelName ? 'border-red-500 focus:ring-red-500/5 focus:border-red-400' : 'border-black'}`}
                style={{ fontSize: 'max(16px, 1rem)' }}
              />
              {suggestedModels.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowModels(!showModels)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-700 transition-colors"
                  title="Show suggested models"
                  aria-expanded={showModels}
                >
                  {showModels ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>
            {errors.modelName && (
              <p className="text-xs font-display font-medium text-red-500 ml-0.5 tracking-wide">{errors.modelName}</p>
            )}
            {showModels && suggestedModels.length > 0 && (
              <div className="border-2 border-black rounded-xl overflow-hidden shadow-lg bg-white animate-slide-up">
                {suggestedModels.map((model) => (
                  <button
                    key={model}
                    onClick={() => handleModelSelect(model)}
                    className={`w-full text-left px-4 py-3 text-sm font-mono hover:bg-orange-50 hover:text-orange-700 transition-colors border-b border-neutral-100 last:border-0 ${
                      settings.modelName === model ? 'bg-orange-50 text-orange-700 font-bold' : 'text-neutral-700'
                    }`}
                  >
                    {model}
                    {settings.modelName === model && <span className="ml-2 text-[10px] text-orange-500 font-sans font-bold uppercase tracking-widest">Selected</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <FormField
            icon={Key}
            label="API Key"
            value={settings.apiKey}
            error={errors.apiKey}
            placeholder="sk-..."
            type={showApiKey ? 'text' : 'password'}
            onChange={(value) => updateField('apiKey', value)}
            hint="Your API key is stored locally and never sent to our servers"
            rightElement={
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors touch-manipulation p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* Privacy notice */}
          <div className="flex items-start gap-2.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
            <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
            <p className="text-xs text-neutral-500 font-accent leading-relaxed">
              Your API key and settings are stored only in your browser's local storage. They are sent directly to your AI provider and never stored on any server.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 pt-1">
            <button
              onClick={handleTestConnection}
              disabled={testing || !settings.baseUrl}
              className={`flex-1 py-4 rounded-2xl font-display font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 text-[11px] touch-manipulation border-2 min-h-[56px] ${
                testResult === 'success'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                  : testResult === 'error'
                  ? 'border-red-500 bg-red-50 text-red-500'
                  : 'border-black/5 bg-white text-neutral-600 hover:border-black/20 hover:bg-neutral-50'
              } ${testing ? 'opacity-60 cursor-wait animate-pulse' : ''} ${!settings.baseUrl ? 'opacity-40 cursor-not-allowed' : ''}`}
              aria-busy={testing}
            >
              {testing ? (
                <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
              ) : testResult === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {testing ? 'Testing...' : testResult === 'success' ? 'Connected!' : testResult === 'error' ? 'Failed' : 'Test Connection'}
            </button>

            <button
              onClick={handleSave}
              disabled={!isModified}
              className={`flex-1 py-4 rounded-2xl font-display font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 text-[11px] touch-manipulation min-h-[56px] ${
                isModified
                  ? 'bg-black text-white hover:scale-[1.02] shadow-xl active:scale-95'
                  : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
              }`}
            >
              {isSaved ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Usage tips */}
        <div className="bg-white rounded-2xl border-2 border-black p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <h3 className="text-sm font-display font-bold text-neutral-900 tracking-tight mb-3">How to use</h3>
          <ol className="space-y-2.5">
            {[
              'Select a provider preset above or enter a custom endpoint',
              'Enter your model name (or pick from the suggestions)',
              'Paste your API key from your provider\'s dashboard',
              'Click "Test Connection" to verify, then "Save Settings"',
              'Head to the Generator tab and start creating components!',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-display font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-neutral-600 font-accent leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

const PageHeader = () => (
  <div className="flex flex-col items-center justify-center text-center gap-4 border-b-2 border-black/5 pb-10 sm:pb-12 w-full">
    <div>
      <h2 className="text-4xl sm:text-5xl font-display font-800 tracking-tightest text-neutral-900">Preferences</h2>
      <p className="text-sm text-neutral-400 mt-2 font-accent font-400 tracking-snug">Configure your AI engine and connection</p>
    </div>
  </div>
)

interface FormFieldProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  error?: string
  placeholder: string
  type?: string
  onChange: (value: string) => void
  rightElement?: React.ReactNode
  hint?: string
}

const FormField = ({
  icon: Icon,
  label,
  value,
  error,
  placeholder,
  type = 'text',
  onChange,
  rightElement,
  hint,
}: FormFieldProps) => (
  <div className="space-y-3">
    <label className="flex items-center gap-2.5 text-[10px] font-display text-neutral-400 uppercase tracking-widest ml-1 font-bold">
      <Icon className="w-3.5 h-3.5 text-orange-500" /> {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-6 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all bg-white/50 backdrop-blur-sm placeholder:text-neutral-300 text-base font-accent font-500 tracking-tight min-h-[60px] ${
          rightElement ? 'pr-16' : ''
        } ${error ? 'border-red-500 focus:ring-red-500/5 focus:border-red-400' : 'border-black/10 hover:border-black/20'}`}
        style={{ fontSize: 'max(16px, 1rem)' }}
      />
      {rightElement}
    </div>
    {hint && !error && (
      <p className="text-[11px] text-neutral-400 font-accent ml-0.5">{hint}</p>
    )}
    {error && (
      <p className="text-xs font-display font-medium text-red-500 ml-0.5 tracking-wide">{error}</p>
    )}
  </div>
)
