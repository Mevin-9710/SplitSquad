type EventParams = Record<string, string | number | boolean>;

export function trackEvent(name: string, params?: EventParams) {
  if (typeof window === "undefined") return;
  try {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", name, params);
    }
    if (typeof (window as any).dataLayer !== "undefined") {
      (window as any).dataLayer.push({ event: name, ...params });
    }
  } catch {
    /* analytics unavailable */
  }
}

export function trackClick(label: string, category?: string) {
  trackEvent("click", {
    event_category: category || "engagement",
    event_label: label,
  });
}

export function trackConversion(label: string, value?: number) {
  trackEvent("conversion", {
    event_label: label,
    value: value || 0,
    currency: "INR",
  });
}
