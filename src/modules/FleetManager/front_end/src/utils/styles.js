export const COLORS = {
    background: '#0f172a',
    card: '#1e293b',
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    accent: '#f59e0b',
    accentHover: '#d97706',
    success: '#22c55e',
    danger: '#ef4444',
    dangerHover: '#dc2626',
    border: '#334155',
    text: '#f1f5f9',
    muted: '#94a3b8',
    inputBg: '#0f172a',
    hoverBg: '#334155'
};

export const COMMON_STYLES = {
    card: {
        backgroundColor: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '10px',
        padding: '20px',
        color: COLORS.text,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
    },
    heading: {
        fontSize: '20px',
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: '6px'
    },
    subheading: {
        fontSize: '13px',
        color: COLORS.muted,
        marginBottom: '16px'
    },
    buttonPrimary: {
        backgroundColor: COLORS.primary,
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 18px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
    },
    buttonSecondary: {
        backgroundColor: 'transparent',
        color: COLORS.text,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '6px',
        padding: '10px 18px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    buttonDanger: {
        backgroundColor: COLORS.danger,
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 18px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    input: {
        width: '100%',
        backgroundColor: COLORS.inputBg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '6px',
        padding: '10px 14px',
        color: COLORS.text,
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box'
    },
    select: {
        width: '100%',
        backgroundColor: COLORS.inputBg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '6px',
        padding: '10px 14px',
        color: COLORS.text,
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box'
    },
    label: {
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        color: COLORS.muted,
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    tableHeader: {
        backgroundColor: '#0f172a',
        color: COLORS.muted,
        fontSize: '12px',
        fontWeight: '700',
        textTransform: 'uppercase',
        padding: '12px 16px',
        textAlign: 'left',
        borderBottom: `1px solid ${COLORS.border}`
    },
    tableCell: {
        padding: '14px 16px',
        fontSize: '13px',
        color: COLORS.text,
        borderBottom: `1px solid ${COLORS.border}`
    }
};
