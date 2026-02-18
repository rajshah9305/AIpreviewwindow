import { useState, useEffect } from 'react'
import { Save, Key, Server, Tag } from 'lucide-react'
import { AISettings } from '../types'
import { saveSettings, loadSettings } from '../services/api'

export default function Settings() {
  const [settings, setSettings] = useState<AISettings>({
    modelName: '',
    apiKey: '',
    baseUrl: '',
  })
  
  const [saved, setSaved] = useState(false)
  
  useEffect(() => {
    const loaded = loadSettings()
    if (loaded) {
      setSettings(loaded)
    }
  }, [])
  
  const handleSave = () => {
    saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
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
      
      <div className="card p-8 space-y-6">
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 mb-2">
            <Tag className="w-4 h-4" />
            <span>Model Name</span>
          </label>
          <input
            type="text"
            value={settings.modelName}
            onChange={(e) => setSettings({ ...settings, modelName: e.target.value })}
            placeholder="e.g., gpt-4, claude-3-5-sonnet-20241022, llama-3.3-70b-versatile"
            className="input-field"
          />
        </div>
        
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 mb-2">
            <Key className="w-4 h-4" />
            <span>API Key</span>
          </label>
          <input
            type="password"
            value={settings.apiKey}
            onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
            placeholder="Enter your API key"
            className="input-field"
          />
        </div>
        
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 mb-2">
            <Server className="w-4 h-4" />
            <span>Base URL</span>
          </label>
          <input
            type="text"
            value={settings.baseUrl}
            onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
            placeholder="e.g., https://api.openai.com/v1, https://api.groq.com/openai/v1"
            className="input-field"
          />
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
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-center">
            Settings saved successfully!
          </div>
        )}
      </div>
    </div>
  )
}
