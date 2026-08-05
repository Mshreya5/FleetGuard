const INDIAN_VEHICLE_NUM_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
const LICENSE_REGEX = /^[A-Z0-9-]{8,20}$/;
const NAME_REGEX = /^[a-zA-Z\s]{2,50}$/;

const validateVehicleData = (data, isUpdate = false) => {
  const errors = [];
  const { registrationNumber, model, manufacturingYear, mileage, vin } = data;

  if (registrationNumber || !isUpdate) {
    if (!registrationNumber || typeof registrationNumber !== 'string') {
      errors.push('Vehicle registration number is required');
    } else {
      const cleanReg = registrationNumber.trim();
      if (!INDIAN_VEHICLE_NUM_REGEX.test(cleanReg)) {
        errors.push(`Invalid Indian vehicle registration number format (${cleanReg}). Must be uppercase without hyphens or spaces. Example: KA01AB1234, MH12DE1234`);
      }
    }
  }

  if (model || !isUpdate) {
    if (!model || typeof model !== 'string') {
      errors.push('Vehicle model is required');
    } else {
      const cleanModel = model.trim();
      if (cleanModel.length < 2 || cleanModel.length > 50) {
        errors.push('Vehicle model must be between 2 and 50 characters');
      }
      if (/^\d+$/.test(cleanModel)) {
        errors.push('Vehicle model cannot contain numbers only');
      }
    }
  }

  if (manufacturingYear !== undefined || !isUpdate) {
    const currentYear = new Date().getFullYear();
    const yearNum = Number(manufacturingYear);
    if (isNaN(yearNum) || yearNum < 1980 || yearNum > currentYear) {
      errors.push(`Manufacturing year must be a valid number between 1980 and ${currentYear}`);
    }
  }

  if (mileage !== undefined || !isUpdate) {
    const mileageNum = Number(mileage);
    if (isNaN(mileageNum) || mileageNum < 0 || mileageNum > 2000000) {
      errors.push('Mileage must be a positive number up to 2,000,000 km');
    }
  }

  if (vin) {
    const cleanVin = vin.trim().toUpperCase();
    if (!VIN_REGEX.test(cleanVin)) {
      errors.push('VIN must be exactly 17 uppercase alphanumeric characters (excluding I, O, Q)');
    }
  }

  return errors;
};

const validateUserData = (data, isUpdate = false) => {
  const errors = [];
  const { name, email, phone, password, licenseNumber, role } = data;

  if (name || !isUpdate) {
    if (!name || typeof name !== 'string' || !NAME_REGEX.test(name.trim())) {
      errors.push('Name must contain only alphabets and spaces, between 2 and 50 characters');
    }
  }

  if (email || !isUpdate) {
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      errors.push('Please enter a valid RFC-compliant email address (e.g. user@domain.com)');
    }
  }

  if (phone) {
    if (!PHONE_REGEX.test(String(phone).trim())) {
      errors.push('Phone number must be exactly 10 digits starting with 6, 7, 8, or 9');
    }
  }

  if (password && (!isUpdate || password.length > 0)) {
    if (!PASSWORD_REGEX.test(password)) {
      errors.push('Password must be at least 8 characters long, containing uppercase, lowercase, a number, and a special character');
    }
  }

  if (licenseNumber) {
    if (!LICENSE_REGEX.test(licenseNumber.trim().toUpperCase())) {
      errors.push('License number format is invalid (expected 8-20 alphanumeric characters/hyphens)');
    }
  }

  if (role && !['Admin', 'Fleet Manager', 'Driver', 'Service Center'].includes(role)) {
    errors.push('Invalid user role specified');
  }

  return errors;
};

const validateDates = ({ issueDate, expiryDate, serviceDate, isHistorical = false }) => {
  const errors = [];
  const now = new Date();

  if (issueDate && expiryDate) {
    const issue = new Date(issueDate);
    const expiry = new Date(expiryDate);
    if (isNaN(issue.getTime()) || isNaN(expiry.getTime())) {
      errors.push('Invalid date format provided');
    } else if (expiry < issue) {
      errors.push('Expiry date cannot be before issue date');
    }
  }

  if (serviceDate) {
    const service = new Date(serviceDate);
    if (isNaN(service.getTime())) {
      errors.push('Invalid service date provided');
    } else if (service > now) {
      errors.push('Service date cannot be in the future');
    }
  }

  if (expiryDate && !isHistorical) {
    const expiry = new Date(expiryDate);
    if (expiry < now) {
      errors.push('Insurance/compliance document cannot be already expired when creating new record');
    }
  }

  return errors;
};

module.exports = {
  INDIAN_VEHICLE_NUM_REGEX,
  VIN_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  PASSWORD_REGEX,
  LICENSE_REGEX,
  NAME_REGEX,
  validateVehicleData,
  validateUserData,
  validateDates,
};
