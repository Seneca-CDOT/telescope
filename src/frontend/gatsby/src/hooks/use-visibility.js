import { useState, useEffect } from 'react';

const noop = function () {};

export default function useVisibility() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if we're running in the browser or server-side (e.g, build)
    if (typeof window === 'undefined') {
      return noop;
    }
    if (typeof document === 'undefined') {
      return noop;
    }

    const handleUpdate = () => setVisible(document.visibilityState === 'visible');

    // Use document vs. window for older Safari
    document.addEventListener('visibilitychange', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    // Set initial visibility state
    handleUpdate();

    // Cleanup our event listeners on tear-down
    return function () {
      document.removeEventListener('visibilitychange', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, []);

  return visible;
}
