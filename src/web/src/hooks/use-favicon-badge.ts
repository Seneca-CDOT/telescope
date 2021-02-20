import { useState, useEffect, useCallback } from 'react';
import { useMountedState } from 'react-use';
import useVisibility from './use-visibility';

import { logoUrl, logoBadgedUrl } from '../components/Logo';

const useFaviconBadge = () => {
  const isMounted = useMountedState();
  const [logo, setLogo] = useState(logoUrl);
  const isVisible = useVisibility();

  // When the logo state changes, update favicon
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (link) {
      link.type = 'image/svg+xml';
      link.rel = 'icon';
      link.href = logo;
    }
  }, [logo]);

  // Manage the transition to visible, and reset the logo.
  useEffect(() => {
    if (isVisible) {
      setLogo(logoUrl);
    }
  }, [isVisible]);

  // Provide a way for users to hint that the badge should be set.
  // We ignore this if the we're not mounted, or page isn't visible.
  const setBadgeHint = useCallback(() => {
    if (!isMounted()) {
      return;
    }
    if (!isVisible) {
      setLogo(logoBadgedUrl);
    }
  }, [isMounted, isVisible]);

  return setBadgeHint;
};

export default useFaviconBadge;
