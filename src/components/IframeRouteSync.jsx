import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Jab bhi dashboard ke andar route change ho, parent WordPress window ko
// batao taaki wo address bar update kar sake (sirf jab iframe ke andar chal raha ho)
export function IframeRouteSync() {
  const location = useLocation();

  useEffect(() => {
    // Agar app iframe ke andar nahi hai (direct vercel.app pe khula hai), kuch mat karo
    if (window.parent === window) return;

    window.parent.postMessage(
      {
        type: 'CUET_DASHBOARD_ROUTE_CHANGE',
        path: location.pathname + location.search,
      },
      '*' // production me isko apne WordPress domain se replace kar sakte ho: 'https://cuetpro.com'
    );
  }, [location]);

  return null;
}
