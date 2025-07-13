import { toast } from 'react-toastify';
import { STATUS_CODES, MESSAGES } from '../constants/api';

// Enhanced error logging
export const logError = (error, context = {}) => {
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

  const status = error.response?.status;
  const serverMessage = error.response?.data?.message;
  
  let message = MESSAGES.SERVER_ERROR;

  // Check for custom messages first
  if (customMessages[status]) {
    message = customMessages[status];
  } else if (serverMessage) {
    message = serverMessage;
  } else {
    // Default messages based on status code
    switch (status) {
      case STATUS_CODES.BAD_REQUEST:
        message = MESSAGES.VALIDATION_ERROR;
        break;
      case STATUS_CODES.UNAUTHORIZED:
        message = MESSAGES.UNAUTHORIZED;
        break;
      case STATUS_CODES.FORBIDDEN:
        message = MESSAGES.FORBIDDEN;
        break;
      case STATUS_CODES.NOT_FOUND:
        message = MESSAGES.NOT_FOUND;
        break;
      case STATUS_CODES.CONFLICT:
        message = serverMessage || 'Resource already exists';
        break;
      case STATUS_CODES.INTERNAL_SERVER_ERROR:
        message = MESSAGES.SERVER_ERROR;
        break;
      default:
        if (!error.response) {
          message = MESSAGES.NETWORK_ERROR;
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
      throw error;
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
      throw error;
    } finally {
      setLoading(false);
    }
  };
}; 