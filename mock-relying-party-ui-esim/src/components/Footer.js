import React from 'react';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="text-center py-5 text-gray-600 text-sm bg-white mt-10">
      {t('footer.copyright')}
    </footer>
  );
}

export default Footer;