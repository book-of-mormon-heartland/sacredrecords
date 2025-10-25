import { createContext, useContext, useState } from  "react";
import en from '.././i18n/en.json';
import fr from '.././i18n/fr.json';
import es from '.././i18n/es.json';

const translations = {
    en,
    fr,
    es
};

export const I18nContext = createContext({
    language: 'en',
    setLanguage: () => {},
    translate: (key) => key // Default function to prevent errors
});


export const I18nProvider = ({ children }) => {
    const [language, setLanguage] = useState("en");

    // The core translation function
    const translate = (key) => {
        // Fallback to English if the current language doesn't have the key
        return translations[language][key] || translations['en'][key] || key;
    };

    return (
        <I18nContext.Provider value={{ language, setLanguage, translate }}>
            {children}
        </I18nContext.Provider>
    );
}

// Custom hook for easier access
export const useI18n = () => useContext(I18nContext);