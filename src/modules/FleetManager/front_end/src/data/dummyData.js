export const initialVehicles = [
  {
    id: 'veh-001',
    registrationNumber: 'KA-01-EQ-1001',
    model: 'Model 3 Cargo',
    brand: 'Tesla',
    type: 'Electric Van',
    fuelType: 'EV',
    branch: 'North Depot - Bangalore',
    year: 2023,
    mileage: 18450,
    color: 'Midnight Blue',
    engineNumber: 'ENG-EV-882190',
    chassisNumber: 'CHS-99210-9182',
    insuranceNumber: 'INS-2026-90182',
    driver: 'Rajesh Kumar',
    driverId: 'drv-101',
    status: 'Assigned',
    compliance: {
      insurance: { status: 'Valid', expiryDate: '2027-03-15', docNumber: 'INS-2026-90182' },
      puc: { status: 'Valid', expiryDate: '2026-11-20', docNumber: 'PUC-881920' },
      fitness: { status: 'Valid', expiryDate: '2027-01-10', docNumber: 'FIT-091823' },
      rcBook: { status: 'Valid', expiryDate: '2038-04-12', docNumber: 'RC-KA01EQ1001' }
    }
  },
  {
    id: 'veh-002',
    registrationNumber: 'MH-12-PQ-2045',
    model: 'Eicher Pro 2049',
    brand: 'Eicher',
    type: 'Light Truck',
    fuelType: 'Diesel',
    branch: 'West Depot - Pune',
    year: 2021,
    mileage: 64200,
    color: 'Arctic White',
    engineNumber: 'ENG-D-481920',
    chassisNumber: 'CHS-77182-0192',
    insuranceNumber: 'INS-2025-44102',
    driver: 'Sunil Verma',
    driverId: 'drv-102',
    status: 'Assigned',
    compliance: {
      insurance: { status: 'Expiring Soon', expiryDate: '2026-08-05', docNumber: 'INS-2025-44102' },
      puc: { status: 'Valid', expiryDate: '2026-12-10', docNumber: 'PUC-771209' },
      fitness: { status: 'Expiring Soon', expiryDate: '2026-08-04', docNumber: 'FIT-771029' },
      rcBook: { status: 'Valid', expiryDate: '2036-08-15', docNumber: 'RC-MH12PQ2045' }
    }
  },
  {
    id: 'veh-003',
    registrationNumber: 'DL-01-AB-3392',
    model: 'Tata Ace Gold',
    brand: 'Tata Motors',
    type: 'Mini Truck',
    fuelType: 'CNG',
    branch: 'Central Depot - Delhi',
    year: 2022,
    mileage: 38900,
    color: 'Pure White',
    engineNumber: 'ENG-C-192830',
    chassisNumber: 'CHS-11029-8812',
    insuranceNumber: 'INS-2026-10293',
    driver: 'Unassigned',
    driverId: null,
    status: 'Available',
    compliance: {
      insurance: { status: 'Valid', expiryDate: '2027-02-18', docNumber: 'INS-2026-10293' },
      puc: { status: 'Expiring Soon', expiryDate: '2026-08-02', docNumber: 'PUC-110928' },
      fitness: { status: 'Valid', expiryDate: '2026-10-30', docNumber: 'FIT-110293' },
      rcBook: { status: 'Valid', expiryDate: '2037-05-20', docNumber: 'RC-DL01AB3392' }
    }
  },
  {
    id: 'veh-004',
    registrationNumber: 'TN-09-XY-8812',
    model: 'Ashok Leyland Dost+',
    brand: 'Ashok Leyland',
    type: 'Pickup Truck',
    fuelType: 'Diesel',
    branch: 'South Hub - Chennai',
    year: 2020,
    mileage: 92300,
    color: 'Silver Metallic',
    engineNumber: 'ENG-D-991029',
    chassisNumber: 'CHS-88192-0012',
    insuranceNumber: 'INS-2025-00192',
    driver: 'Manoj Sharma',
    driverId: 'drv-103',
    status: 'Under Service',
    compliance: {
      insurance: { status: 'Expired', expiryDate: '2026-07-20', docNumber: 'INS-2025-00192' },
      puc: { status: 'Expired', expiryDate: '2026-07-15', docNumber: 'PUC-881902' },
      fitness: { status: 'Valid', expiryDate: '2026-09-12', docNumber: 'FIT-881029' },
      rcBook: { status: 'Valid', expiryDate: '2035-11-10', docNumber: 'RC-TN09XY8812' }
    }
  },
  {
    id: 'veh-005',
    registrationNumber: 'GJ-06-CD-4510',
    model: 'Mahindra Bolero Maxi Truck',
    brand: 'Mahindra',
    type: 'Pickup Truck',
    fuelType: 'Diesel',
    branch: 'Industrial Area - Vadodara',
    year: 2023,
    mileage: 21500,
    color: 'Forest Green',
    engineNumber: 'ENG-D-551029',
    chassisNumber: 'CHS-66102-4412',
    insuranceNumber: 'INS-2026-44019',
    driver: 'Amit Patel',
    driverId: 'drv-104',
    status: 'Assigned',
    compliance: {
      insurance: { status: 'Valid', expiryDate: '2027-05-10', docNumber: 'INS-2026-44019' },
      puc: { status: 'Valid', expiryDate: '2027-01-05', docNumber: 'PUC-661029' },
      fitness: { status: 'Valid', expiryDate: '2027-04-18', docNumber: 'FIT-661920' },
      rcBook: { status: 'Valid', expiryDate: '2038-09-01', docNumber: 'RC-GJ06CD4510' }
    }
  },
  {
    id: 'veh-006',
    registrationNumber: 'KA-05-MM-7721',
    model: 'Tata Intra V30',
    brand: 'Tata Motors',
    type: 'Mini Truck',
    fuelType: 'Diesel',
    branch: 'South Hub - Bangalore',
    year: 2022,
    mileage: 43100,
    color: 'Bright Red',
    engineNumber: 'ENG-D-771920',
    chassisNumber: 'CHS-77102-1102',
    insuranceNumber: 'INS-2025-77102',
    driver: 'Unassigned',
    driverId: null,
    status: 'Available',
    compliance: {
      insurance: { status: 'Expiring Soon', expiryDate: '2026-08-12', docNumber: 'INS-2025-77102' },
      puc: { status: 'Valid', expiryDate: '2026-10-15', docNumber: 'PUC-771028' },
      fitness: { status: 'Valid', expiryDate: '2026-11-20', docNumber: 'FIT-771092' },
      rcBook: { status: 'Valid', expiryDate: '2037-10-10', docNumber: 'RC-KA05MM7721' }
    }
  },
  {
    id: 'veh-007',
    registrationNumber: 'HR-26-DQ-9011',
    model: 'Maruti Suzuki Super Carry',
    brand: 'Maruti Suzuki',
    type: 'Mini Truck',
    fuelType: 'CNG',
    branch: 'Gurugram Logistics Hub',
    year: 2021,
    mileage: 58900,
    color: 'Granite Grey',
    engineNumber: 'ENG-C-881029',
    chassisNumber: 'CHS-99012-3310',
    insuranceNumber: 'INS-2025-99102',
    driver: 'Vikram Singh',
    driverId: 'drv-105',
    status: 'Assigned',
    compliance: {
      insurance: { status: 'Expired', expiryDate: '2026-07-01', docNumber: 'INS-2025-99102' },
      puc: { status: 'Valid', expiryDate: '2026-09-08', docNumber: 'PUC-990129' },
      fitness: { status: 'Expiring Soon', expiryDate: '2026-08-03', docNumber: 'FIT-990123' },
      rcBook: { status: 'Valid', expiryDate: '2036-03-25', docNumber: 'RC-HR26DQ9011' }
    }
  },
  {
    id: 'veh-008',
    registrationNumber: 'WB-02-TZ-1190',
    model: 'Force Traveller 3350',
    brand: 'Force Motors',
    type: 'Heavy Van',
    fuelType: 'Diesel',
    branch: 'East Hub - Kolkata',
    year: 2019,
    mileage: 114000,
    color: 'Silver',
    engineNumber: 'ENG-D-119028',
    chassisNumber: 'CHS-11902-8819',
    insuranceNumber: 'INS-2026-11902',
    driver: 'Unassigned',
    driverId: null,
    status: 'Under Service',
    compliance: {
      insurance: { status: 'Valid', expiryDate: '2026-12-30', docNumber: 'INS-2026-11902' },
      puc: { status: 'Expired', expiryDate: '2026-06-25', docNumber: 'PUC-119028' },
      fitness: { status: 'Expired', expiryDate: '2026-07-10', docNumber: 'FIT-119029' },
      rcBook: { status: 'Valid', expiryDate: '2034-02-14', docNumber: 'RC-WB02TZ1190' }
    }
  },
  {
    id: 'veh-009',
    registrationNumber: 'TS-08-EV-5544',
    model: 'Tata Ace EV',
    brand: 'Tata Motors',
    type: 'Electric Van',
    fuelType: 'EV',
    branch: 'Hyderabad Tech Zone',
    year: 2024,
    mileage: 8200,
    color: 'Teal Green',
    engineNumber: 'ENG-EV-554411',
    chassisNumber: 'CHS-55441-9902',
    insuranceNumber: 'INS-2027-55441',
    driver: 'Suresh Reddy',
    driverId: 'drv-106',
    status: 'Assigned',
    compliance: {
      insurance: { status: 'Valid', expiryDate: '2027-06-30', docNumber: 'INS-2027-55441' },
      puc: { status: 'Valid', expiryDate: '2027-06-30', docNumber: 'PUC-554411' },
      fitness: { status: 'Valid', expiryDate: '2028-06-30', docNumber: 'FIT-554412' },
      rcBook: { status: 'Valid', expiryDate: '2039-06-30', docNumber: 'RC-TS08EV5544' }
    }
  },
  {
    id: 'veh-010',
    registrationNumber: 'KL-07-BX-3019',
    model: 'Isuzu D-Max V-Cross',
    brand: 'Isuzu',
    type: 'Heavy Pickup',
    fuelType: 'Diesel',
    branch: 'Kochi Port Yard',
    year: 2020,
    mileage: 87400,
    color: 'Titanium Oxide',
    engineNumber: 'ENG-D-301928',
    chassisNumber: 'CHS-30192-7718',
    insuranceNumber: 'INS-2026-30192',
    driver: 'Praveen Nair',
    driverId: 'drv-107',
    status: 'Assigned',
    compliance: {
      insurance: { status: 'Valid', expiryDate: '2026-10-14', docNumber: 'INS-2026-30192' },
      puc: { status: 'Expiring Soon', expiryDate: '2026-08-06', docNumber: 'PUC-301928' },
      fitness: { status: 'Valid', expiryDate: '2026-12-01', docNumber: 'FIT-301929' },
      rcBook: { status: 'Valid', expiryDate: '2035-08-20', docNumber: 'RC-KL07BX3019' }
    }
  },
  {
    id: 'veh-011',
    registrationNumber: 'UP-32-FA-9901',
    model: 'Eicher Pro 3015',
    brand: 'Eicher',
    type: 'Heavy Truck',
    fuelType: 'Diesel',
    branch: 'Lucknow Highway Hub',
    year: 2021,
    mileage: 79100,
    color: 'Yellow Flame',
    engineNumber: 'ENG-D-990128',
    chassisNumber: 'CHS-99012-7712',
    insuranceNumber: 'INS-2025-99012',
    driver: 'Unassigned',
    driverId: null,
    status: 'Available',
    compliance: {
      insurance: { status: 'Expiring Soon', expiryDate: '2026-08-01', docNumber: 'INS-2025-99012' },
      puc: { status: 'Valid', expiryDate: '2026-09-30', docNumber: 'PUC-990128' },
      fitness: { status: 'Valid', expiryDate: '2026-11-15', docNumber: 'FIT-990129' },
      rcBook: { status: 'Valid', expiryDate: '2036-05-18', docNumber: 'RC-UP32FA9901' }
    }
  },
  {
    id: 'veh-012',
    registrationNumber: 'KA-53-Z-4012',
    model: 'Euler HiLoad EV',
    brand: 'Euler Motors',
    type: '3-Wheeler Cargo EV',
    fuelType: 'EV',
    branch: 'North Depot - Bangalore',
    year: 2023,
    mileage: 14200,
    color: 'Jet Black',
    engineNumber: 'ENG-EV-401290',
    chassisNumber: 'CHS-40129-1102',
    insuranceNumber: 'INS-2026-40129',
    driver: 'Kiran Gowda',
    driverId: 'drv-108',
    status: 'Assigned',
    compliance: {
      insurance: { status: 'Valid', expiryDate: '2027-01-22', docNumber: 'INS-2026-40129' },
      puc: { status: 'Valid', expiryDate: '2026-11-30', docNumber: 'PUC-401290' },
      fitness: { status: 'Valid', expiryDate: '2027-03-05', docNumber: 'FIT-401291' },
      rcBook: { status: 'Valid', expiryDate: '2038-02-10', docNumber: 'RC-KA53Z4012' }
    }
  },
  {
    id: 'veh-013',
    registrationNumber: 'RJ-14-GH-6620',
    model: 'Mahindra Supro Profit Truck',
    brand: 'Mahindra',
    type: 'Mini Truck',
    fuelType: 'Diesel',
    branch: 'Jaipur Logistics Park',
    year: 2020,
    mileage: 98700,
    color: 'Pure White',
    engineNumber: 'ENG-D-662019',
    chassisNumber: 'CHS-66201-9981',
    insuranceNumber: 'INS-2025-66201',
    driver: 'Ramesh Choudhary',
    driverId: 'drv-109',
    status: 'Under Service',
    compliance: {
      insurance: { status: 'Expired', expiryDate: '2026-06-18', docNumber: 'INS-2025-66201' },
      puc: { status: 'Expired', expiryDate: '2026-07-05', docNumber: 'PUC-662019' },
      fitness: { status: 'Expiring Soon', expiryDate: '2026-08-04', docNumber: 'FIT-662020' },
      rcBook: { status: 'Valid', expiryDate: '2035-04-14', docNumber: 'RC-RJ14GH6620' }
    }
  },
  {
    id: 'veh-014',
    registrationNumber: 'MP-09-KL-8833',
    model: 'Tata Yodha 2.0',
    brand: 'Tata Motors',
    type: 'Pickup Truck',
    fuelType: 'Diesel',
    branch: 'Indore Central Yard',
    year: 2022,
    mileage: 32400,
    color: 'Silver Grey',
    engineNumber: 'ENG-D-883390',
    chassisNumber: 'CHS-88339-2210',
    insuranceNumber: 'INS-2026-88339',
    driver: 'Unassigned',
    driverId: null,
    status: 'Available',
    compliance: {
      insurance: { status: 'Valid', expiryDate: '2026-11-28', docNumber: 'INS-2026-88339' },
      puc: { status: 'Valid', expiryDate: '2026-12-15', docNumber: 'PUC-883390' },
      fitness: { status: 'Valid', expiryDate: '2027-01-20', docNumber: 'FIT-883391' },
      rcBook: { status: 'Valid', expiryDate: '2037-08-11', docNumber: 'RC-MP09KL8833' }
    }
  },
  {
    id: 'veh-015',
    registrationNumber: 'PN-01-AB-1234',
    model: 'Ashok Leyland Bada Dost',
    brand: 'Ashok Leyland',
    type: 'Heavy Pickup',
    fuelType: 'CNG',
    branch: 'West Depot - Pune',
    year: 2023,
    mileage: 27800,
    color: 'Deep Blue',
    engineNumber: 'ENG-C-123490',
    chassisNumber: 'CHS-12349-8810',
    insuranceNumber: 'INS-2026-12349',
    driver: 'Deepak Joshi',
    driverId: 'drv-110',
    status: 'Assigned',
    compliance: {
      insurance: { status: 'Valid', expiryDate: '2027-02-14', docNumber: 'INS-2026-12349' },
      puc: { status: 'Valid', expiryDate: '2026-10-22', docNumber: 'PUC-123490' },
      fitness: { status: 'Valid', expiryDate: '2027-04-10', docNumber: 'FIT-123491' },
      rcBook: { status: 'Valid', expiryDate: '2038-03-01', docNumber: 'RC-PN01AB1234' }
    }
  },
  {
    id: 'veh-016',
    registrationNumber: 'OR-02-BW-7700',
    model: 'Swaraj Mazda Cargo',
    brand: 'Swaraj Mazda',
    type: 'Light Truck',
    fuelType: 'Diesel',
    branch: 'Bhubaneswar Depot',
    year: 2019,
    mileage: 125000,
    color: 'Beige',
    engineNumber: 'ENG-D-770019',
    chassisNumber: 'CHS-77001-3321',
    insuranceNumber: 'INS-2025-77001',
    driver: 'Unassigned',
    driverId: null,
    status: 'Available',
    compliance: {
      insurance: { status: 'Expired', expiryDate: '2026-07-02', docNumber: 'INS-2025-77001' },
      puc: { status: 'Expiring Soon', expiryDate: '2026-08-06', docNumber: 'PUC-770019' },
      fitness: { status: 'Expired', expiryDate: '2026-06-30', docNumber: 'FIT-770020' },
      rcBook: { status: 'Valid', expiryDate: '2034-09-12', docNumber: 'RC-OR02BW7700' }
    }
  },
  {
    id: 'veh-017',
    registrationNumber: 'CH-01-AX-9088',
    model: 'Piaggio Ape Xtra LDX',
    brand: 'Piaggio',
    type: '3-Wheeler Cargo',
    fuelType: 'Diesel',
    branch: 'Chandigarh Hub',
    year: 2021,
    mileage: 49200,
    color: 'Golden Yellow',
    engineNumber: 'ENG-D-908812',
    chassisNumber: 'CHS-90881-2290',
    insuranceNumber: 'INS-2026-90881',
    driver: 'Unassigned',
    driverId: null,
    status: 'Available',
    compliance: {
      insurance: { status: 'Valid', expiryDate: '2026-11-10', docNumber: 'INS-2026-90881' },
      puc: { status: 'Valid', expiryDate: '2026-12-05', docNumber: 'PUC-908812' },
      fitness: { status: 'Valid', expiryDate: '2027-01-18', docNumber: 'FIT-908813' },
      rcBook: { status: 'Valid', expiryDate: '2036-11-20', docNumber: 'RC-CH01AX9088' }
    }
  },
  {
    id: 'veh-018',
    registrationNumber: 'AS-01-DC-3344',
    model: 'Tata Ace HT+',
    brand: 'Tata Motors',
    type: 'Mini Truck',
    fuelType: 'Diesel',
    branch: 'Guwahati Express Depot',
    year: 2022,
    mileage: 36700,
    color: 'Snow White',
    engineNumber: 'ENG-D-334490',
    chassisNumber: 'CHS-33449-7711',
    insuranceNumber: 'INS-2025-33449',
    driver: 'Unassigned',
    driverId: null,
    status: 'Available',
    compliance: {
      insurance: { status: 'Expiring Soon', expiryDate: '2026-08-05', docNumber: 'INS-2025-33449' },
      puc: { status: 'Valid', expiryDate: '2026-10-18', docNumber: 'PUC-334490' },
      fitness: { status: 'Valid', expiryDate: '2027-02-12', docNumber: 'FIT-334491' },
      rcBook: { status: 'Valid', expiryDate: '2037-07-25', docNumber: 'RC-AS01DC3344' }
    }
  },
  {
    id: 'veh-019',
    registrationNumber: 'BR-01-GH-5511',
    model: 'Mahindra Treo Zor',
    brand: 'Mahindra',
    type: '3-Wheeler Cargo EV',
    fuelType: 'EV',
    branch: 'Patna Logistics Hub',
    year: 2023,
    mileage: 11200,
    color: 'Sky Blue',
    engineNumber: 'ENG-EV-551190',
    chassisNumber: 'CHS-55119-0012',
    insuranceNumber: 'INS-2026-55119',
    driver: 'Unassigned',
    driverId: null,
    status: 'Available',
    compliance: {
      insurance: { status: 'Valid', expiryDate: '2027-04-12', docNumber: 'INS-2026-55119' },
      puc: { status: 'Valid', expiryDate: '2027-04-12', docNumber: 'PUC-551190' },
      fitness: { status: 'Valid', expiryDate: '2028-04-12', docNumber: 'FIT-551191' },
      rcBook: { status: 'Valid', expiryDate: '2038-04-12', docNumber: 'RC-BR01GH5511' }
    }
  },
  {
    id: 'veh-020',
    registrationNumber: 'GA-03-K-8890',
    model: 'Force Urbania 3350',
    brand: 'Force Motors',
    type: 'Heavy Van',
    fuelType: 'Diesel',
    branch: 'Goa Coastal Depot',
    year: 2024,
    mileage: 6500,
    color: 'Graphite Grey',
    engineNumber: 'ENG-D-889012',
    chassisNumber: 'CHS-88901-5544',
    insuranceNumber: 'INS-2027-88901',
    driver: 'Unassigned',
    driverId: null,
    status: 'Available',
    compliance: {
      insurance: { status: 'Valid', expiryDate: '2027-07-15', docNumber: 'INS-2027-88901' },
      puc: { status: 'Valid', expiryDate: '2027-01-10', docNumber: 'PUC-889012' },
      fitness: { status: 'Valid', expiryDate: '2028-07-15', docNumber: 'FIT-889013' },
      rcBook: { status: 'Valid', expiryDate: '2039-07-15', docNumber: 'RC-GA03K8890' }
    }
  }
];

export const vehiclesData = initialVehicles;
export const vehicles = initialVehicles;

export const initialDrivers = [
  { id: 'drv-101', name: 'Rajesh Kumar', licenseNumber: 'DL-KA-2018-99012', phone: '+91 98765 43210', branch: 'North Depot - Bangalore', status: 'Assigned', currentVehicle: 'KA-01-EQ-1001' },
  { id: 'drv-102', name: 'Sunil Verma', licenseNumber: 'DL-MH-2016-44192', phone: '+91 98220 11928', branch: 'West Depot - Pune', status: 'Assigned', currentVehicle: 'MH-12-PQ-2045' },
  { id: 'drv-103', name: 'Manoj Sharma', licenseNumber: 'DL-TN-2015-88192', phone: '+91 94440 88192', branch: 'South Hub - Chennai', status: 'Assigned', currentVehicle: 'TN-09-XY-8812' },
  { id: 'drv-104', name: 'Amit Patel', licenseNumber: 'DL-GJ-2019-33102', phone: '+91 98980 33102', branch: 'Industrial Area - Vadodara', status: 'Assigned', currentVehicle: 'GJ-06-CD-4510' },
  { id: 'drv-105', name: 'Vikram Singh', licenseNumber: 'DL-HR-2017-77102', phone: '+91 98110 77102', branch: 'Gurugram Logistics Hub', status: 'Assigned', currentVehicle: 'HR-26-DQ-9011' },
  { id: 'drv-106', name: 'Suresh Reddy', licenseNumber: 'DL-TS-2020-55102', phone: '+91 99890 55102', branch: 'Hyderabad Tech Zone', status: 'Assigned', currentVehicle: 'TS-08-EV-5544' },
  { id: 'drv-107', name: 'Praveen Nair', licenseNumber: 'DL-KL-2014-99102', phone: '+91 94470 99102', branch: 'Kochi Port Yard', status: 'Assigned', currentVehicle: 'KL-07-BX-3019' },
  { id: 'drv-108', name: 'Kiran Gowda', licenseNumber: 'DL-KA-2021-11029', phone: '+91 97410 11029', branch: 'North Depot - Bangalore', status: 'Assigned', currentVehicle: 'KA-53-Z-4012' },
  { id: 'drv-109', name: 'Ramesh Choudhary', licenseNumber: 'DL-RJ-2013-66102', phone: '+91 94140 66102', branch: 'Jaipur Logistics Park', status: 'Assigned', currentVehicle: 'RJ-14-GH-6620' },
  { id: 'drv-110', name: 'Deepak Joshi', licenseNumber: 'DL-PN-2018-22109', phone: '+91 98500 22109', branch: 'West Depot - Pune', status: 'Assigned', currentVehicle: 'PN-01-AB-1234' }
];

export const drivers = initialDrivers;

export const initialAssignmentHistory = [
  { id: 'asgn-01', vehicleReg: 'KA-01-EQ-1001', driverName: 'Rajesh Kumar', driverId: 'drv-101', date: '2026-05-10', status: 'Active', remarks: 'Assigned for urban e-commerce deliveries.' },
  { id: 'asgn-02', vehicleReg: 'MH-12-PQ-2045', driverName: 'Sunil Verma', driverId: 'drv-102', date: '2026-04-15', status: 'Active', remarks: 'Assigned for inter-city parcel transfer.' },
  { id: 'asgn-03', vehicleReg: 'TN-09-XY-8812', driverName: 'Manoj Sharma', driverId: 'drv-103', date: '2026-03-01', status: 'Active', remarks: 'Vehicle sent for scheduled brake check.' },
  { id: 'asgn-04', vehicleReg: 'TS-08-EV-5544', driverName: 'Suresh Reddy', driverId: 'drv-104', date: '2026-06-01', status: 'Active', remarks: 'New EV assignment for tech zone deliveries.' }
];

export const recentActivities = [
  { id: 'act-01', type: 'registration', text: 'Vehicle KA-53-Z-4012 registered under Bangalore Depot', timestamp: '2 hours ago' },
  { id: 'act-02', type: 'compliance', text: 'Insurance renewed for TS-08-EV-5544 until June 2027', timestamp: '5 hours ago' },
  { id: 'act-03', type: 'assignment', text: 'Deepak Joshi assigned to PN-01-AB-1234', timestamp: '1 day ago' },
  { id: 'act-04', type: 'alert', text: 'Fitness certificate expired for HR-26-DQ-9011', timestamp: '2 days ago' }
];

export const dashboardData = {
  totalVehicles: initialVehicles.length,
  assignedVehicles: initialVehicles.filter(v => v.status === 'Assigned').length,
  availableVehicles: initialVehicles.filter(v => v.status === 'Available').length,
  underService: initialVehicles.filter(v => v.status === 'Under Service').length
};
