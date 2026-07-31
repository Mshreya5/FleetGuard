export const validateVehicleRegistration = (formData, existingVehicles = []) => {
  const errors = {};

  if (!formData.registrationNumber || !formData.registrationNumber.trim()) {
    errors.registrationNumber = 'Registration number is required';
  } else {
    const regTrimmed = formData.registrationNumber.trim().toUpperCase();
    const isDuplicate = existingVehicles.some(
      v => v.registrationNumber.toUpperCase() === regTrimmed && v.id !== formData.id
    );
    if (isDuplicate) {
      errors.registrationNumber = 'Vehicle registration number already exists in fleet';
    }
  }

  if (!formData.model || !formData.model.trim()) {
    errors.model = 'Vehicle model is required';
  }

  if (!formData.brand || !formData.brand.trim()) {
    errors.brand = 'Vehicle brand is required';
  }

  if (!formData.type || !formData.type.trim()) {
    errors.type = 'Vehicle type is required';
  }

  if (!formData.branch || !formData.branch.trim()) {
    errors.branch = 'Branch location is required';
  }

  const currentYear = new Date().getFullYear();
  const yearNum = Number(formData.year);
  if (!formData.year) {
    errors.year = 'Manufacturing year is required';
  } else if (isNaN(yearNum) || yearNum < 1990 || yearNum > currentYear + 1) {
    errors.year = `Year must be a number between 1990 and ${currentYear + 1}`;
  }

  const mileageNum = Number(formData.mileage);
  if (formData.mileage === undefined || formData.mileage === '') {
    errors.mileage = 'Current mileage is required';
  } else if (isNaN(mileageNum) || mileageNum < 0) {
    errors.mileage = 'Mileage must be a non-negative number';
  }

  if (!formData.engineNumber || !formData.engineNumber.trim()) {
    errors.engineNumber = 'Engine number is required';
  }
  if (!formData.chassisNumber || !formData.chassisNumber.trim()) {
    errors.chassisNumber = 'Chassis number is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAssignmentForm = (formData) => {
  const errors = {};
  if (!formData.vehicleId) {
    errors.vehicleId = 'Please select a vehicle';
  }
  if (!formData.driverId) {
    errors.driverId = 'Please select a driver';
  }
  if (!formData.assignmentDate) {
    errors.assignmentDate = 'Assignment date is required';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateDocumentUpload = (file, docType) => {
  if (!file) return { isValid: false, error: 'Please select a file to upload' };
  
  const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
  const ext = file.name.split('.').pop().toLowerCase();
  
  if (!allowedExtensions.includes(ext)) {
    return { isValid: false, error: `Invalid file format. Accepted formats: PDF, PNG, JPG` };
  }
  
  const maxSizeInBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return { isValid: false, error: 'File size exceeds 10MB limit' };
  }

  return { isValid: true, error: null };
};