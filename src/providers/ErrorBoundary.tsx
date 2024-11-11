// src/providers/ErrorBoundary.tsx

'use client';
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Wallet error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('walletName');
   
      this.setState({ hasError: false, error: undefined });
      window.location.reload(); 
    } catch (error) {
      console.error('Reset error:', error);
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <h2 className="text-sm font-medium">Something went wrong with wallet connection</h2>
          </div>
          <p className="text-xs mt-1 text-destructive/80">
            {this.state.error?.message}
          </p>
          <button 
            onClick={this.handleReset}
            className="mt-2 text-xs underline hover:text-destructive/80 transition-colors"
          >
            Reset and try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}