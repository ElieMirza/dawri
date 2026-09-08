import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, Platform, Text } from 'react-native';
import { Fonts } from '../constants/theme';
import i18n, { setStoredLanguage, getStoredLanguage } from '../i18n';

interface CheckIn {
  gameId: string;
  date: string;
  points: number;
}

interface AppState {
  favoriteTeam: string | null;
  points: number;
  checkIns: CheckIn[];
  language: 'en' | 'ar';
  isRTL: boolean;
}

interface AppContextType extends AppState {
  setFavoriteTeam: (teamId: string | null) => void;
  addCheckIn: (gameId: string) => void;
  redeemReward: (cost: number) => boolean;
  toggleLanguage: () => void;
  getTier: () => 'fan' | 'regular' | 'ultra' | 'legend';
  getTierProgress: () => { current: number; next: number; checkInsToNext: number };
}

const STORAGE_KEY = '@dawri_state';

const defaultState: AppState = {
  favoriteTeam: null,
  points: 0,
  checkIns: [],
  language: 'en',
  isRTL: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(defaultState);


  const applyLanguageChrome = (lang: 'en' | 'ar') => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.body?.classList.toggle('dawri-ar', lang === 'ar');
    }
    const T = Text as typeof Text & { defaultProps?: { style?: object } };
    T.defaultProps = T.defaultProps || {};
    T.defaultProps.style = {
      fontFamily: lang === 'ar' ? Fonts.arabic : Fonts.regular,
    };
  };

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const lang = await getStoredLanguage();
      
      if (stored) {
        const parsed = JSON.parse(stored);
        setState({ ...parsed, language: lang as 'en' | 'ar', isRTL: lang === 'ar' });
      } else {
        setState({ ...defaultState, language: lang as 'en' | 'ar', isRTL: lang === 'ar' });
      }
      
      i18n.changeLanguage(lang);
      applyLanguageChrome(lang as 'en' | 'ar');
    } catch (e) {
      console.error('Failed to load state', e);
    }
  };

  const saveState = async (newState: AppState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error('Failed to save state', e);
    }
  };

  const setFavoriteTeam = (teamId: string | null) => {
    const newState = { ...state, favoriteTeam: teamId };
    setState(newState);
    saveState(newState);
  };

  const addCheckIn = (gameId: string) => {
    const alreadyCheckedIn = state.checkIns.some(c => c.gameId === gameId);
    if (alreadyCheckedIn) return;

    const newCheckIn: CheckIn = {
      gameId,
      date: new Date().toISOString(),
      points: 1000,
    };

    const newState = {
      ...state,
      points: state.points + 1000,
      checkIns: [...state.checkIns, newCheckIn],
    };
    setState(newState);
    saveState(newState);
  };

  const redeemReward = (cost: number): boolean => {
    if (state.points < cost) return false;
    
    const newState = { ...state, points: state.points - cost };
    setState(newState);
    saveState(newState);
    return true;
  };

  const toggleLanguage = async () => {
    const newLang = state.language === 'en' ? 'ar' : 'en';
    const newRTL = newLang === 'ar';
    
    await setStoredLanguage(newLang);
    i18n.changeLanguage(newLang);
    applyLanguageChrome(newLang as 'en' | 'ar');

    if (I18nManager.isRTL !== newRTL) {
      I18nManager.allowRTL(newRTL);
      I18nManager.forceRTL(newRTL);
    }

    const newState = { ...state, language: newLang as 'en' | 'ar', isRTL: newRTL };
    setState(newState);
    saveState(newState);
  };

  const getTier = (): 'fan' | 'regular' | 'ultra' | 'legend' => {
    const count = state.checkIns.length;
    if (count >= 25) return 'legend';
    if (count >= 10) return 'ultra';
    if (count >= 3) return 'regular';
    return 'fan';
  };

  const getTierProgress = () => {
    const count = state.checkIns.length;
    const tier = getTier();
    
    const thresholds = {
      fan: { current: 0, next: 3 },
      regular: { current: 3, next: 10 },
      ultra: { current: 10, next: 25 },
      legend: { current: 25, next: 25 },
    };
    
    const { current, next } = thresholds[tier];
    return {
      current: count,
      next,
      checkInsToNext: Math.max(0, next - count),
    };
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setFavoriteTeam,
        addCheckIn,
        redeemReward,
        toggleLanguage,
        getTier,
        getTierProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
