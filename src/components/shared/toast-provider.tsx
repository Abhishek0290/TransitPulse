import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'info': return <Info className="w-5 h-5 text-blue-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getToastColors = (type: string) => {
    switch (type) {
      case 'success': return {
        background: 'from-green-500/20 to-green-400/20',
        border: 'border-green-400/30',
        text: 'text-green-400'
      };
      case 'error': return {
        background: 'from-red-500/20 to-red-400/20',
        border: 'border-red-400/30',
        text: 'text-red-400'
      };
      case 'info': return {
        background: 'from-blue-500/20 to-blue-400/20',
        border: 'border-blue-400/30',
        text: 'text-blue-400'
      };
      default: return {
        background: 'from-blue-500/20 to-blue-400/20',
        border: 'border-blue-400/30',
        text: 'text-blue-400'
      };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => {
            const colors = getToastColors(toast.type);
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`p-4 bg-gradient-to-r ${colors.background} ${colors.border} border rounded-lg backdrop-blur-sm shadow-lg`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getToastIcon(toast.type)}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${colors.text}`}>
                      {toast.message}
                    </p>
                  </div>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}