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
    <div className="min-h-screen min-h-[100dvh] bg-[#faf8f6] text-black selection:bg-orange-500/10 selection:text-orange-600 overflow-x-hidden w-full max-w-[100vw]">
      <Suspense fallback={null}>
        <GLSLHills />
      </Suspense>
      <nav className="sticky top-0 z-[100] w-full px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 safe-top">
        <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md border border-neutral-200 rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 md:py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-2.5 lg:space-x-3 group min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-black rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-500 group-hover:bg-orange-500 shadow-sm shadow-black/10 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/25 shrink-0">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-[10px] sm:text-xs md:text-sm lg:text-base font-display font-bold tracking-tighter leading-none text-black truncate">RAJ AI UI</h1>
            </div>
          </Link>

          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-2 sm:px-2.5 md:px-3 lg:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg md:rounded-xl text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-display font-bold transition-all duration-300 flex items-center gap-1 sm:gap-1.5 md:gap-2 touch-manipulation tracking-tight ${
                    active
                      ? 'bg-black text-white shadow-md'
                      : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0 ${active ? 'text-orange-500' : ''}`} />
                  <span className="hidden xs:inline sm:inline whitespace-nowrap">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
      
      <main className="w-full max-w-6xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-6 lg:py-8 xl:py-10 relative z-10 safe-bottom overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
