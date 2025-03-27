import { createContext, useContext } from 'react';

export type Language = 'it' | 'en';

export const translations = {
  it: {
    login: 'Accedi',
    buyToday: 'compra oggi',
    payTomorrow: 'paga domani',
    customerArea: 'Area Cliente',
    partnerArea: 'Area Partner',
    storeArea: 'Area Negozio',
    searchStores: 'Cerca negozi vicino a te',
    nearbyStores: 'Negozi nelle vicinanze',
    categories: {
      jewelry: 'Gioiellerie',
      gourmet: 'Ristoranti Gourmet',
      cars: 'Concessionari Auto',
      furniture: 'Arredamento',
      electronics: 'Elettronica',
      travel: 'Viaggi',
    },
  },
  en: {
    login: 'Login',
    buyToday: 'buy today',
    payTomorrow: 'pay tomorrow',
    customerArea: 'Customer Area',
    partnerArea: 'Partner Area',
    storeArea: 'Store Area',
    searchStores: 'Search stores near you',
    nearbyStores: 'Nearby Stores',
    categories: {
      jewelry: 'Jewelry',
      gourmet: 'Gourmet Restaurants',
      cars: 'Car Dealerships',
      furniture: 'Furniture',
      electronics: 'Electronics',
      travel: 'Travel',
    },
  },
};

export const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
}>({
  language: 'it',
  setLanguage: () => {},
});

export const useTranslation = () => {
  const { language } = useContext(LanguageContext);
  return translations[language];
};