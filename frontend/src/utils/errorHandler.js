import { toast } from 'react-toastify';
import { MESSAGES } from '../constants/api';

// Enhanced error logging
export const logError = (error, context = {}) => {
  // If error is a string, just log it
  if (typeof error === 'string') {
    console.error('FRONTEND ERROR:', error, context);
    return;
  }
  // Otherwise, log as before
  const errorInfo = {
    timestamp: new Date().toISOString(),
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    context,
    url: error.config?.url,
    method: error.config?.method
  };
  console.error('FRONTEND ERROR:', JSON.stringify(errorInfo, null, 2));
};

// Handle API errors and show appropriate user feedback
export const handleApiError = (error, customMessages = {}) => {
  logError(error, { customMessages });
  let message = error;
  // If error is an object, fallback to generic message
  if (typeof error !== 'string') {
    message = MESSAGES.SERVER_ERROR;
  }
  // Check for custom messages (by string match)
  if (customMessages && typeof customMessages === 'object') {
    for (const [key, val] of Object.entries(customMessages)) {
      if (message && message.includes(key)) {
        message = val;
        break;
      }
    }
  }
  toast.error(message);
  return message;
};

// Handle form validation errors
export const handleValidationErrors = (errors) => {
  if (typeof errors === 'object' && errors.errors) {
    // Backend validation errors
    errors.errors.forEach(error => {
      toast.error(error.msg || error.message || 'Validation error');
    });
  } else if (Array.isArray(errors)) {
    // Array of error messages
    errors.forEach(error => {
      toast.error(error);
    });
  } else if (typeof errors === 'object') {
    // Object with field-specific errors
    Object.values(errors).forEach(error => {
      if (error) {
        toast.error(error);
      }
    });
  } else if (typeof errors === 'string') {
    // Single error message
    toast.error(errors);
  }
};

// Success message handler
export const showSuccessMessage = (message, customMessage = null) => {
  const finalMessage = customMessage || message;
  toast.success(finalMessage);
};

// Warning message handler
export const showWarningMessage = (message) => {
  toast.warning(message);
};

// Info message handler
export const showInfoMessage = (message) => {
  toast.info(message);
};

// Async error wrapper for components
export const withErrorHandling = (asyncFunction, customMessages = {}) => {
  return async (...args) => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      handleApiError(error, customMessages);
    }
  };
};

// Form submission wrapper with loading state
export const withFormHandling = (asyncFunction, setLoading, customMessages = {}) => {
  return async (...args) => {
    setLoading(true);
    try {
      const result = await asyncFunction(...args);
      return result;
    } catch (error) {
      handleApiError(error, customMessages);
    } finally {
      setLoading(false);
    }
  };
}; 