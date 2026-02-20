import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, Settings, History, Palette } from 'lucide-react'

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path
  
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary-foreground">
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 sm:space-x-4 group transition-all duration-300">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-tr from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div className="hidden min-[400px]:block">
                <h1 className="text-lg sm:text-xl font-display font-black tracking-tight leading-tight">
                  AI UI Generator
                </h1>
              </div>
            </Link>
            
            <div className="flex items-center space-x-1 bg-muted/50 p-1 rounded-2xl border border-border">
              <Link
                to="/generator"
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center space-x-2 ${
                  isActive('/generator')
                    ? 'bg-background text-primary shadow-sm ring-1 ring-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive('/generator') ? 'text-primary' : ''}`} />
                <span className="hidden sm:inline">Generator</span>
              </Link>
              
              <Link
                to="/history"
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center space-x-2 ${
                  isActive('/history')
                    ? 'bg-background text-primary shadow-sm ring-1 ring-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <History className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive('/history') ? 'text-primary' : ''}`} />
                <span className="hidden sm:inline">History</span>
              </Link>
              
              <Link
                to="/design-system"
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center space-x-2 ${
                  isActive('/design-system')
                    ? 'bg-background text-primary shadow-sm ring-1 ring-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <Palette className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive('/design-system') ? 'text-primary' : ''}`} />
                <span className="hidden sm:inline">Design</span>
              </Link>
              
              <Link
                to="/settings"
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center space-x-2 ${
                  isActive('/settings')
                    ? 'bg-background text-primary shadow-sm ring-1 ring-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <Settings className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive('/settings') ? 'text-primary' : ''}`} />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}
