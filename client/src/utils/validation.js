export const validationRules = {
  required: (value) => ({
    isValid: value && value.trim() !== '',
    message: 'This field is required'
  }),
  
  minLength: (value, min) => ({
    isValid: value && value.length >= min,
    message: `Must be at least ${min} characters`
  }),
  
  maxLength: (value, max) => ({
    isValid: value && value.length <= max,
    message: `Must not exceed ${max} characters`
  }),
  
  email: (value) => ({
    isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  }),
  
  phone: (value) => ({
    isValid: /^(01[0125])\d{8}$|^02\d{8}$/.test(value),
    message: 'Please enter a valid Egyptian phone number'
  }),
  
  number: (value) => ({
    isValid: !isNaN(value),
    message: 'Please enter a valid number'
  }),
  
  minValue: (value, min) => ({
    isValid: !isNaN(value) && Number(value) >= min,
    message: `Value must be greater than or equal to ${min}`
  }),
  
  maxValue: (value, max) => ({
    isValid: !isNaN(value) && Number(value) <= max,
    message: `Value must be less than or equal to ${max}`
  }),
  
  pattern: (value, pattern) => ({
    isValid: pattern.test(value),
    message: 'Invalid format'
  })
};

export const validateField = (value, rules) => {
  const errors = [];
  
  for (const rule of rules) {
    const { isValid, message } = validationRules[rule.type](value, rule.value);
    if (!isValid) {
      errors.push(message);
    }
  }
  
  return errors;
};

export const validateForm = (formData, validationSchema) => {
  const errors = {};
  
  for (const [field, rules] of Object.entries(validationSchema)) {
    const fieldErrors = validateField(formData[field], rules);
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors[0];
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 