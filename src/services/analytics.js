import ReactGA from "react-ga4";

// Initialize GA4 - Call this once in your app entry point
export const initGA = () => {
  const TRACKING_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID; // We will set this in Step 5
  if (TRACKING_ID) {
    ReactGA.initialize(TRACKING_ID);
  } else {
    console.warn("GA4 Tracking ID missing");
  }
};

// Track Page Views
export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Track Custom Events
export const trackEvent = (category, action, label = null, value = null) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};