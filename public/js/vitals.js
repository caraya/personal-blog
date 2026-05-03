import { onCLS, onINP, onLCP } from '/js/web-vitals.js';

function logMetric(metric) {
  console.log(`Metric: ${metric.name} | Value: ${Math.round(metric.value)} | Rating: ${metric.rating}`);
}

export function initializeLocalWebVitals() {
  onCLS(logMetric);
  onINP(logMetric);
  onLCP(logMetric);
}

initializeLocalWebVitals();
