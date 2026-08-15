import posthog from 'posthog-js';

export function initPostHog() {
  const apiKey = import.meta.env.VITE_POSTHOG_KEY;
  const apiHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

  if (apiKey) {
    posthog.init(apiKey, {
      api_host: apiHost,
      person_profiles: 'identified_only',

      // Page-level analytics only
      capture_pageview: true,
      capture_pageleave: true,

      // Disable autocapture to prevent any chat text from being captured
      // in click events, form submissions, or DOM element snapshots
      autocapture: false,

      // Mask ALL text and attributes in session recordings
      // This ensures no WhatsApp message content, participant names,
      // emoji data, or any user-uploaded chat data is ever sent to PostHog
      mask_all_text: true,
      mask_all_element_attributes: true,

      // Disable session recording entirely — chat data is too sensitive
      disable_session_recording: true,

      // Do not capture IP address or detailed geolocation
      ip: false,

      // Disable toolbar to prevent any data inspector from loading
      advanced_disable_toolbar_metrics: true,
    });
  }
}

export { posthog };
