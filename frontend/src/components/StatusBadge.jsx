import React from 'react';

const STATUS_STYLES = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  inactive: 'bg-rose-50 text-rose-700 ring-rose-200',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
};

const StatusBadge = ({ status = 'inactive' }) => {
  const normalized = String(status || '').toLowerCase();
  const styles = STATUS_STYLES[normalized] || 'bg-gray-100 text-gray-700 ring-gray-200';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset ${styles}`}
    >
      {normalized || 'inactive'}
    </span>
  );
};

export default StatusBadge;
