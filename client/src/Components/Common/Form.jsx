import React, { useState } from 'react';
import { validateForm } from '../../utils/validation';

const Form = ({
  children,
  onSubmit,
  validationSchema,
  initialValues = {},
  className = ''
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate form
    const { isValid, errors: validationErrors } = validateForm(formData, validationSchema);
    setErrors(validationErrors);

    if (isValid) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            value: formData[child.props.name] || '',
            onChange: handleChange,
            onBlur: handleBlur,
            error: touched[child.props.name] ? errors[child.props.name] : null
          });
        }
        return child;
      })}
    </form>
  );
};

export default Form; 