import React from 'react'
import { useAuthStore } from '../../auth.store';
import { Navigate } from 'react-router-dom';

export default function PermissionGate({ permission, children }) {
  const isAuthReady = useAuthStore((s) => s.isAuthReady);
  const admin = useAuthStore((s) => s.admin);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  if (!isAuthReady) return null;

  // если не залогинен — пусть ProtectedRoute решает, но на всякий случай:
  if (!admin) return <Navigate to="/login" replace />;

  // если permission не задан — просто показываем
  if (!permission) return children; 

  // нет права — показываем 403 страницу (пока через Navigate на /dashboard)
  if (!hasPermission(permission)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}