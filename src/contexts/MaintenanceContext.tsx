import { createContext, useContext, useState, ReactNode } from 'react';

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  maintenanceMessage: string;
  estimatedEnd: string;
  setMaintenanceMode: (enabled: boolean) => void;
  setMaintenanceMessage: (msg: string) => void;
  setEstimatedEnd: (date: string) => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(() => {
    const saved = localStorage.getItem('maintenance_mode');
    return saved === 'true';
  });
  const [maintenanceMessage, setMaintenanceMessageState] = useState(() => {
    return localStorage.getItem('maintenance_message') || 'Website sedang dalam pemeliharaan. Silakan kunjungi kembali nanti.';
  });
  const [estimatedEnd, setEstimatedEndState] = useState(() => {
    return localStorage.getItem('maintenance_estimated_end') || '';
  });

  const setMaintenanceMode = (enabled: boolean) => {
    setIsMaintenanceMode(enabled);
    localStorage.setItem('maintenance_mode', String(enabled));
  };

  const setMaintenanceMessage = (msg: string) => {
    setMaintenanceMessageState(msg);
    localStorage.setItem('maintenance_message', msg);
  };

  const setEstimatedEnd = (date: string) => {
    setEstimatedEndState(date);
    localStorage.setItem('maintenance_estimated_end', date);
  };

  return (
    <MaintenanceContext.Provider value={{
      isMaintenanceMode,
      maintenanceMessage,
      estimatedEnd,
      setMaintenanceMode,
      setMaintenanceMessage,
      setEstimatedEnd,
    }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
}
