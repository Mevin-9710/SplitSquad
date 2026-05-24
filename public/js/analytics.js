window.SplitSquadAnalytics = {
  track(event, params = {}) {
    try {
      if (typeof gtag === 'function') {
        gtag('event', event, params);
      }
    } catch (e) {
      // silently fail
    }
  },
  setUserProperties(props) {
    try {
      if (typeof gtag === 'function') {
        gtag('set', 'user_properties', props);
      }
    } catch (e) {
      // silently fail
    }
  },
  fireQueued() {
    try {
      const queue = window.__ga4Queue || [];
      while (queue.length) {
        const item = queue.shift();
        this.track(item.event, item.params);
      }
    } catch (e) {
      // silently fail
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.SplitSquadAnalytics.fireQueued());
} else {
  window.SplitSquadAnalytics.fireQueued();
}
