export function useToast() {
  return {
    success: (message) => window.dispatchEvent(new CustomEvent('showToast', { detail: { type: 'success', message } })),
    error: (message) => window.dispatchEvent(new CustomEvent('showToast', { detail: { type: 'error', message } })),
    info: (message) => window.dispatchEvent(new CustomEvent('showToast', { detail: { type: 'info', message } })),
  };
}
