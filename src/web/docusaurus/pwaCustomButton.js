if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    const pwaBtn = document.querySelector('#pwa-button');

    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    window.deferredPrompt = e;

    // Display A2HS button if app not installed
    pwaBtn.hidden = false;

    pwaBtn.addEventListener('click', () => {
      // hide our user interface that shows our A2HS button
      pwaBtn.hidden = true;

      const promptEvent = window.deferredPrompt;

      // Do nothing if deferredPrompt doesn't exist
      if (!promptEvent) return;

      // Show the prompt
      promptEvent.prompt().catch((err) => {
        console.error(err);
      });

      // Reset the deferred prompt variable
      window.deferredPrompt = null;
    });
  });
}
