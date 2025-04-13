import React, { useState, useEffect } from 'react';
import { validateField } from '../../utils/validation';

const FormInput = ({
  type = 'text',
  name,
  label,
  value,
  onChange,
  onBlur,
  validationRules = [],
  placeholder = '',
  className = '',
  required = false,
  disabled = false
}) => {
  const [errors, setErrors] = useState([]);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched) {
      const validationErrors = validateField(value, validationRules);
      setErrors(validationErrors);
    }
  }, [value, touched, validationRules]);

  const handleBlur = (e) => {
    setTouched(true);
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`form-control ${touched && errors.length > 0 ? 'is-invalid' : ''}`}
        disabled={disabled}
        required={required}
      />
      {touched && errors.length > 0 && (
        <div className="invalid-feedback">
          {errors[0]}
        </div>
      )}
    </div>
  );
};

export default FormInput; 