// Custom hook wrapped around https://github.com/GoogleChromeLabs/page-lifecycle
import { useState } from 'react';
import { useEvent } from 'react-use';
import lifecycle from 'page-lifecycle';

const usePageLifecycle = () => {
  const stateIsVisible = (state) => state === 'active' || state === 'passive';

  const [isVisible, setIsVisible] = useState(stateIsVisible(lifecycle.state));

  const stateChangeHandler = (event) => {
    // If the page is now visible and previously was not, update our internal state
    if (stateIsVisible(event.newState) && !stateIsVisible(event.oldState)) {
      setIsVisible(true);
      return;
    }

    // If the page is now not visible and previously was, update our internal state
    if (!stateIsVisible(event.newState) && stateIsVisible(event.oldState)) {
      setIsVisible(false);
    }
  };

  useEvent('statechange', stateChangeHandler, lifecycle);

  return isVisible;
};

export default usePageLifecycle;
