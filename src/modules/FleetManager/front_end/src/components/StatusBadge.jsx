import React from 'react';
import { COLORS } from '../utils/styles';

const StatusBadge = ({ status }) => {
    let bg = '#1e293b';
    let text = COLORS.text;

    const s = (status || '').toString().toLowerCase();

    if (s === 'valid' || s === 'available' || s === 'active') {
        bg = 'rgba(34, 197, 94, 0.15)';
        text = COLORS.success;
    } else if (s === 'expiring soon' || s === 'maintenance') {
        bg = 'rgba(245, 158, 11, 0.15)';
        text = COLORS.accent;
    } else if (s === 'expired' || s === 'assigned' || s === 'missing') {
        bg = 'rgba(239, 68, 68, 0.15)';
        text = COLORS.danger;
    }

    return (
        <span style={{
            backgroundColor: bg,
            color: text,
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            display: 'inline-block',
            textAlign: 'center',
            letterSpacing: '0.3px'
        }}>
            {status || 'Unknown'}
        </span>
    );
};

export default StatusBadge;
