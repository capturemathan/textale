import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { TexTaleProvider } from '@/store/textale-store';
import App from './App';
import './index.css';

interface Props {
  children?: ReactNode;
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
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFCF5] flex items-center justify-center p-4 font-sans text-[#24201D]">
          <div className="max-w-md bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgba(36,32,29,0.06)] border border-[#EADFD5]">
            <h2 className="text-2xl font-black mb-3">Something went wrong</h2>
            <p className="text-[#766F69] mb-6 font-medium leading-relaxed">{this.state.error?.message || "An unexpected error occurred."}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#F17141] text-white px-6 py-3.5 rounded-full font-bold hover:bg-[#e76537] transition shadow-[0_8px_20px_rgba(241,113,65,0.2)]"
            >
              Reload application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <TexTaleProvider>
          <App />
        </TexTaleProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
