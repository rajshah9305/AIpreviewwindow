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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-50">
      <nav className="bg-white/80 backdrop-blur-lg border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                AI UI Generator
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link
                to="/generator"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive('/generator')
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Generator</span>
              </Link>
              
              <Link
                to="/history"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive('/history')
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </Link>
              
              <Link
                to="/settings"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive('/settings')
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-[1920px] mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  )
}
