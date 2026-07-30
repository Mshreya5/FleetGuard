import React from 'react';
import { COLORS } from '../utils/styles';

const Loader = ({ message = "Loading data..." }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            color: COLORS.muted,
            gap: '12px'
        }}>
            <div style={{
                width: '32px',
                height: '32px',
                border: `3px solid ${COLORS.border}`,
                borderTop: `3px solid ${COLORS.primary}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <span style={{ fontSize: '13px', fontWeight: '500' }}>{message}</span>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loader;
