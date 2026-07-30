import React from 'react';
import { COLORS, COMMON_STYLES } from '../utils/styles';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderTop: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.card,
            fontSize: '13px',
            color: COLORS.muted
        }}>
            <div>
                Page <strong style={{ color: COLORS.text }}>{currentPage}</strong> of <strong style={{ color: COLORS.text }}>{totalPages}</strong>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    style={{
                        ...COMMON_STYLES.buttonSecondary,
                        padding: '6px 12px',
                        opacity: currentPage === 1 ? 0.5 : 1,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                >
                    Previous
                </button>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    style={{
                        ...COMMON_STYLES.buttonSecondary,
                        padding: '6px 12px',
                        opacity: currentPage === totalPages ? 0.5 : 1,
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
