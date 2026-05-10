import { onCLS, onINP, onLCP } from '/js/web-vitals.js';

function sendDistinctToGoogleAnalytics(metric) {
  if (typeof window.gtag !== 'function') return;

  const params = {
    metric_id: metric.id,         // Crucial for deduplication
    metric_rating: metric.rating, // 'good', 'needs-improvement', or 'poor'
  };

  // Route the value to a specific parameter based on the metric name
  if (metric.name === 'CLS') {
    params.cls_value = metric.delta;             // Sent as standard decimal
  } else if (metric.name === 'INP') {
    params.inp_value = Math.round(metric.delta); // Sent as milliseconds
  } else if (metric.name === 'LCP') {
    params.lcp_value = Math.round(metric.delta); // Sent as milliseconds
  }

  window.gtag('event', 'web_vitals', params);
}

export function initializeLocalWebVitals() {
  onCLS(sendDistinctToGoogleAnalytics);
  onINP(sendDistinctToGoogleAnalytics);
  onLCP(sendDistinctToGoogleAnalytics);
}

initializeLocalWebVitals();
