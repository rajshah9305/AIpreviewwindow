import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Error boundary caught error:', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#faf8f6] flex items-center justify-center p-6">
          <div className="max-w-sm w-full bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-neutral-100/60 p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-5 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-500" />
            </div>
            
            <h1 className="text-lg font-display font-bold text-neutral-900 mb-2 tracking-tight">
              Something went wrong
            </h1>
            
            <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
              An unexpected error occurred. Your data is safe.
            </p>
            
            {this.state.error && (
              <div className="mb-6 p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-left">
                <p className="text-[10px] font-mono text-neutral-500 break-all leading-relaxed">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <button
              onClick={this.handleReset}
              className="w-full px-6 py-3 bg-neutral-900 text-white rounded-xl font-display font-bold text-xs uppercase tracking-[0.06em] hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
