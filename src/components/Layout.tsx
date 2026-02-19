import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, Settings, History } from 'lucide-react'

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path
  
  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-primary-100 selection:text-primary-900">
      <nav className="sticky top-0 z-50 w-full border-b border-neutral-200/60 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group transition-transform duration-300 hover:scale-[1.02]">
              <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:rotate-6 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                  AI UI Generator
                </h1>
                <p className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">V2.0 Showcase</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-1 bg-neutral-100/50 p-1 rounded-xl border border-neutral-200/50">
              <Link
                to="/generator"
                className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center space-x-2 ${
                  isActive('/generator')
                    ? 'bg-white text-primary-600 shadow-sm ring-1 ring-neutral-200'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/50'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${isActive('/generator') ? 'text-primary-500' : ''}`} />
                <span>Generator</span>
              </Link>
              
              <Link
                to="/history"
                className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center space-x-2 ${
                  isActive('/history')
                    ? 'bg-white text-primary-600 shadow-sm ring-1 ring-neutral-200'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/50'
                }`}
              >
                <History className={`w-4 h-4 ${isActive('/history') ? 'text-primary-500' : ''}`} />
                <span>History</span>
              </Link>
              
              <Link
                to="/settings"
                className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center space-x-2 ${
                  isActive('/settings')
                    ? 'bg-white text-primary-600 shadow-sm ring-1 ring-neutral-200'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/50'
                }`}
              >
                <Settings className={`w-4 h-4 ${isActive('/settings') ? 'text-primary-500' : ''}`} />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-[1920px] mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
