import { useState, useCallback } from 'react'
import { Save, Key, Server, Tag, Eye, EyeOff, CheckCircle, Zap } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { useToast } from '../components/ToastContainer'

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

  const handleSave = () => {
    if (save()) {
      toast.success('Settings saved')
    }
  }

  const handleTestConnection = useCallback(async () => {
    if (!settings.apiKey || !settings.baseUrl) {
      toast.warning('Fill in API key and endpoint first')
      return
    }
    setTesting(true)
    setTestResult(null)
    try {
      const response = await fetch('/api/health')
      if (response.ok) {
        setTestResult('success')
        toast.success('API server is reachable')
      } else {
        setTestResult('error')
        toast.error('API server returned an error')
      }
    } catch {
      setTestResult('error')
      toast.error('Could not reach API server')
    } finally {
      setTesting(false)
      setTimeout(() => setTestResult(null), 3000)
    }
  }, [settings, toast])

  return (
    <div className="max-w-5xl mx-auto space-y-5 sm:space-y-7 md:space-y-9 animate-fade-in pb-16 sm:pb-12 w-full overflow-x-hidden">
      <PageHeader />

      <div className="max-w-2xl mx-auto w-full">
        <SettingsForm
          settings={settings}
          errors={errors}
          isModified={isModified}
          isSaved={isSaved}
          showApiKey={showApiKey}
          testing={testing}
          testResult={testResult}
          onFieldChange={updateField}
          onToggleApiKey={() => setShowApiKey(!showApiKey)}
          onSave={handleSave}
          onTestConnection={handleTestConnection}
        />
      </div>
    </div>
  )
}

const PageHeader = () => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-200/60 pb-5 sm:pb-6 w-full">
    <div>
      <h2 className="heading-section truncate text-neutral-900">Settings</h2>
      <p className="text-sm sm:text-sm text-neutral-400 mt-1.5" style={{ fontWeight: 300 }}>Configure your AI provider connection</p>
    </div>
  </div>
)

interface SettingsFormProps {
  settings: { modelName: string; apiKey: string; baseUrl: string }
  errors: Record<string, string>
  isModified: boolean
  isSaved: boolean
  showApiKey: boolean
  testing: boolean
  testResult: 'success' | 'error' | null
  onFieldChange: (field: 'modelName' | 'apiKey' | 'baseUrl', value: string) => void
  onToggleApiKey: () => void
  onSave: () => void
  onTestConnection: () => void
}

const SettingsForm = ({
  settings,
  errors,
  isModified,
  isSaved,
  showApiKey,
  testing,
  testResult,
  onFieldChange,
  onToggleApiKey,
  onSave,
  onTestConnection,
}: SettingsFormProps) => (
  <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-6 md:p-8 space-y-6 sm:space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] w-full">
    <div className="space-y-5 sm:space-y-5 w-full">
      <FormField
        icon={Server}
        label="Provider Endpoint"
        value={settings.baseUrl}
        error={errors.baseUrl}
        placeholder="https://api.openai.com/v1"
        onChange={(value) => onFieldChange('baseUrl', value)}
      />

      <FormField
        icon={Tag}
        label="Model"
        value={settings.modelName}
        error={errors.modelName}
        placeholder="e.g., gpt-4o"
        onChange={(value) => onFieldChange('modelName', value)}
      />

      <FormField
        icon={Key}
        label="API Key"
        value={settings.apiKey}
        error={errors.apiKey}
        placeholder="sk-..."
        type={showApiKey ? 'text' : 'password'}
        onChange={(value) => onFieldChange('apiKey', value)}
        rightElement={
          <button
            type="button"
            onClick={onToggleApiKey}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors touch-manipulation p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
          >
            {showApiKey ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
          </button>
        }
      />
    </div>

    <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 pt-3">
      <button
        onClick={onTestConnection}
        disabled={testing || !settings.baseUrl}
        className={`flex-1 py-3.5 sm:py-3 rounded-xl font-display uppercase tracking-[0.06em] transition-all duration-300 flex items-center justify-center gap-2.5 text-sm sm:text-xs touch-manipulation border-2 min-h-[52px] ${
          testResult === 'success'
            ? 'border-green-200 bg-green-50 text-green-600'
            : testResult === 'error'
            ? 'border-red-200 bg-red-50 text-red-500'
            : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:border-neutral-300'
        } ${testing ? 'opacity-60 cursor-wait' : ''} ${!settings.baseUrl ? 'opacity-40 cursor-not-allowed' : ''}`}
        style={{ fontWeight: 500 }}
      >
        {testing ? (
          <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
        ) : testResult === 'success' ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <Zap className="w-4 h-4" />
        )}
        {testing ? 'Testing...' : testResult === 'success' ? 'Connected' : testResult === 'error' ? 'Failed' : 'Test Connection'}
      </button>

      <button
        onClick={onSave}
        disabled={!isModified}
        className={`flex-1 py-3.5 sm:py-3 rounded-xl font-display uppercase tracking-[0.06em] transition-all duration-300 flex items-center justify-center gap-2.5 text-sm sm:text-xs touch-manipulation min-h-[52px] ${
          isModified
            ? 'bg-neutral-900 text-white hover:bg-black shadow-md hover:shadow-lg'
            : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
        }`}
        style={{ fontWeight: 500 }}
      >
        {isSaved ? (
          <CheckCircle className="w-4 h-4 text-green-400" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {isSaved ? 'Saved' : 'Save Settings'}
      </button>
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
}: FormFieldProps) => (
  <div className="space-y-2.5">
    <label className="flex items-center gap-2 text-xs sm:text-[11px] font-display text-neutral-400 uppercase tracking-[0.08em] ml-0.5" style={{ fontWeight: 500 }}>
      <Icon className="w-3.5 h-3.5 text-orange-500/70" /> {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3.5 sm:py-3.5 border rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/40 transition-all bg-white placeholder:text-neutral-300 text-base font-sans tracking-tight min-h-[52px] ${
          rightElement ? 'pr-14' : ''
        } ${error ? 'border-red-200 focus:ring-red-500/5 focus:border-red-400' : 'border-neutral-200'}`}
        style={{ fontSize: 'max(16px, 1rem)' }}
      />
      {rightElement}
    </div>
    {error && (
      <p className="text-xs font-display font-medium text-red-500 ml-0.5 tracking-wide">{error}</p>
    )}
  </div>
)
