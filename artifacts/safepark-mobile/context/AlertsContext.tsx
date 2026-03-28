import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { generateInitialAlerts, generateNewAlert, type ParkingAlert } from '@/constants/mockAlerts';

interface AlertsContextValue {
  alerts: ParkingAlert[];
  pendingAlerts: ParkingAlert[];
  resolvedAlerts: ParkingAlert[];
  newAlertId: string | null;
  confirmAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  clearNew: () => void;
  stats: {
    criticalToday: number;
    confirmedToday: number;
    dismissedToday: number;
    avgResponseSeconds: number;
    camerasOnline: number;
  };
}

const AlertsContext = createContext<AlertsContextValue | null>(null);

const OPERATOR_NAME = 'Carlos M.';
const CAMERAS_ONLINE = 7;

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<ParkingAlert[]>(generateInitialAlerts());
  const [newAlertId, setNewAlertId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Simulate real-time alerts every 18–28 seconds
    const schedule = () => {
      const delay = 18000 + Math.random() * 10000;
      intervalRef.current = setTimeout(() => {
        const alert = generateNewAlert();
        setAlerts(prev => [alert, ...prev]);
        setNewAlertId(alert.id);
        Haptics.notificationAsync(
          alert.severity === 'critical'
            ? Haptics.NotificationFeedbackType.Error
            : Haptics.NotificationFeedbackType.Warning
        );
        schedule();
      }, delay);
    };
    schedule();
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, []);

  const confirmAlert = useCallback((id: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, status: 'confirmed', respondedAt: new Date(), respondedBy: OPERATOR_NAME }
          : a
      )
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, status: 'dismissed', respondedAt: new Date(), respondedBy: OPERATOR_NAME }
          : a
      )
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const clearNew = useCallback(() => setNewAlertId(null), []);

  const pendingAlerts = alerts.filter(a => a.status === 'pending');
  const resolvedAlerts = alerts.filter(a => a.status !== 'pending');

  const criticalToday = alerts.filter(a => a.severity === 'critical').length;
  const confirmedToday = alerts.filter(a => a.status === 'confirmed').length;
  const dismissedToday = alerts.filter(a => a.status === 'dismissed').length;

  return (
    <AlertsContext.Provider value={{
      alerts, pendingAlerts, resolvedAlerts, newAlertId,
      confirmAlert, dismissAlert, clearNew,
      stats: {
        criticalToday,
        confirmedToday,
        dismissedToday,
        avgResponseSeconds: 127,
        camerasOnline: CAMERAS_ONLINE,
      },
    }}>
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error('useAlerts must be used within AlertsProvider');
  return ctx;
}
