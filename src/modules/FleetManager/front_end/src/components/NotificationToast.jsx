import React from 'react';
import { COLORS } from '../utils/styles';

const NotificationToast = ({ toast, onClose }) => {
    if (!toast || !toast.show) return null;

    let bg = COLORS.card;
    let borderColor = COLORS.primary;

    if (toast.type === 'danger') {
        bg = '#450a0a';
        borderColor = COLORS.danger;
    } else if (toast.type === 'success') {
        bg = '#052e16';
        borderColor = COLORS.success;
    } else if (toast.type === 'warning') {
        bg = '#451a03';
        borderColor = COLORS.accent;
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 2000,
            backgroundColor: bg,
            border: `1px solid ${borderColor}`,
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        }}>
            <span>{toast.message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default NotificationToast;
