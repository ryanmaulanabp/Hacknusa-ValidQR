'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, LanguageCode } from './translations';
import { Transaction } from './types';
import { INITIAL_TRANSACTIONS } from './mockData';

interface AppContextType {
  isEnglish: boolean;
  language: LanguageCode;
  toggleLanguage: () => void;
  setLanguage: (isEng: boolean) => void;
  t: (key: string) => string;

  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Wallet Balance
  balance: number;
  isBalanceHidden: boolean;
  toggleBalanceHidden: () => void;
  deductBalance: (amount: number, merchantTitle: string, nmid: string) => boolean;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isEnglish, setIsEnglish] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [balance, setBalance] = useState(5250000);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Restore local storage if available
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('nusapay_lang');
      if (savedLang) setIsEnglish(savedLang === 'en');

      const savedTheme = localStorage.getItem('nusapay_theme');
      if (savedTheme) setIsDarkMode(savedTheme === 'dark');

      const savedBalance = localStorage.getItem('nusapay_balance');
      if (savedBalance) setBalance(Number(savedBalance));
    } catch {}
  }, []);

  const toggleLanguage = () => {
    setIsEnglish(prev => {
      const next = !prev;
      localStorage.setItem('nusapay_lang', next ? 'en' : 'id');
      return next;
    });
  };

  const setLanguage = (isEng: boolean) => {
    setIsEnglish(isEng);
    localStorage.setItem('nusapay_lang', isEng ? 'en' : 'id');
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('nusapay_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const toggleBalanceHidden = () => {
    setIsBalanceHidden(prev => !prev);
  };

  const deductBalance = (amount: number, merchantTitle: string, nmid: string): boolean => {
    if (balance < amount) return false;
    const newBal = balance - amount;
    setBalance(newBal);
    localStorage.setItem('nusapay_balance', newBal.toString());

    const newTx: Transaction = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      title: merchantTitle,
      merchantName: merchantTitle,
      nmid,
      date: 'Hari ini, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      amount,
      type: 'debit',
      status: 'SUCCESS',
      category: 'Pembayaran QRIS',
    };
    setTransactions(prev => [newTx, ...prev]);
    return true;
  };

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
  };

  const language: LanguageCode = isEnglish ? 'en' : 'id';

  const t = (key: string): string => {
    return translations[key]?.[language] ?? key;
  };

  return (
    <AppContext.Provider
      value={{
        isEnglish,
        language,
        toggleLanguage,
        setLanguage,
        t,
        isDarkMode,
        toggleTheme,
        balance,
        isBalanceHidden,
        toggleBalanceHidden,
        deductBalance,
        transactions,
        addTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
