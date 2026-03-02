import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error: Error | null; errorInfo: string | null }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo: errorInfo.componentStack || null })
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border-2 border-black rounded-2xl p-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="w-14 h-14 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-xl font-display font-bold text-neutral-900 tracking-tight mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-neutral-500 font-accent leading-relaxed mb-6">
              {this.state.error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
            </p>
            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="mb-5 text-left">
                <summary className="text-xs font-mono text-neutral-400 cursor-pointer hover:text-neutral-600 mb-2">
                  View error details
                </summary>
                <pre className="text-[10px] font-mono text-red-600 bg-red-50 p-3 rounded-xl overflow-auto max-h-32 border border-red-100">
                  {this.state.errorInfo}
                </pre>
              </details>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl font-display font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 border-2 border-black text-black rounded-xl font-display font-bold text-sm uppercase tracking-wider hover:bg-neutral-50 transition-all active:scale-95"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
