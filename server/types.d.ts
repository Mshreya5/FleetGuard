declare module "../utils/auditLogger" {
  const auditLogger: {
    logAudit: (...args: any[]) => Promise<any>;
    logEvent: (...args: any[]) => Promise<any>;
  };
  export const logAudit: (...args: any[]) => Promise<any>;
  export const logEvent: (...args: any[]) => Promise<any>;
  export default auditLogger;
}

declare module "../src/modules/Admin/backend/src/routes/adminRoutes" {
  const router: any;
  export default router;
}

declare module "../src/modules/FleetManager/backend/routes/complianceRoutes" {
  const router: any;
  export default router;
}

declare module "../src/modules/FleetManager/backend/routes/dashboardRoutes" {
  const router: any;
  export default router;
}
