import React from 'react'
import Card from '../../components/ui/Card'

export default function ForbiddenPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-lg text-center">
        <h1 className="text-2xl font-semibold">Доступ запрещён</h1>
        <p className="text-sm text-[var(--muted)] mt-2">
          У вашей роли нет прав для просмотра этой страницы.
        </p>
      </Card>
    </div>
  );
}