import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/ui/Card';

const UsersPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">{t('nav.users')}</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Platform users management: status, subscriptions, devices
          </p>
        </div>
      </Card>

      <Card>
        <div className="text-center py-16">
          <div className="text-8xl mb-6">👥</div>
          <h2 className="text-2xl font-semibold mb-3">
            {t('common.comingSoon')}
          </h2>
          <p className="text-[var(--muted)] max-w-md mx-auto">
            User management features including user list, subscription status, device management, and user history will be available when the backend API is ready.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default UsersPage;
