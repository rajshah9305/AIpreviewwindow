import { ReactNode, lazy, Suspense } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, History, Settings, Wand2 } from 'lucide-react'

const GLSLHills = lazy(() => import('./ui/glsl-hills').then(module => ({ default: module.GLSLHills })))

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path
  
  const navItems = [
    { path: '/generator', label: 'Generator', icon: Wand2 },
    { path: '/history', label: 'History', icon: History },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#faf8f6] text-black selection:bg-orange-500/10 selection:text-orange-600 overflow-x-hidden w-full max-w-[100vw]">
      <Suspense fallback={null}>
        <GLSLHills />
      </Suspense>

      {/* Desktop top nav */}
      <nav className="sticky top-0 z-[100] w-full px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 safe-top hidden sm:block">
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-2xl border border-neutral-200/60 rounded-2xl px-3 md:px-5 py-2 md:py-2.5 shadow-[0_8px_40px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between gap-2 transition-all duration-500">
          <Link to="/" className="flex items-center space-x-2.5 md:space-x-3 group shrink-0 no-underline" style={{ textDecoration: 'none' }}>
            <div className="relative w-9 h-9 md:w-10 md:h-10">
              <div className="absolute inset-0 bg-orange-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-full h-full bg-gradient-to-br from-neutral-900 to-black rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-orange-500/20 shrink-0">
                <Sparkles className="w-4 h-4 md:w-[18px] md:h-[18px] text-orange-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm md:text-[15px] font-display font-extrabold tracking-tighter leading-none text-black whitespace-nowrap" style={{ fontWeight: 800 }}>RAJ AI UI</h1>
              <span className="text-[9px] md:text-[10px] font-display font-semibold text-neutral-400 tracking-wide uppercase leading-none mt-0.5">Component Engine</span>
            </div>
          </Link>

          <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-[11px] md:text-xs font-display transition-all duration-300 flex items-center gap-1.5 md:gap-2 touch-manipulation tracking-tight overflow-hidden no-underline ${
                    active
                      ? 'bg-neutral-900 text-white shadow-md shadow-black/10 font-bold'
                      : 'text-neutral-500 hover:text-black hover:bg-neutral-50/80 font-semibold'
                  }`}
                  aria-current={active ? 'page' : undefined}
                  style={{ textDecoration: 'none' }}
                >
                  <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 transition-colors duration-300 ${active ? 'text-orange-400' : ''}`} />
                  <span className="whitespace-nowrap relative z-10">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] sm:hidden safe-bottom">
        <div className="mx-2 mb-2 bg-white/90 backdrop-blur-2xl border border-neutral-200/60 rounded-2xl px-2 py-1.5 shadow-[0_-4px_32px_rgba(0,0,0,0.08)] flex items-center justify-around gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-300 touch-manipulation min-w-[64px] no-underline ${
                  active
                    ? 'text-orange-500'
                    : 'text-neutral-400'
                }`}
                aria-current={active ? 'page' : undefined}
                style={{ textDecoration: 'none' }}
              >
                <div className="relative">
                  {active && (
                    <div className="absolute -inset-1.5 bg-orange-500/10 rounded-lg animate-scale-in" />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 transition-all duration-300 ${active ? 'text-orange-500 scale-110' : ''}`} />
                </div>
                <span className={`text-[9px] font-display font-bold tracking-wide transition-colors duration-300 ${active ? 'text-orange-500' : 'text-neutral-400'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
      
      <main className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-10 relative z-10 overflow-x-hidden pb-24 sm:pb-0">
        {children}
      </main>
    </div>
  )
}
