import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from './ui/Card';

const icons = {
  subscriptions: '💳',
  payments: '💰',
  permissions: '🔐',
  settings: '⚙️',
  users: '👥',
  default: '🚧',
};

const ComingSoonPage = ({ section, icon }) => {
  const { t } = useTranslation();
  const displayIcon = icon || icons[section] || icons.default;

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">{t(`nav.${section}`)}</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            {t(`comingSoon.${section}Description`)}
          </p>
        </div>
      </Card>

      <Card>
        <div className="text-center py-20">
          <div className="text-8xl mb-6">{displayIcon}</div>
          <h2 className="text-2xl font-semibold mb-3">
            {t('common.comingSoon')}
          </h2>
          <p className="text-[var(--muted)] max-w-md mx-auto">
            {t(`comingSoon.${section}Text`)}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ComingSoonPage;
