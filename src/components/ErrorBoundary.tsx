import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props  { children: ReactNode; fallback?: ReactNode }
interface State  { hasError: boolean; error: Error | null; errorInfo: string | null }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ errorInfo: info.componentStack ?? null })
    if (import.meta.env.DEV) console.error('ErrorBoundary:', error, info)
  }

  handleReset = () => this.setState({ hasError: false, error: null, errorInfo: null })

  render() {
    if (!this.state.hasError) return this.props.children
    if (this.props.fallback)  return this.props.fallback

    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-black/[0.07] rounded-2xl p-8 text-center shadow-card">
          <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5" aria-hidden="true">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-lg font-display font-700 text-neutral-900 tracking-tight mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-neutral-500 font-accent leading-relaxed mb-6">
            {this.state.error?.message ?? 'An unexpected error occurred. Please try refreshing.'}
          </p>

          {import.meta.env.DEV && this.state.errorInfo && (
            <details className="mb-5 text-left">
              <summary className="text-xs font-mono text-neutral-400 cursor-pointer hover:text-neutral-600 mb-2">
                Error details
              </summary>
              <pre className="text-[10px] font-mono text-red-600 bg-red-50 p-3 rounded-xl overflow-auto max-h-32 border border-red-100">
                {this.state.errorInfo}
              </pre>
            </details>
          )}

          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="btn-primary flex-1 rounded-xl text-xs uppercase tracking-widest"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary flex-1 rounded-xl text-xs uppercase tracking-widest"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    )
  }
}
