import React from 'react';
import Modal from './Modal';
import { COLORS, COMMON_STYLES } from '../utils/styles';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title = "Confirm Action", message = "Are you sure?" }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="420px">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ margin: 0, fontSize: '14px', color: COLORS.text, lineHeight: '1.5' }}>
                    {message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '12px', borderTop: `1px solid ${COLORS.border}` }}>
                    <button onClick={onClose} style={COMMON_STYLES.buttonSecondary}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} style={COMMON_STYLES.buttonDanger}>
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationDialog;
