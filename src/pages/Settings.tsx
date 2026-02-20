import { useState, useEffect } from 'react'
import { Save, Key, Server, Tag, AlertTriangle, Eye, EyeOff, CheckCircle, Sparkles } from 'lucide-react'
import { AISettings } from '../types'
import { saveSettings, loadSettings } from '../services/api'
import { useToast } from '../components/ToastContainer'

export default function Settings() {
  const [settings, setSettings] = useState<AISettings>({
    modelName: '',
    apiKey: '',
    baseUrl: '',
  })
  
  const [saved, setSaved] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isModified, setIsModified] = useState(false)
  const toast = useToast()
  
  useEffect(() => {
    const loaded = loadSettings()
    if (loaded) {
      setSettings(loaded)
    }
  }, [])
  
  const validateSettings = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!settings.modelName.trim()) {
      newErrors.modelName = 'Model name is required'
    }
    
    if (!settings.apiKey.trim()) {
      newErrors.apiKey = 'API key is required'
    } else if (settings.apiKey.length < 10) {
      newErrors.apiKey = 'API key seems too short'
    }
    
    if (!settings.baseUrl.trim()) {
      newErrors.baseUrl = 'Base URL is required'
    } else {
      try {
        const url = new URL(settings.baseUrl)
        if (!url.protocol.startsWith('http')) {
          newErrors.baseUrl = 'URL must start with http:// or https://'
        }
      } catch {
        newErrors.baseUrl = 'Invalid URL format'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSave = () => {
    if (!validateSettings()) {
      toast.error('Please fix the errors before saving')
      return
    }
    
    saveSettings(settings)
    setSaved(true)
    setIsModified(false)
    toast.success('Configuration saved successfully!')
    setTimeout(() => setSaved(false), 3000)
  }
  
  const handleInputChange = (field: keyof AISettings, value: string) => {
    setSettings({ ...settings, [field]: value })
    setIsModified(true)
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }
  
  const providerPresets = [
    {
      name: 'OpenAI',
      baseUrl: 'https://api.openai.com/v1',
      models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      icon: '🤖',
    },
    {
      name: 'Anthropic',
      baseUrl: 'https://api.anthropic.com',
      models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229'],
      icon: '🧠',
    },
    {
      name: 'Groq',
      baseUrl: 'https://api.groq.com/openai/v1',
      models: ['llama-3.1-70b-versatile', 'mixtral-8x7b-32768'],
      icon: '⚡',
    },
  ]
  
  const applyPreset = (baseUrl: string, model: string) => {
    setSettings({ ...settings, baseUrl, modelName: model })
    setIsModified(true)
    toast.info(`Applied ${model} configuration`)
  }
  
  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-display font-black text-neutral-900 mb-2 tracking-tight">
          AI Configuration
        </h2>
        <p className="text-sm sm:text-base text-neutral-500 font-medium mt-1">
          Configure your AI provider to power component generation
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Security Notice */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200/50 rounded-3xl p-6 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-amber-100 rounded-2xl shadow-inner">
                <AlertTriangle className="w-6 h-6 text-amber-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 mb-2 text-lg">Security & Privacy</h3>
                <p className="text-sm text-amber-800/90 leading-relaxed">
                  Your API credentials are stored <strong>locally</strong> in your browser using encrypted storage.
                  They are never transmitted to our servers and are only used for direct API calls to your chosen provider.
                </p>
              </div>
            </div>
          </div>
          
          {/* Configuration Form */}
          <div className="bg-white border border-neutral-200/60 rounded-[3rem] p-8 lg:p-10 shadow-lg space-y-8">
            <div>
              <label 
                htmlFor="modelName"
                className="flex items-center space-x-2 text-sm font-bold text-neutral-700 mb-3"
              >
                <Tag className="w-4 h-4 text-primary-500" />
                <span>Model Name</span>
              </label>
              <input
                id="modelName"
                type="text"
                value={settings.modelName}
                onChange={(e) => handleInputChange('modelName', e.target.value)}
                placeholder="e.g., gpt-4, claude-3-5-sonnet-20241022"
                className={`input-field text-sm ${errors.modelName ? 'input-error' : ''}`}
                aria-invalid={!!errors.modelName}
                aria-describedby={errors.modelName ? 'modelName-error' : undefined}
              />
              {errors.modelName && (
                <p id="modelName-error" className="mt-2 text-xs text-red-600 font-medium">
                  {errors.modelName}
                </p>
              )}
              <p className="mt-2 text-xs text-neutral-500">
                Specify the exact model identifier from your AI provider
              </p>
            </div>
            
            <div>
              <label 
                htmlFor="apiKey"
                className="flex items-center space-x-2 text-sm font-bold text-neutral-700 mb-3"
              >
                <Key className="w-4 h-4 text-primary-500" />
                <span>API Key</span>
              </label>
              <div className="relative">
                <input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  placeholder="sk-..."
                  className={`input-field text-sm pr-12 font-mono ${errors.apiKey ? 'input-error' : ''}`}
                  aria-invalid={!!errors.apiKey}
                  aria-describedby={errors.apiKey ? 'apiKey-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-700 transition-colors rounded-lg hover:bg-neutral-100"
                  aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.apiKey && (
                <p id="apiKey-error" className="mt-2 text-xs text-red-600 font-medium">
                  {errors.apiKey}
                </p>
              )}
              <p className="mt-2 text-xs text-neutral-500">
                Your API key is stored securely in your browser
              </p>
            </div>
            
            <div>
              <label 
                htmlFor="baseUrl"
                className="flex items-center space-x-2 text-sm font-bold text-neutral-700 mb-3"
              >
                <Server className="w-4 h-4 text-primary-500" />
                <span>Base URL</span>
              </label>
              <input
                id="baseUrl"
                type="url"
                value={settings.baseUrl}
                onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                placeholder="https://api.openai.com/v1"
                className={`input-field text-sm font-mono ${errors.baseUrl ? 'input-error' : ''}`}
                aria-invalid={!!errors.baseUrl}
                aria-describedby={errors.baseUrl ? 'baseUrl-error' : undefined}
              />
              {errors.baseUrl && (
                <p id="baseUrl-error" className="mt-2 text-xs text-red-600 font-medium">
                  {errors.baseUrl}
                </p>
              )}
              <p className="mt-2 text-xs text-neutral-500">
                The API endpoint URL for your chosen provider
              </p>
            </div>
            
            <div className="pt-4 flex gap-3">
              <button
                onClick={handleSave}
                disabled={!isModified}
                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl py-4 font-bold flex items-center justify-center space-x-2 hover:from-primary-700 hover:to-primary-800 hover:shadow-xl transition-all duration-300 active:scale-[0.98] shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Save className="w-5 h-5" />
                <span>{saved ? 'Configuration Saved!' : 'Save Configuration'}</span>
              </button>
            </div>
            
            {saved && (
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-green-800 flex items-center justify-center gap-2 animate-fade-in font-bold text-sm shadow-inner">
                <CheckCircle className="w-5 h-5" />
                <span>Configuration updated successfully</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Presets */}
          <div className="card p-6 bg-gradient-to-br from-white to-neutral-50 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary-500" />
              <h3 className="font-bold text-base text-neutral-900">Quick Presets</h3>
            </div>
            <div className="space-y-3">
              {providerPresets.map((provider) => (
                <div key={provider.name} className="border border-neutral-200 rounded-2xl p-4 hover:border-primary-300 hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{provider.icon}</span>
                    <span className="font-bold text-sm text-neutral-900">{provider.name}</span>
                  </div>
                  <code className="text-[10px] bg-neutral-100 px-2 py-1 rounded block break-all mb-3 text-neutral-600 font-mono">
                    {provider.baseUrl}
                  </code>
                  <div className="space-y-1.5">
                    {provider.models.map((model) => (
                      <button
                        key={model}
                        onClick={() => applyPreset(provider.baseUrl, model)}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tips */}
          <div className="card p-6 bg-gradient-to-br from-primary-50 to-orange-50">
            <h4 className="font-bold text-sm text-neutral-900 mb-3">💡 Pro Tips</h4>
            <ul className="space-y-2 text-xs text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 font-bold">•</span>
                <span>GPT-4 provides the most detailed and accurate components</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 font-bold">•</span>
                <span>Claude excels at complex layouts and accessibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 font-bold">•</span>
                <span>Groq offers lightning-fast generation speeds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 font-bold">•</span>
                <span>Test your configuration with a simple component first</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
