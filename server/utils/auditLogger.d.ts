export type AuditLogResult = any;

export const logAudit: (...args: any[]) => Promise<any>;
export const logEvent: (...args: any[]) => Promise<any>;

export default {
  logAudit,
  logEvent
};
