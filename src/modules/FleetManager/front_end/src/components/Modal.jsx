import React from 'react';
import { COLORS } from '../utils/styles';

const Modal = ({ isOpen, onClose, title, children, maxWidth = '560px' }) => {
    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1500,
                padding: '20px'
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: COLORS.card,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: maxWidth,
                    overflow: 'hidden',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                }}
            >
                <div style={{
                    padding: '16px 20px',
                    borderBottom: `1px solid ${COLORS.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: COLORS.text }}>{title}</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: COLORS.muted,
                            fontSize: '18px',
                            cursor: 'pointer'
                        }}
                    >
                        ✕
                    </button>
                </div>
                <div style={{ padding: '20px' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
