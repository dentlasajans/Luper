import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  children?: ReactNode;
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
    console.error('Uncaught error:', error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-surface-base text-[#f5f5f7]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 max-w-md w-full flex flex-col items-center shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#ff5f56]/10 flex items-center justify-center mb-6 border border-[#ff5f56]/20">
              <AlertCircle size={32} className="text-[#ff5f56]" />
            </div>
            <h2 className="text-xl font-medium mb-3 text-white">Bir Şeyler Ters Gitti</h2>
            <p className="text-text-muted text-[13px] mb-8 leading-relaxed">
              Bu alan yüklenirken beklenmedik bir hata oluştu.
            </p>
            <button
              onClick={this.handleReload}
              className="flex items-center justify-center space-x-2 w-full py-3 bg-white/[0.04] hover:bg-white/10 text-white rounded-xl transition-all border border-white/[0.06] hover:border-white/[0.12]"
            >
              <RefreshCw size={16} />
              <span className="text-[13px] font-medium">Yeniden Yükle</span>
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
