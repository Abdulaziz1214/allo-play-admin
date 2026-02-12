import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center p-8">
        <div className="text-8xl font-bold text-[var(--primary)] mb-4">404</div>

        <h1 className="text-2xl font-semibold mb-3">{t('errors.notFound')}</h1>

        <p className="text-[var(--muted)] mb-6">
          {t('errors.notFoundText')}
        </p>

        <Button
          variant="primary"
          onClick={() => navigate('/')}
          className="w-full"
        >
          {t('errors.backToHome')}
        </Button>
      </Card>
    </div>
  );
};

export default NotFoundPage;
