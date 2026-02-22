/**
 * Settings page
 * AI provider configuration interface
 */

import { useState } from 'react'
import { Save, Key, Server, Tag, Eye, EyeOff } from 'lucide-react'
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

  const handleSave = () => {
    if (save()) {
      toast.success('Settings updated successfully')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 md:space-y-10 animate-fade-in pb-12 sm:pb-16">
      <PageHeader />

      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
        <SettingsForm
          settings={settings}
          errors={errors}
          isModified={isModified}
          isSaved={isSaved}
          showApiKey={showApiKey}
          onFieldChange={updateField}
          onToggleApiKey={() => setShowApiKey(!showApiKey)}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}

const PageHeader = () => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-b border-neutral-100 pb-3 sm:pb-4 md:pb-6">
    <h2 className="heading-section">Settings</h2>
  </div>
)

interface SettingsFormProps {
  settings: { modelName: string; apiKey: string; baseUrl: string }
  errors: Record<string, string>
  isModified: boolean
  isSaved: boolean
  showApiKey: boolean
  onFieldChange: (field: 'modelName' | 'apiKey' | 'baseUrl', value: string) => void
  onToggleApiKey: () => void
  onSave: () => void
}

const SettingsForm = ({
  settings,
  errors,
  isModified,
  isSaved,
  showApiKey,
  onFieldChange,
  onToggleApiKey,
  onSave,
}: SettingsFormProps) => (
  <div className="bg-white rounded-xl sm:rounded-2xl border border-neutral-200 p-5 sm:p-7 md:p-8 space-y-5 sm:space-y-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)] relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

    <div className="space-y-4 sm:space-y-5">
      <FormField
        icon={Tag}
        label="Model Identifier"
        value={settings.modelName}
        error={errors.modelName}
        placeholder="e.g., gpt-4o-2024-08-06"
        onChange={(value) => onFieldChange('modelName', value)}
      />

      <FormField
        icon={Key}
        label="Secret API Key"
        value={settings.apiKey}
        error={errors.apiKey}
        placeholder="sk-..."
        type={showApiKey ? 'text' : 'password'}
        onChange={(value) => onFieldChange('apiKey', value)}
        rightElement={
          <button
            type="button"
            onClick={onToggleApiKey}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors touch-manipulation"
            aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
          >
            {showApiKey ? <EyeOff className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
          </button>
        }
      />

      <FormField
        icon={Server}
        label="Provider Endpoint"
        value={settings.baseUrl}
        error={errors.baseUrl}
        placeholder="https://api.openai.com/v1"
        onChange={(value) => onFieldChange('baseUrl', value)}
      />
    </div>

    <button
      onClick={onSave}
      disabled={!isModified}
      className={`w-full py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-display font-semibold uppercase tracking-[0.1em] transition-all duration-300 flex items-center justify-center gap-2 sm:gap-2.5 active:scale-[0.98] text-xs sm:text-sm touch-manipulation ${
        isModified
          ? 'bg-gradient-to-br from-black to-neutral-900 text-white hover:shadow-lg hover:shadow-black/10'
          : 'bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none'
      }`}
    >
      <Save className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      {isSaved ? 'Settings Deployed' : 'Deploy Configuration'}
    </button>
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
  <div className="space-y-2 sm:space-y-2.5">
    <label className="flex items-center gap-1.5 sm:gap-2 text-label text-neutral-500 ml-1">
      <Icon className="w-3.5 h-3.5 text-orange-500" /> {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input-field text-sm ${rightElement ? 'pr-12' : ''} ${error ? 'input-error' : ''}`}
      />
      {rightElement}
    </div>
    {error && (
      <p className="text-[10px] sm:text-[11px] font-display font-semibold text-red-600 ml-1 uppercase tracking-wide">{error}</p>
    )}
  </div>
)


