import { ReactNode, lazy, Suspense, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, History, Settings, Wand2 } from 'lucide-react'

const GLSLHills = lazy(() =>
  import('./ui/glsl-hills').then(m => ({ default: m.GLSLHills }))
)

interface LayoutProps { children: ReactNode }

const NAV_ITEMS = [
  { path: '/generator', label: 'Generate', icon: Wand2 },
  { path: '/history',   label: 'History',  icon: History },
  { path: '/settings',  label: 'Settings', icon: Settings },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen min-h-[100dvh] bg-surface text-neutral-900 overflow-x-hidden w-full">
      <Suspense fallback={null}>
        <GLSLHills />
      </Suspense>

      {/* ── Top nav ── */}
      <header role="banner" className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-3 sm:px-4 pt-3 pointer-events-none">
        <nav
          aria-label="Main navigation"
          className={`
            pointer-events-auto w-full max-w-3xl
            animate-slide-up transition-all duration-300
            bg-white/90 backdrop-blur-2xl rounded-full overflow-hidden
            border border-black
            ${scrolled ? 'shadow-nav' : 'shadow-glass'}
          `}
        >
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 gap-3">

            {/* Logo */}
            <Link
              to="/generator"
              className="flex items-center gap-2 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 rounded-lg"
              aria-label="RAJ AI UI — home"
            >
              <div className="w-8 h-8 bg-neutral-900 rounded-[10px] flex items-center justify-center shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-orange-500 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-orange-400 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
              </div>
              <div className="hidden xs:flex flex-col leading-none gap-0.5">
                <span className="text-[13px] font-display font-700 tracking-tight text-neutral-900 group-hover:text-orange-500 transition-colors whitespace-nowrap">
                  RAJ AI UI
                </span>
                <span className="text-[9px] font-accent font-600 text-neutral-400 tracking-widest uppercase group-hover:text-orange-400 transition-colors whitespace-nowrap">
                  Component Engine
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="flex items-center gap-0.5 bg-black/[0.04] rounded-full p-1" role="list">
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
                const active = isActive(path)
                return (
                  <Link
                    key={path}
                    to={path}
                    role="listitem"
                    aria-current={active ? 'page' : undefined}
                    className={`
                      flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full
                      text-[12px] sm:text-[13px] font-accent font-600 whitespace-nowrap
                      transition-all duration-200
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40
                      ${active
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/70'
                      }
                    `}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-orange-400' : ''}`}
                      aria-hidden="true"
                    />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                )
              })}
            </div>

          </div>
        </nav>
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-[110] sm:hidden"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.75rem)' }}
      >
        <div className="mx-3 mb-3 glass border-white/50 rounded-[1.5rem] px-2 py-1.5 shadow-premium flex items-center justify-around">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const active = isActive(path)
            return (
              <Link
                key={path}
                to={path}
                aria-current={active ? 'page' : undefined}
                className={`
                  flex flex-col items-center gap-1 px-5 py-2 rounded-2xl
                  transition-all duration-200 touch-manipulation min-w-[68px]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40
                  ${active ? 'bg-neutral-900' : 'hover:bg-neutral-100/60'}
                `}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${active ? 'text-orange-400' : 'text-neutral-400'}`}
                  aria-hidden="true"
                />
                <span className={`text-[10px] font-accent font-700 tracking-wide uppercase transition-colors ${active ? 'text-white' : 'text-neutral-400'}`}>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ── Main content ── */}
      <main
        id="main-content"
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 relative z-10 overflow-x-hidden pb-40 sm:pb-28 pt-[4.5rem]"
      >
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
