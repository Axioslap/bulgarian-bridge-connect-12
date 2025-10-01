import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

function getConnectionSpeed() {
  return 'connection' in navigator &&
    navigator['connection'] &&
    'effectiveType' in (navigator['connection'] as any)
    ? (navigator['connection'] as any)['effectiveType']
    : '';
}

interface AnalyticsOptions {
  params?: Record<string, string>;
  path?: string;
  analyticsId?: string;
  debug?: boolean;
}

function sendToAnalytics(metric: Metric, options: AnalyticsOptions) {
  const page = Object.entries(options.params || {})
    .reduce((acc, [key, value]) => acc.replace(new RegExp(`:${key}`, 'g'), value), options.path || '');

  const body = {
    dsn: options.analyticsId,
    id: metric.id,
    page,
    href: location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  };

  if (options.debug) {
    console.log('[Web Vitals]', metric.name, metric.value);
  }

  const blob = new Blob([new URLSearchParams(body).toString()], {
    type: 'application/x-www-form-urlencoded',
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob);
  } else {
    fetch(vitalsUrl, {
      body: blob,
      method: 'POST',
      credentials: 'omit',
      keepalive: true,
    });
  }
}

export function webVitals(options: AnalyticsOptions = {}) {
  try {
    onINP((metric) => sendToAnalytics(metric, options));
    onTTFB((metric) => sendToAnalytics(metric, options));
    onLCP((metric) => sendToAnalytics(metric, options));
    onCLS((metric) => sendToAnalytics(metric, options));
    onFCP((metric) => sendToAnalytics(metric, options));
  } catch (err) {
    console.error('[Web Vitals]', err);
  }
}
