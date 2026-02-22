import { useState, useEffect } from 'react'
import { Save, Key, Server, Tag, Eye, EyeOff, Sparkles } from 'lucide-react'
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
    toast.success('Settings updated successfully')
    setTimeout(() => setSaved(false), 2000)
  }
  
  const handleInputChange = (field: keyof AISettings, value: string) => {
    setSettings({ ...settings, [field]: value })
    setIsModified(true)
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }
  
  const presets = [
    { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o' },
    { name: 'Anthropic', baseUrl: 'https://api.anthropic.com', model: 'claude-3-5-sonnet-20241022' },
    { name: 'Groq', baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.1-70b-versatile' },
  ]
  
  return (
    <div className="max-w-6xl mx-auto space-y-10 md:space-y-16 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-100 pb-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight italic uppercase">Configuration</h2>
          <p className="text-neutral-400 font-medium mt-2">Manage your AI providers and model preferences.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
        <div className="md:col-span-7 space-y-10">
          <div className="bg-white rounded-[2.5rem] border border-neutral-100 p-8 md:p-12 space-y-10 shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 ml-1">
                  <Tag className="w-3.5 h-3.5 text-orange-500" /> Model Identifier
                </label>
                <input
                  value={settings.modelName}
                  onChange={(e) => handleInputChange('modelName', e.target.value)}
                  placeholder="e.g., gpt-4o-2024-08-06"
                  className={`input-field ${errors.modelName ? 'input-error' : ''}`}
                />
                {errors.modelName && <p className="text-[10px] font-semibold text-red-500 ml-1 uppercase">{errors.modelName}</p>}
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 ml-1">
                  <Key className="w-3.5 h-3.5 text-orange-500" /> Secret API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.apiKey}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                    placeholder="sk-..."
                    className={`input-field pr-14 ${errors.apiKey ? 'input-error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-black transition-colors"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.apiKey && <p className="text-[10px] font-semibold text-red-500 ml-1 uppercase">{errors.apiKey}</p>}
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 ml-1">
                  <Server className="w-3.5 h-3.5 text-orange-500" /> Provider Endpoint
                </label>
                <input
                  value={settings.baseUrl}
                  onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                  placeholder="https://api.openai.com/v1"
                  className={`input-field ${errors.baseUrl ? 'input-error' : ''}`}
                />
                {errors.baseUrl && <p className="text-[10px] font-semibold text-red-500 ml-1 uppercase">{errors.baseUrl}</p>}
              </div>
            </div>
            
            <button
              onClick={handleSave}
              disabled={!isModified}
              className={`w-full py-4 rounded-xl font-semibold uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3 active:scale-[0.98] text-sm ${
                isModified
                ? 'bg-black text-white hover:bg-neutral-900 shadow-lg shadow-black/10'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Save className="w-5 h-5" />
              {saved ? 'Settings Deployed' : 'Deploy Configuration'}
            </button>
          </div>
        </div>
        
        <div className="md:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 ml-1">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-black">Rapid Presets</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setSettings({ ...settings, baseUrl: p.baseUrl, modelName: p.model })
                    setIsModified(true)
                  }}
                  className="w-full p-6 bg-white border border-neutral-100 rounded-2xl text-left hover:border-orange-500/20 hover:shadow-premium transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-orange-500 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  <p className="font-bold text-base tracking-tight mb-1">{p.name}</p>
                  <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-widest">{p.model}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
