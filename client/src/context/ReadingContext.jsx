import React, { createContext, useContext, useState, useEffect } from 'react';

const ReadingContext = createContext();

export const ReadingProvider = ({ children }) => {
  // Theme: light, dark, emerald
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('quranlens_theme') || 'light';
  });

  // Arabic Font Size (in pixels)
  const [arabicFontSize, setArabicFontSize] = useState(() => {
    return Number(localStorage.getItem('quranlens_arabic_size')) || 32;
  });

  // Translation Font Size (in pixels)
  const [translationFontSize, setTranslationFontSize] = useState(() => {
    return Number(localStorage.getItem('quranlens_trans_size')) || 16;
  });

  // Show translations toggles
  const [showUrdu, setShowUrdu] = useState(() => {
    const saved = localStorage.getItem('quranlens_show_urdu');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [showEnglish, setShowEnglish] = useState(() => {
    const saved = localStorage.getItem('quranlens_show_english');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Reading Mode: 'standard' | 'focus' | 'side-by-side'
  const [readingMode, setReadingMode] = useState(() => {
    return localStorage.getItem('quranlens_reading_mode') || 'standard';
  });

  // Sync theme with document class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('quranlens_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('quranlens_arabic_size', arabicFontSize);
  }, [arabicFontSize]);

  useEffect(() => {
    localStorage.setItem('quranlens_trans_size', translationFontSize);
  }, [translationFontSize]);

  useEffect(() => {
    localStorage.setItem('quranlens_show_urdu', JSON.stringify(showUrdu));
  }, [showUrdu]);

  useEffect(() => {
    localStorage.setItem('quranlens_show_english', JSON.stringify(showEnglish));
  }, [showEnglish]);

  useEffect(() => {
    localStorage.setItem('quranlens_reading_mode', readingMode);
  }, [readingMode]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ReadingContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        arabicFontSize,
        setArabicFontSize,
        translationFontSize,
        setTranslationFontSize,
        showUrdu,
        setShowUrdu,
        showEnglish,
        setShowEnglish,
        readingMode,
        setReadingMode,
      }}
    >
      {children}
    </ReadingContext.Provider>
  );
};

export const useReading = () => {
  const context = useContext(ReadingContext);
  if (!context) {
    throw new Error('useReading must be used within a ReadingProvider');
  }
  return context;
};
