import React from 'react';
import { useTranslation } from 'react-i18next';

function HomePage() {
  const { t } = useTranslation();

  return (
    <main className="main-section">
      <div className="left-content">
        <h1>{t('hero.title')}</h1>
        <p className="subtext">
          {t('hero.subtitle')}
        </p>
        <button className="cta-button">{t('hero.cta')}</button>
      </div>

      <div className="right-image">
        <img src="/images/sim-image.svg" alt="SIM" />
      </div>
    </main>
  );
}

export default HomePage;