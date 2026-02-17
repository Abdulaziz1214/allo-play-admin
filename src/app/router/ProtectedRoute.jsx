import { Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../auth.store";

export default function ProtectedRoute({ children }) {
  const { t } = useTranslation();
  const admin = useAuthStore((s) => s.admin);
  const isAuthReady = useAuthStore((s) => s.isAuthReady);
  const location = useLocation();

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-sm text-[var(--muted)]">{t('common.loading')}</div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
