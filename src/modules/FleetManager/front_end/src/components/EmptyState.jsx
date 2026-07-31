import React from 'react';

export default function EmptyState({
  title = 'No Records Found',
  description = 'Try adjusting your search query or filters to find what you are looking for.',
  actionText,
  onAction
}) {
  return (
    <div className="fm-empty-state">
      <div className="fm-empty-icon">📁</div>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--fm-text)', margin: '0 0 6px 0' }}>
        {title}
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--fm-muted-text)', maxWidth: '400px', margin: '0 auto 16px auto' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button className="fm-btn fm-btn-primary fm-btn-sm" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}
