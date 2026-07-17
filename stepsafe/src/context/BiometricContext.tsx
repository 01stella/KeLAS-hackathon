import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of our global state
interface BiometricContextType {
  bpm: number;
  setBpm: (val: number) => void;
  isAbnormal: boolean;
  statusColor: string;
}

// Create the Context
export const BiometricContext = createContext<BiometricContextType>({
  bpm: 76,
  setBpm: () => {},
  isAbnormal: false,
  statusColor: '#10B981', // Safe Green
});

// Create the Provider Wrapper
export const BiometricProvider = ({ children }: { children: ReactNode }) => {
  const [bpm, setBpm] = useState(76);
  
  // Calculate safety status globally
  const isAbnormal = bpm < 40 || bpm > 160;
  const statusColor = isAbnormal ? '#EF4444' : '#10B981'; // Red if danger, Green if safe

  return (
    <BiometricContext.Provider value={{ bpm, setBpm, isAbnormal, statusColor }}>
      {children}
    </BiometricContext.Provider>
  );
};

// Custom hook for easy access
export const useBiometrics = () => useContext(BiometricContext);