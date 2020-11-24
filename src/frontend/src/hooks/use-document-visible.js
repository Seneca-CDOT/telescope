const isOnline = () => {
  if (typeof navigator !== 'undefined') {
    if (navigator.onLine !== 'undefined') {
      return navigator.onLine;
    }
  }
  // always assume it's online
  return true;
};

const isDocumentVisible = () => {
  if (typeof window !== 'undefined') {
    if (typeof document !== 'undefined' && typeof document.visibilityState !== 'undefined') {
      return document.visibilityState !== 'hidden';
    }
  }
  // always assume it's visible
  return true;
};

export default function useVisible() {
  return isOnline() && isDocumentVisible();
}
