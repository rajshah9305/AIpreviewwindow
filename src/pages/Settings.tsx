import { useState, useEffect } from 'react'
import { Save, Key, Server, Tag, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { AISettings } from '../types'
import { saveSettings, loadSettings } from '../services/api'

export default function Settings() {
  const [settings, setSettings] = useState<AISettings>({
    modelName: '',
    apiKey: '',
    baseUrl: '',
  })
  
  const [saved, setSaved] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
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
      return
    }
    
    saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }
  
  const handleInputChange = (field: keyof AISettings, value: string) => {
    setSettings({ ...settings, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
          AI Configuration
        </h2>
        <p className="text-neutral-600">
          Configure your AI model settings to power the component generator
        </p>
      </div>
      
      <div className="card p-6 mb-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">Security Notice</h3>
            <p className="text-sm text-yellow-800">
              Your API key is stored locally in your browser and never sent to our servers. 
              It's only used to make direct requests to your chosen AI provider. 
              Keep your API key secure and never share it with others.
            </p>
          </div>
        </div>
      </div>
      
      <div className="card p-8 space-y-6">
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 mb-2">
            <Tag className="w-4 h-4" />
            <span>Model Name</span>
          </label>
          <input
            type="text"
            value={settings.modelName}
            onChange={(e) => handleInputChange('modelName', e.target.value)}
            placeholder="e.g., gpt-4, claude-3-5-sonnet-20241022, llama-3.3-70b-versatile"
            className={`input-field ${errors.modelName ? 'border-red-500 focus:ring-red-500' : ''}`}
            aria-invalid={!!errors.modelName}
            aria-describedby={errors.modelName ? 'modelName-error' : undefined}
          />
          {errors.modelName && (
            <p id="modelName-error" className="mt-1 text-sm text-red-600">
              {errors.modelName}
            </p>
          )}
          <p className="mt-1 text-xs text-neutral-500">
            The specific model identifier from your AI provider
          </p>
        </div>
        
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 mb-2">
            <Key className="w-4 h-4" />
            <span>API Key</span>
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={settings.apiKey}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              placeholder="Enter your API key"
              className={`input-field pr-12 ${errors.apiKey ? 'border-red-500 focus:ring-red-500' : ''}`}
              aria-invalid={!!errors.apiKey}
              aria-describedby={errors.apiKey ? 'apiKey-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
              aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
            >
              {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.apiKey && (
            <p id="apiKey-error" className="mt-1 text-sm text-red-600">
              {errors.apiKey}
            </p>
          )}
          <p className="mt-1 text-xs text-neutral-500">
            Your API key from OpenAI, Anthropic, Groq, or other providers
          </p>
        </div>
        
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 mb-2">
            <Server className="w-4 h-4" />
            <span>Base URL</span>
          </label>
          <input
            type="text"
            value={settings.baseUrl}
            onChange={(e) => handleInputChange('baseUrl', e.target.value)}
            placeholder="e.g., https://api.openai.com/v1, https://api.groq.com/openai/v1"
            className={`input-field ${errors.baseUrl ? 'border-red-500 focus:ring-red-500' : ''}`}
            aria-invalid={!!errors.baseUrl}
            aria-describedby={errors.baseUrl ? 'baseUrl-error' : undefined}
          />
          {errors.baseUrl && (
            <p id="baseUrl-error" className="mt-1 text-sm text-red-600">
              {errors.baseUrl}
            </p>
          )}
          <p className="mt-1 text-xs text-neutral-500">
            The API endpoint URL for your AI provider
          </p>
        </div>
        
        <div className="pt-4">
          <button
            onClick={handleSave}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{saved ? 'Settings Saved!' : 'Save Settings'}</span>
          </button>
        </div>
        
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-center animate-fade-in">
            Settings saved successfully! You can now generate components.
          </div>
        )}
      </div>
      
      <div className="mt-6 card p-6 bg-neutral-50">
        <h3 className="font-semibold text-neutral-900 mb-3">Popular Providers</h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <div className="flex justify-between">
            <span className="font-medium">OpenAI:</span>
            <code className="text-xs bg-white px-2 py-1 rounded">https://api.openai.com/v1</code>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Anthropic:</span>
            <code className="text-xs bg-white px-2 py-1 rounded">https://api.anthropic.com</code>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Groq:</span>
            <code className="text-xs bg-white px-2 py-1 rounded">https://api.groq.com/openai/v1</code>
          </div>
        </div>
      </div>
    </div>
  )
}
