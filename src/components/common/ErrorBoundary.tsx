import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Tribe Saarthi portal:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof caches !== 'undefined') {
      caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).finally(() => {
        window.location.href = '/?_t=' + Date.now();
      });
    } else {
      window.location.href = '/?_t=' + Date.now();
    }
  };

  private handleReload = () => {
    if (typeof caches !== 'undefined') {
      caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).finally(() => {
        window.location.href = window.location.pathname + (window.location.search ? window.location.search + '&_t=' : '?_t=') + Date.now();
      });
    } else {
      window.location.href = window.location.pathname + (window.location.search ? window.location.search + '&_t=' : '?_t=') + Date.now();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <main
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900"
        >
          <div className="max-w-xl w-full bg-white rounded-xl shadow-lg border border-red-200 p-6 md:p-8 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">
                  System Exception
                </span>
                <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The portal encountered an unexpected application error. Your session data is safely preserved.
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="bg-slate-900 text-slate-100 rounded-lg p-3 text-xs font-mono overflow-x-auto max-h-40">
                <div className="text-red-400 font-bold mb-1">
                  {this.state.error.name}: {this.state.error.message}
                </div>
                <div className="text-slate-400 whitespace-pre-wrap">{this.state.error.stack}</div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 min-h-[44px]"
              >
                <Home className="w-4 h-4" />
                Return to Home
              </button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
