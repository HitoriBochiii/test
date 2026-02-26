import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-card rounded-xl border border-border">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Maaf, terjadi kesalahan saat memuat komponen ini. Silakan coba muat ulang halaman.
          </p>
          <div className="flex gap-3">
            <Button onClick={this.handleReset} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </Button>
            <Button onClick={() => window.location.reload()} className="gap-2">
              Muat Ulang Halaman
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 p-4 bg-muted rounded-lg text-sm max-w-full overflow-auto">
              <summary className="cursor-pointer text-muted-foreground mb-2">
                Detail Error (Development Only)
              </summary>
              <pre className="text-destructive whitespace-pre-wrap">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
