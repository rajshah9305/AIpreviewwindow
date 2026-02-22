import { ReactNode, lazy, Suspense } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, History, Settings, LayoutGrid } from 'lucide-react'

// Lazy load the heavy GLSL component
const GLSLHills = lazy(() => import('./ui/glsl-hills').then(module => ({ default: module.GLSLHills })))

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
    <div className="min-h-screen min-h-[100dvh] bg-[#faf8f6] text-black selection:bg-orange-500/10 selection:text-orange-600">
      <Suspense fallback={null}>
        <GLSLHills />
      </Suspense>
      <nav className="sticky top-0 z-[100] w-full px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3.5 safe-top">
        <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md border border-neutral-200 rounded-xl md:rounded-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-2.5 md:space-x-3 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-black rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-500 group-hover:bg-orange-500 shadow-sm shadow-black/10 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/25">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xs sm:text-sm md:text-base font-display font-bold tracking-tighter leading-none text-black">RAJ AI UI</h1>
            </div>
          </Link>

          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] sm:text-xs md:text-sm font-display font-bold transition-all duration-300 flex items-center gap-1 sm:gap-1.5 md:gap-2 touch-manipulation tracking-tight ${
                    active
                      ? 'bg-black text-white shadow-md'
                      : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${active ? 'text-orange-500' : ''}`} />
                  <span className="hidden xs:inline sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
      
      <main className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-10 relative z-10 safe-bottom">
        {children}
      </main>

      <footer className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 border-t border-neutral-50 relative z-10 safe-bottom">
      </footer>
    </div>
  )
}
