import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ja' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('userPreferredLanguage', newLang);
  };

  return (
    <Tooltip title={i18n.language === 'en' ? '日本語' : 'English'}>
      <IconButton
        color="inherit"
        onClick={toggleLanguage}
        aria-label="toggle language"
      >
        <FontAwesomeIcon icon={faLanguage} />
      </IconButton>
    </Tooltip>
  );
};

export default LanguageToggle;