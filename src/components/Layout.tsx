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
      <nav className="sticky top-0 z-[100] w-full px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-5xl mx-auto glass rounded-2xl md:rounded-3xl px-4 md:px-6 py-2.5 md:py-3 shadow-premium flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-black rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 group-hover:bg-orange-500 shadow-lg shadow-black/5 group-hover:shadow-orange-500/20">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white animate-pulse-slow" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xs md:text-sm font-black tracking-tighter leading-none uppercase italic">AI UI</h1>
              <span className="text-[9px] md:text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mt-0.5">Premium</span>
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
                  className={`px-3 md:px-4 py-2 rounded-xl md:rounded-2xl text-xs md:text-[13px] font-bold transition-all duration-300 flex items-center gap-1.5 md:gap-2 ${
                    active
                      ? 'bg-black text-white shadow-lg shadow-black/10'
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
        {/* Abstract Background elements */}
        <div className="absolute top-0 right-0 -z-10 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -z-10 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

        {children}
      </main>

      <footer className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 border-t border-neutral-50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <p className="text-xs font-bold tracking-tight text-neutral-400">
              AI UI GENERATOR &copy; {new Date().getFullYear()}
            </p>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <a href="#" className="text-xs font-bold text-neutral-400 hover:text-orange-500 transition-colors">Privacy</a>
            <a href="#" className="text-xs font-bold text-neutral-400 hover:text-orange-500 transition-colors">Terms</a>
            <a href="#" className="text-xs font-bold text-neutral-400 hover:text-orange-500 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
