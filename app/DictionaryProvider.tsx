"use client";

import { usePathname } from "next/navigation";
import { createContext, ReactNode, useContext, useMemo } from "react";
import enDictionary from './dictionaries/en.json'
import itDictionary from './dictionaries/it.json'

const DictionaryContext = createContext<Record<string, any> | null>(null);

export const useDictionary = () => {
  const dictionary = useContext(DictionaryContext);

  const t = (key: string) => {
    // Fallback to key if dictionary or key is not found
    return dictionary?.[key] || key;
  };

  return t;
};

export const DictionaryProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const locales = ["en", "it"];
  const dictionaries = {
    it: itDictionary,
    en: enDictionary
  }

  function getLocaleFromPathname(pathname: string) {
    // Find the locale in the pathname by checking if it starts with any supported locale
    const locale = locales.find(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    return locale || null; // Return the locale if found, otherwise return null
  }

  const language = useMemo(() => getLocaleFromPathname(pathname), [pathname]);
  const value = useMemo(() => dictionaries[language as keyof typeof dictionaries], [language]);

  return (
    <DictionaryContext.Provider value={dictionaries['it']}>
      {children}
    </DictionaryContext.Provider>
  );
};
