import { Toaster } from "sonner@2.0.3";

export function ToastProvider() {
  return (
    <Toaster
      theme="dark"
      position="top-center"
      toastOptions={{
        style: {
          background: 'var(--card)',
          color: 'var(--card-foreground)',
          border: '1px solid var(--border)',
        },
      }}
    />
  );
}