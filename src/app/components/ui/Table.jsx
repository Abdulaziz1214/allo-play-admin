import React from 'react'
import { useTranslation } from 'react-i18next';

export default function Table({ columns = [], data = [], rowKey, emptyMessage }) {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📋</div>
        <p className="text-lg font-medium text-[var(--text)] mb-2">
          {emptyMessage || t('common.noData')}
        </p>
        <p className="text-sm text-[var(--muted)]">
          {t('common.comingSoon')}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className="text-left px-4 py-3 text-sm font-semibold text-[var(--text)] whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const key = rowKey ? rowKey(row) : rowIndex;
            return (
              <tr
                key={key}
                className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors"
              >
                {columns.map((col, colIndex) => {
                  const cellContent = col.cell
                    ? col.cell(row)
                    : row[col.key];

                  return (
                    <td
                      key={col.key || colIndex}
                      className="px-4 py-3 text-sm text-[var(--text)]"
                    >
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
