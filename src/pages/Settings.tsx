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
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-display font-bold text-neutral-900 mb-1">
          AI Configuration
        </h2>
        <p className="text-sm text-neutral-600">
          Configure your AI model settings to power the component generator
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="card p-5 mb-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-yellow-900 mb-0.5">Security Notice</h3>
                <p className="text-xs text-yellow-800">
                  Your API key is stored locally in your browser and never sent to our servers. 
                  Keep it secure and never share it.
                </p>
              </div>
            </div>
          </div>
          
          <div className="card p-5 space-y-4">
            <div>
              <label className="flex items-center space-x-1.5 text-xs font-medium text-neutral-700 mb-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Model Name</span>
              </label>
              <input
                type="text"
                value={settings.modelName}
                onChange={(e) => handleInputChange('modelName', e.target.value)}
                placeholder="e.g., gpt-4, claude-3-5-sonnet-20241022"
                className={`input-field text-sm ${errors.modelName ? 'border-red-500 focus:ring-red-500' : ''}`}
                aria-invalid={!!errors.modelName}
                aria-describedby={errors.modelName ? 'modelName-error' : undefined}
              />
              {errors.modelName && (
                <p id="modelName-error" className="mt-1 text-xs text-red-600">
                  {errors.modelName}
                </p>
              )}
            </div>
            
            <div>
              <label className="flex items-center space-x-1.5 text-xs font-medium text-neutral-700 mb-1.5">
                <Key className="w-3.5 h-3.5" />
                <span>API Key</span>
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  placeholder="Enter your API key"
                  className={`input-field text-sm pr-10 ${errors.apiKey ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-invalid={!!errors.apiKey}
                  aria-describedby={errors.apiKey ? 'apiKey-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
                  aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.apiKey && (
                <p id="apiKey-error" className="mt-1 text-xs text-red-600">
                  {errors.apiKey}
                </p>
              )}
            </div>
            
            <div>
              <label className="flex items-center space-x-1.5 text-xs font-medium text-neutral-700 mb-1.5">
                <Server className="w-3.5 h-3.5" />
                <span>Base URL</span>
              </label>
              <input
                type="text"
                value={settings.baseUrl}
                onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                placeholder="e.g., https://api.openai.com/v1"
                className={`input-field text-sm ${errors.baseUrl ? 'border-red-500 focus:ring-red-500' : ''}`}
                aria-invalid={!!errors.baseUrl}
                aria-describedby={errors.baseUrl ? 'baseUrl-error' : undefined}
              />
              {errors.baseUrl && (
                <p id="baseUrl-error" className="mt-1 text-xs text-red-600">
                  {errors.baseUrl}
                </p>
              )}
            </div>
            
            <div className="pt-2">
              <button
                onClick={handleSave}
                className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
              >
                <Save className="w-4 h-4" />
                <span className="text-sm">{saved ? 'Settings Saved!' : 'Save Settings'}</span>
              </button>
            </div>
            
            {saved && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-center animate-fade-in text-xs">
                Settings saved successfully! You can now generate components.
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="card p-5 bg-neutral-50 sticky top-20">
            <h3 className="font-semibold text-sm text-neutral-900 mb-3">Popular Providers</h3>
            <div className="space-y-3 text-xs text-neutral-700">
              <div>
                <span className="font-medium block mb-1">OpenAI</span>
                <code className="text-[10px] bg-white px-2 py-1 rounded block break-all">https://api.openai.com/v1</code>
              </div>
              <div>
                <span className="font-medium block mb-1">Anthropic</span>
                <code className="text-[10px] bg-white px-2 py-1 rounded block break-all">https://api.anthropic.com</code>
              </div>
              <div>
                <span className="font-medium block mb-1">Groq</span>
                <code className="text-[10px] bg-white px-2 py-1 rounded block break-all">https://api.groq.com/openai/v1</code>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <h4 className="font-semibold text-xs text-neutral-900 mb-2">Quick Tips</h4>
              <ul className="space-y-1.5 text-[10px] text-neutral-600">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-1">•</span>
                  <span>Use GPT-4 for best results</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-1">•</span>
                  <span>Claude excels at complex layouts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-1">•</span>
                  <span>Groq offers fast generation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
