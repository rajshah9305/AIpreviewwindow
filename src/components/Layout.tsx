import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path
  
  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <nav className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-base font-bold tracking-tight">AI UI</h1>
            </Link>
            
            <div className="flex items-center space-x-1">
              <Link
                to="/generator"
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/generator')
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                Generator
              </Link>
              
              <Link
                to="/history"
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/history')
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                History
              </Link>
              
              <Link
                to="/settings"
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/settings')
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  )
}
