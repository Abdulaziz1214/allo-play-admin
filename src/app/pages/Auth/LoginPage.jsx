import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../auth.store';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import ThemeToggle from '../../components/ThemeToggle';

const LoginPage = () => {
  const { t } = useTranslation();
  const doLogin = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const ok = await doLogin({ username, password });
    if (ok) navigate(from, { replace: true });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">{t('auth.login')}</h1>
        <p className="text-sm text-[var(--muted)] mt-2">
          {t('auth.loginSubtitle')}
        </p>

        <div className="mt-6 space-y-4">
          <Input
            label={t('auth.username')}
            placeholder={t('auth.usernamePlaceholder')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Input
            label={t('auth.password')}
            type="password"
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          {error && <div className="text-sm text-[var(--primary)]">{error}</div>}

          <Button
            variant="primary"
            className="w-full"
            disabled={isLoading}
            onClick={handleLogin}
          >
            {isLoading ? t('common.loading') : t('auth.login')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
