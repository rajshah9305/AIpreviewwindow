import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, History, Settings, LayoutGrid } from 'lucide-react'

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path
  
  const navItems = [
    { path: '/generator', label: 'Generator', icon: LayoutGrid },
    { path: '/history', label: 'History', icon: History },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-white text-black selection:bg-orange-500/10 selection:text-orange-600">
      <nav className="sticky top-0 z-[100] w-full px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-5xl mx-auto bg-white border border-neutral-100 rounded-2xl md:rounded-3xl px-4 md:px-6 py-2.5 md:py-3 shadow-sm flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 shadow-lg shadow-black/5 relative">
              <Sparkles className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 border-2 border-white rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-black leading-none">AI UI</span>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-orange-500 mt-1">Engine Live</span>
            </div>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-label={item.label}
                  className={`w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl transition-all duration-500 flex items-center justify-center relative group/nav ${
                    active
                      ? 'bg-black text-white shadow-xl shadow-black/10 scale-105'
                      : 'text-neutral-400 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors duration-500 ${active ? 'text-orange-500' : 'group-hover/nav:text-black'}`} />
                  {active && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-orange-500 rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
      
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 relative">
        {children}
      </main>

      <footer className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="flex items-center justify-center gap-2">
          <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-300 uppercase">
            AI UI GENERATOR &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}
