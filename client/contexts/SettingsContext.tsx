import React, { createContext, useContext, useState } from 'react';

interface SettingsContextType {
  isOpen: boolean;
  currentSection: string;
  openSettings: (section?: string) => void;
  closeSettings: () => void;
  setSection: (section: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('my-account');

  const openSettings = (section = 'my-account') => {
    console.log('🔧 openSettings called with section:', section);
    setCurrentSection(section);
    setIsOpen(true);
    console.log('✅ isOpen set to true');
  };

  const closeSettings = () => {
    console.log('❌ closeSettings called');
    setIsOpen(false);
  };

  const setSection = (section: string) => {
    console.log('📄 setSection called:', section);
    setCurrentSection(section);
  };

  console.log('🔄 SettingsContext state:', { isOpen, currentSection });

  return (
    <SettingsContext.Provider value={{ isOpen, currentSection, openSettings, closeSettings, setSection }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsModal() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsModal must be used within SettingsProvider');
  }
  return context;
}