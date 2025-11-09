import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: { translation: { 
    'Settings': 'Settings', 'Friends': 'Friends', 'Profile': 'Profile',
    'My Account': 'My Account', 'Privacy & Safety': 'Privacy & Safety',
    'Voice & Audio': 'Voice & Audio', 'Notifications': 'Notifications',
    'Text & Images': 'Text & Images', 'Appearance': 'Appearance',
    'Accessibility': 'Accessibility', 'Keybinds': 'Keybinds',
    'Advanced': 'Advanced', 'Language': 'Language', 'Changelog': 'Changelog',
    'Direct Messages': 'Direct Messages'
  } },
  es: { translation: { 
    'Settings': 'Configuracion', 'Friends': 'Amigos', 'Profile': 'Perfil',
    'My Account': 'Mi Cuenta', 'Privacy & Safety': 'Privacidad y Seguridad',
    'Voice & Audio': 'Voz y Audio', 'Notifications': 'Notificaciones',
    'Text & Images': 'Texto e Imagenes', 'Appearance': 'Apariencia',
    'Accessibility': 'Accesibilidad', 'Keybinds': 'Atajos',
    'Advanced': 'Avanzado', 'Language': 'Idioma', 'Changelog': 'Cambios',
    'Direct Messages': 'Mensajes Directos'
  } },
  fr: { translation: { 
    'Settings': 'Parametres', 'Friends': 'Amis', 'Profile': 'Profil',
    'My Account': 'Mon Compte', 'Privacy & Safety': 'Confidentialite',
    'Voice & Audio': 'Voix et Audio', 'Notifications': 'Notifications',
    'Text & Images': 'Texte et Images', 'Appearance': 'Apparence',
    'Accessibility': 'Accessibilite', 'Keybinds': 'Raccourcis',
    'Advanced': 'Avance', 'Language': 'Langue', 'Changelog': 'Journal',
    'Direct Messages': 'Messages Directs'
  } }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
