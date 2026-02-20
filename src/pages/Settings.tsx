import { useState, useEffect } from 'react'
import { Save, Key, Server, Tag, Shield, Eye, EyeOff } from 'lucide-react'
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
    if (loaded) setSettings(loaded)
  }, [])
  
  const validateSettings = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!settings.modelName.trim()) newErrors.modelName = 'Model name is required'
    if (!settings.apiKey.trim()) newErrors.apiKey = 'API key is required'
    if (!settings.baseUrl.trim()) newErrors.baseUrl = 'Base URL is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSave = () => {
    if (!validateSettings()) return
    saveSettings(settings)
    setSaved(true)
    setIsModified(false)
    toast.success('Settings saved')
    setTimeout(() => setSaved(false), 2000)
  }
  
  const handleInputChange = (field: keyof AISettings, value: string) => {
    setSettings({ ...settings, [field]: value })
    setIsModified(true)
  }
  
  const presets = [
    { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o' },
    { name: 'Anthropic', baseUrl: 'https://api.anthropic.com', model: 'claude-3-5-sonnet-20241022' },
    { name: 'Groq', baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.1-70b-versatile' },
  ]
  
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      <div>
        <h2 className="text-4xl font-bold tracking-tight mb-4">Settings</h2>
        <p className="text-neutral-500">Configure your AI provider to power the generator.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <div className="p-6 bg-white border border-neutral-100 rounded-3xl space-y-6">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                <Tag className="w-4 h-4" /> Model Name
              </label>
              <input
                value={settings.modelName}
                onChange={(e) => handleInputChange('modelName', e.target.value)}
                placeholder="e.g., gpt-4o"
                className="input-field"
              />
              {errors.modelName && <p className="text-xs text-red-500">{errors.modelName}</p>}
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                <Key className="w-4 h-4" /> API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  placeholder="sk-..."
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.apiKey && <p className="text-xs text-red-500">{errors.apiKey}</p>}
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                <Server className="w-4 h-4" /> Base URL
              </label>
              <input
                value={settings.baseUrl}
                onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                placeholder="https://api.openai.com/v1"
                className="input-field"
              />
              {errors.baseUrl && <p className="text-xs text-red-500">{errors.baseUrl}</p>}
            </div>
            
            <button
              onClick={handleSave}
              disabled={!isModified}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saved ? 'Saved' : 'Save Settings'}
            </button>
          </div>

          <div className="p-6 bg-neutral-50 rounded-3xl border border-neutral-100 flex items-start gap-4">
            <Shield className="w-5 h-5 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Security</p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Settings are stored locally in your browser and never sent to any server except your AI provider.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Presets</h3>
          <div className="space-y-2">
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  setSettings({ ...settings, baseUrl: p.baseUrl, modelName: p.model })
                  setIsModified(true)
                }}
                className="w-full p-4 bg-white border border-neutral-100 rounded-2xl text-left hover:border-neutral-900 transition-colors group"
              >
                <p className="font-bold text-sm mb-1">{p.name}</p>
                <p className="text-[10px] text-neutral-400 truncate">{p.model}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
