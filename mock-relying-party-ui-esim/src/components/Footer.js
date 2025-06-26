import React from 'react';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      {t('footer.copyright')}
    </footer>
  );
}

export default Footer;