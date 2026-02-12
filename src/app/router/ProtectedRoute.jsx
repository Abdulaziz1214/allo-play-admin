import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../auth.store";

export default function ProtectedRoute({ children }) {
  const admin = useAuthStore((s) => s.admin);
  const isAuthReady = useAuthStore((s) => s.isAuthReady);
  const location = useLocation();

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-[var(--muted)]">Loading...</div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
