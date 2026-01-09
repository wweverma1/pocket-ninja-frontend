import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../services/analytics';

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Tracks page view whenever the route changes
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

export default AnalyticsTracker;