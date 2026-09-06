import { createContext, useContext, useState, useCallback } from 'react';
import translations from '../data/translations.json';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [role, setRole] = useState(null); // 'healthWorker' | 'physician' | 'admin'
  const [userName, setUserName] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  }, []);

  const t = useCallback((key) => {
    const keys = key.split('.');
    let val = translations[language];
    for (const k of keys) {
      if (val && val[k] !== undefined) {
        val = val[k];
      } else {
        return key; // fallback to key
      }
    }
    return val;
  }, [language]);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  }, []);

  const logout = useCallback(() => {
    setRole(null);
    setUserName('');
    setCurrentPatient(null);
    setUploadedImage(null);
  }, []);

  const value = {
    theme, setTheme: toggleTheme,
    language, setLanguage, toggleLanguage,
    role, setRole,
    userName, setUserName,
    isOffline, setIsOffline,
    currentPatient, setCurrentPatient,
    uploadedImage, setUploadedImage,
    toastMessage, showToast,
    logout,
    t,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      <div className={`toast ${toastMessage ? 'show' : ''}`}>
        {toastMessage}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
