import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const AlertSystem = ({ data, onAlert, onNewNotification, theme = 'dark' }) => {
  const lastAlertRef = useRef({ emergency: 0, aqi: 0 });

  useEffect(() => {
    if (!data) return;
    const toastTheme = theme === 'light' ? 'light' : 'dark';
    const now = Date.now();
    
    // Alert logic with 30s cooldown per category
    if (data.emergency > 80 && now - lastAlertRef.current.emergency > 30000) {
      const msg = "🚨 CRITICAL EMERGENCY DETECTED: SECTOR-7";
      toast.error(msg, { theme: toastTheme });
      lastAlertRef.current.emergency = now;
      if(onAlert) onAlert();
      if(onNewNotification) onNewNotification({ type: 'error', message: msg, time: now });
    }

    if (data.aqi > 150 && now - lastAlertRef.current.aqi > 30000) {
      const msg = "🌫️ AQI ALERT: TOXICITY THRESHOLD EXCEEDED";
      toast.warn(msg, { theme: toastTheme });
      lastAlertRef.current.aqi = now;
      if(onAlert) onAlert();
      if(onNewNotification) onNewNotification({ type: 'warning', message: msg, time: now });
    }
  }, [data, onAlert, onNewNotification, theme]);

  return null; // Logic-only component since ToastContainer is in App.jsx
};

export default AlertSystem;
