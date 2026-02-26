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
      <nav className="sticky top-0 z-[100] w-full px-4 sm:px-6 py-4 safe-top bg-[#f5f5f5] border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/generator" className="flex items-center gap-3.5 group no-underline" style={{ textDecoration: 'none' }}>
            <div className="relative w-11 h-11">
              <div className="relative w-full h-full bg-black rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-md">
                <Sparkles className="w-5 h-5 text-[#f97316] group-hover:text-orange-400 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-display font-700 tracking-tighter leading-none text-black group-hover:text-brand-primary transition-all duration-300">RAJ AI UI</h1>
              <span className="text-[10px] font-accent font-600 text-neutral-400 tracking-widest uppercase leading-none group-hover:text-orange-500 transition-colors duration-300">Component Engine</span>
            </div>
          </Link>

          {/* Navigation buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-6 py-3 rounded-full text-sm font-accent transition-all duration-300 flex items-center gap-2.5 touch-manipulation no-underline tracking-snug ${
                    active
                      ? 'bg-black text-white shadow-lg shadow-neutral-900/10 font-600 scale-105'
                      : 'text-neutral-500 hover:text-black hover:bg-white hover:shadow-sm font-500 border border-transparent hover:border-neutral-200'
                  }`}
                  style={{ textDecoration: 'none' }}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 transition-all duration-300 ${active ? 'text-orange-500' : ''}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] sm:hidden safe-bottom">
        <div className="mx-6 mb-6 bg-white border border-neutral-200 rounded-[2.5rem] px-2 py-2 shadow-[0_20px_80px_rgba(0,0,0,0.15)] flex items-center justify-around gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl transition-all duration-300 touch-manipulation min-w-[64px] no-underline ${
                  active
                    ? 'text-white bg-black scale-[1.02]'
                    : 'text-neutral-400 hover:bg-neutral-50'
                }`}
                aria-current={active ? 'page' : undefined}
                style={{ textDecoration: 'none' }}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 relative z-10 transition-all duration-300 ${active ? 'text-[#f97316]' : ''}`} />
                </div>
                <span className={`text-[10px] font-accent tracking-widest uppercase transition-colors duration-300 font-700 ${active ? 'text-white' : 'text-neutral-400'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
      
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-0 relative z-10 overflow-x-hidden pb-80 sm:pb-48">
        {children}
      </main>
    </div>
  )
}
