import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, History, Settings, LayoutGrid } from 'lucide-react'
import GLSLHills from './ui/glsl-hills'

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
      <GLSLHills />
      <nav className="sticky top-0 z-[100] w-full px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-5xl mx-auto glass rounded-xl md:rounded-2xl px-4 md:px-6 py-2 md:py-2.5 shadow-premium flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-black rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-500 group-hover:bg-orange-500 shadow-sm shadow-black/5">
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm md:text-base font-bold tracking-tight leading-none text-black">AI UI</h1>
            </div>
          </Link>

          <div className="flex items-center gap-0.5 md:gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-[13px] font-medium transition-all duration-300 flex items-center gap-1.5 md:gap-2 ${
                    active
                      ? 'bg-black text-white'
                      : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${active ? 'text-orange-500' : ''}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
      
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 relative">
        {children}
      </main>

      <footer className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 border-t border-neutral-50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <p className="text-xs font-medium tracking-tight text-neutral-400">
              AI UI GENERATOR &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
