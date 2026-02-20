import { useState, useEffect } from 'react'
import { Save, Key, Server, Tag, Shield, Eye, EyeOff, Sparkles } from 'lucide-react'
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
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-100 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-500 text-[10px] font-black uppercase tracking-widest mb-4">
            Configuration
          </div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Settings</h2>
          <p className="text-sm text-neutral-400 font-medium mt-2">Power your creative engine with custom AI providers</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-10">
          <div className="bg-white rounded-[3rem] border border-neutral-100 p-10 space-y-8 shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
                  <Tag className="w-3.5 h-3.5 text-orange-500" /> Model Identifier
                </label>
                <input
                  value={settings.modelName}
                  onChange={(e) => handleInputChange('modelName', e.target.value)}
                  placeholder="e.g., gpt-4o-2024-08-06"
                  className={`input-field ${errors.modelName ? 'input-error' : ''}`}
                />
                {errors.modelName && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.modelName}</p>}
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
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
                {errors.apiKey && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.apiKey}</p>}
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
                  <Server className="w-3.5 h-3.5 text-orange-500" /> Provider Endpoint
                </label>
                <input
                  value={settings.baseUrl}
                  onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                  placeholder="https://api.openai.com/v1"
                  className={`input-field ${errors.baseUrl ? 'input-error' : ''}`}
                />
                {errors.baseUrl && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.baseUrl}</p>}
              </div>
            </div>
            
            <button
              onClick={handleSave}
              disabled={!isModified}
              className={`w-full py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all duration-500 flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] ${
                isModified
                ? 'bg-black text-white hover:bg-orange-600 hover:shadow-orange shadow-black/10'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Save className="w-5 h-5" />
              {saved ? 'Settings Deployed' : 'Deploy Configuration'}
            </button>
          </div>

          <div className="p-8 bg-neutral-50 rounded-[2.5rem] border border-neutral-100 flex items-start gap-6 shadow-sm">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
               <Shield className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-black uppercase italic tracking-tight mb-1">Vault Security</p>
              <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                Your credentials are never transmitted to our backend. Everything is encrypted and stored locally in your browser's secure storage.
              </p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 ml-1">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black italic">Rapid Presets</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setSettings({ ...settings, baseUrl: p.baseUrl, modelName: p.model })
                    setIsModified(true)
                  }}
                  className="w-full p-6 bg-white border border-neutral-100 rounded-[2rem] text-left hover:border-orange-500/30 hover:shadow-premium transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-2 h-full bg-orange-500 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  <p className="font-black text-lg uppercase italic tracking-tighter mb-1">{p.name}</p>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{p.model}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 bg-black rounded-[2.5rem] text-white overflow-hidden relative group">
             <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-50" />
             <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-4 italic">Performance Tip</p>
                <p className="text-sm font-bold leading-relaxed italic">
                  "Using flagship models like GPT-4o or Claude 3.5 Sonnet will yield the most premium UI components and superior code quality."
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
