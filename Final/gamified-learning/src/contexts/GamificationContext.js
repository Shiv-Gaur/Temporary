import React, { createContext, useState } from 'react';

export const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);

  // Example: Call this function when a challenge or quiz is completed
  const addPoints = (newPoints) => {
    setPoints((prev) => prev + newPoints);
    // Award a badge if a threshold is crossed (example threshold: 100 points)
    if (points + newPoints >= 100 && !badges.includes('Beginner')) {
      setBadges((prev) => [...prev, 'Beginner']);
    }
  };

  return (
    <GamificationContext.Provider value={{ points, badges, addPoints }}>
      {children}
    </GamificationContext.Provider>
  );
};
