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
    <div className="min-h-screen min-h-[100dvh] bg-[#f5f5f5] text-black selection:bg-orange-500/10 selection:text-orange-600 overflow-x-hidden w-full max-w-[100vw]">
      <Suspense fallback={null}>
        <GLSLHills />
      </Suspense>

      {/* Top navigation */}
      <nav className="sticky top-0 z-[100] w-full px-4 sm:px-6 py-4 safe-top bg-[#f5f5f5]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group no-underline" style={{ textDecoration: 'none' }}>
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-orange-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-full h-full bg-gradient-to-br from-neutral-900 to-black rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-105">
                <Sparkles className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-display font-extrabold tracking-tight leading-none text-black" style={{ fontWeight: 800 }}>RAJ AI UI</h1>
              <span className="text-[10px] font-display font-semibold text-neutral-400 tracking-wider uppercase leading-none">Component Engine</span>
            </div>
          </Link>

          {/* Navigation buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-5 py-2.5 rounded-full text-sm font-display font-semibold transition-all duration-300 flex items-center gap-2 touch-manipulation no-underline ${
                    active
                      ? 'bg-neutral-900 text-white shadow-lg'
                      : 'text-neutral-600 hover:text-black hover:bg-white/80'
                  }`}
                  aria-current={active ? 'page' : undefined}
                  style={{ textDecoration: 'none' }}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-orange-500' : ''}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] sm:hidden safe-bottom">
        <div className="mx-3 mb-3 bg-white/95 backdrop-blur-2xl border-2 border-neutral-200 rounded-2xl px-2 py-2 shadow-[0_-8px_40px_rgba(0,0,0,0.1)] flex items-center justify-around gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-5 py-2.5 rounded-xl transition-all duration-300 touch-manipulation min-w-[72px] no-underline ${
                  active
                    ? 'text-orange-500 bg-orange-50'
                    : 'text-neutral-400'
                }`}
                aria-current={active ? 'page' : undefined}
                style={{ textDecoration: 'none' }}
              >
                <div className="relative">
                  {active && (
                    <div className="absolute -inset-2 bg-orange-500/10 rounded-lg animate-scale-in" />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 transition-all duration-300 ${active ? 'text-orange-500 scale-110' : ''}`} />
                </div>
                <span className={`text-[10px] font-display font-bold tracking-wide transition-colors duration-300 ${active ? 'text-orange-500' : 'text-neutral-400'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
      
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-0 relative z-10 overflow-x-hidden pb-24 sm:pb-8">
        {children}
      </main>
    </div>
  )
}
