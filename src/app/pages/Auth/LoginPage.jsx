import React, { useState } from 'react'
import { useAuthStore } from '../../../auth.store';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const LoginPage = () => {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";
  const doLogin = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");



  return (
    <Card className="w-full h-full max-w-md m-auto">
      <h1 className="text-2xl font-semibold">Вход в аккаунт</h1>
      <p className="text-sm text-[var(--muted)] mt-2">
        Введите данные для авторизации
      </p>

      <div className="mt-6 space-y-4">
        <Input
          label="Логин"
          placeholder="Введите логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          label="Пароль"
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />


        {error && <div className="text-sm text-[var(--primary)]">{error}</div>}


        <Button
          variant="primary"
          className="w-full"
          disabled={isLoading}
          onClick={async () => {
            const ok = await doLogin({ username, password });
            if (ok) navigate(from, { replace: true });
          }}
        >
          {isLoading ? "Входим..." : "Войти"}
        </Button>

      </div>
    </Card>

  )
}

export default LoginPage
