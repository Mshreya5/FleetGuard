import React from 'react';
import QueueTable from './components/QueueTable';
import styles from './ServiceCenterDashboard.module.css';

const queueItems = [
  { vehicleNumber: 'KA 01 AB 2345', ownerBranch: 'Maya Chen / North Branch', vehicleModel: 'Toyota Innova', currentMileage: '18,320 km', issue: 'Engine oil leak', priority: 'High', status: 'Waiting' },
  { vehicleNumber: 'KA 05 CD 1189', ownerBranch: 'Arjun Rao / East Branch', vehicleModel: 'Honda City', currentMileage: '14,780 km', issue: 'Brake pad wear', priority: 'High', status: 'In Progress' },
  { vehicleNumber: 'KA 12 EF 7742', ownerBranch: 'Neha Singh / West Branch', vehicleModel: 'Tata Nexon', currentMileage: '21,440 km', issue: 'Battery replacement', priority: 'Medium', status: 'Waiting' },
  { vehicleNumber: 'KA 22 GH 4410', ownerBranch: 'Sameer Khan / Central Branch', vehicleModel: 'Maruti Swift', currentMileage: '12,650 km', issue: 'Tyre rotation', priority: 'Low', status: 'Completed' },
  { vehicleNumber: 'KA 34 IJ 6612', ownerBranch: 'Priya Desai / South Branch', vehicleModel: 'Mahindra Scorpio', currentMileage: '27,100 km', issue: 'Engine diagnostics', priority: 'High', status: 'In Progress' },
  { vehicleNumber: 'KA 47 KL 9098', ownerBranch: 'Rohan Menon / North Branch', vehicleModel: 'Hyundai Creta', currentMileage: '16,980 km', issue: 'AC not cooling', priority: 'Medium', status: 'Waiting' },
  { vehicleNumber: 'KA 56 MN 1234', ownerBranch: 'Asha Patel / East Branch', vehicleModel: 'Ford Aspire', currentMileage: '19,300 km', issue: 'Suspension noise', priority: 'High', status: 'Waiting' },
  { vehicleNumber: 'KA 67 OP 7765', ownerBranch: 'Dinesh Verma / West Branch', vehicleModel: 'Volkswagen Polo', currentMileage: '10,820 km', issue: 'Interior cleaning', priority: 'Low', status: 'Completed' },
  { vehicleNumber: 'KA 78 QR 5511', ownerBranch: 'Nisha Thomas / Central Branch', vehicleModel: 'Skoda Rapid', currentMileage: '23,900 km', issue: 'Headlight alignment', priority: 'Medium', status: 'In Progress' },
  { vehicleNumber: 'KA 89 ST 3290', ownerBranch: 'Karthik Iyer / South Branch', vehicleModel: 'Renault Kwid', currentMileage: '8,460 km', issue: 'Wiper replacement', priority: 'Low', status: 'Waiting' },
];

export default function ServiceQueue() {
  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Service Center</p>
          <h1 className={styles.pageTitle}>Service Queue</h1>
          <p className={styles.pageSubtitle}>Monitor vehicle service requests with search and filtering tools.</p>
        </div>
      </header>

      <QueueTable vehicles={queueItems} />
    </>
  );
}
