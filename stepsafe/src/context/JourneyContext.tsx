import React, { createContext, useState, useContext } from 'react';

// Create the context for journey history management
export const JourneyContext = createContext<any>(null);

export const JourneyProvider = ({ children }: any) => {
  // Initial dummy data for history list[cite: 5]
  const [history, setHistory] = useState([
    { 
      id: '1', 
      date: 'Today, 21:45', 
      origin: 'Universitas Multimedia Nusantara', 
      destination: 'Kos-kosan Melati', 
      duration: '14 mins', 
      status: 'Safe', 
      isAlert: false,
      pathImage: require('../../assets/images/historydummy/path1.png') 
    },
    { 
      id: '2', 
      date: 'Yesterday, 22:10', 
      origin: 'UI Campus Library', 
      destination: 'Stasiun MRT Dukuh Atas', 
      duration: '22 mins', 
      status: 'Anomaly Detected', 
      isAlert: true,
      pathImage: require('../../assets/images/historydummy/path1.png') 
    },
  ]);

  // Function to add a new journey record to the global history state
  const addJourney = (journey: any) => {
    setHistory((prevHistory) => [journey, ...prevHistory]);
  };

  return (
    <JourneyContext.Provider value={{ history, addJourney }}>
      {children}
    </JourneyContext.Provider>
  );
};

// Custom hook to access journey data easily
export const useJourney = () => useContext(JourneyContext);