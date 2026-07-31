import { WarningCircle, ArrowsClockwise } from '@/src/components/ui/Icons';
import { motion } from 'motion/react';
import { Component, ErrorInfo, ReactNode } from 'react';

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
              <WarningCircle size={32} weight="duotone" className="text-[#ff5f56]" />
            </div>
            <h2 className="text-xl font-medium mb-3 text-white">Bir Şeyler Ters Gitti</h2>
            <p className="text-text-muted text-[14px] mb-4 leading-relaxed">
              Bu alan yüklenirken beklenmedik bir hata oluştu.
            </p>
            {this.state.error && (
              <div className="mb-6 p-3 bg-black/40 border border-white/10 rounded-xl text-left w-full overflow-x-auto max-h-40 text-xs font-mono text-[#ff5f56]">
                <p className="font-bold">{this.state.error.toString()}</p>
                {this.state.error.stack && (
                  <pre className="text-[10px] text-gray-400 mt-1 whitespace-pre-wrap opacity-80">{this.state.error.stack}</pre>
                )}
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="flex items-center justify-center space-x-2 w-full py-3 bg-white/[0.04] hover:bg-white/10 text-white rounded-xl transition-all border border-white/[0.06] hover:border-white/[0.12]"
            >
              <ArrowsClockwise size={16} weight="duotone" />
              <span className="text-[14px] font-medium">Yeniden Yükle</span>
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }


}
