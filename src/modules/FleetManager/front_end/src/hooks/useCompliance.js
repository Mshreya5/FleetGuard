import { useFleetManager } from '../context/FleetManagerContext';
import { getDaysRemaining } from '../utils/dateFormatter';

export const useCompliance = () => {
  const { vehicles, uploadDocument } = useFleetManager();

  const complianceRecords = [];
  const upcomingExpiries = [];

  vehicles.forEach((vehicle) => {
    if (!vehicle.compliance) return;

    ['insurance', 'puc', 'fitness', 'rcBook'].forEach((docType) => {
      const doc = vehicle.compliance[docType];
      if (doc) {
        const daysLeft = getDaysRemaining(doc.expiryDate);
        const record = {
          id: `${vehicle.id}-${docType}`,
          vehicleId: vehicle.id,
          registrationNumber: vehicle.registrationNumber,
          model: vehicle.model,
          brand: vehicle.brand,
          driver: vehicle.driver,
          docType: docType.toUpperCase(),
          docName: docType === 'rcBook' ? 'RC Book' : docType.toUpperCase(),
          docNumber: doc.docNumber,
          status: doc.status,
          expiryDate: doc.expiryDate,
          daysRemaining: daysLeft
        };

        complianceRecords.push(record);

        if (daysLeft <= 30) {
          upcomingExpiries.push(record);
        }
      }
    });
  });

  upcomingExpiries.sort((a, b) => a.daysRemaining - b.daysRemaining);

  const stats = {
    valid: complianceRecords.filter((r) => r.status === 'Valid').length,
    expiringSoon: complianceRecords.filter((r) => r.status === 'Expiring Soon').length,
    expired: complianceRecords.filter((r) => r.status === 'Expired').length
  };

  return {
    complianceRecords,
    upcomingExpiries,
    stats,
    uploadDocument
  };
};

export default useCompliance;
