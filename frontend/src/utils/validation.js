import { VALIDATION_RULES, MESSAGES } from '../constants/api';

// Generic validation functions
export const validateRequired = (value, fieldName) => {
  if (!value || !value.trim()) {
    return MESSAGES[`${fieldName.toUpperCase()}_REQUIRED`] || `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) {
    return MESSAGES.EMAIL_REQUIRED;
  }
  if (!VALIDATION_RULES.EMAIL.test(email)) {
    return MESSAGES.EMAIL_INVALID;
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return MESSAGES.PASSWORD_REQUIRED;
  }
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return MESSAGES.PASSWORD_MIN_LENGTH;
  }
  return null;
};

export const validateName = (name) => {
  if (!name) {
    return MESSAGES.NAME_REQUIRED;
  }
  if (name.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return MESSAGES.NAME_MIN_LENGTH;
  }
  return null;
};

export const validateLength = (value, fieldName, minLength, maxLength) => {
  if (!value || value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  if (maxLength && value.length > maxLength) {
    return `${fieldName} must be at most ${maxLength} characters`;
  }
  return null;
};

export const validateRating = (rating) => {
  if (!rating) {
    return MESSAGES.RATING_REQUIRED;
  }
  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < VALIDATION_RULES.RATING_MIN || numRating > VALIDATION_RULES.RATING_MAX) {
    return `Rating must be between ${VALIDATION_RULES.RATING_MIN} and ${VALIDATION_RULES.RATING_MAX}`;
  }
  return null;
};

// Form-specific validation
export const validateLoginForm = (formData) => {
  const errors = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

export const validateRegisterForm = (formData) => {
  const errors = {};
  
  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

export const validateBookForm = (formData) => {
  const errors = {};
  
  const titleError = validateLength(formData.title, 'Title', VALIDATION_RULES.TITLE_MIN_LENGTH, VALIDATION_RULES.TITLE_MAX_LENGTH);
  if (titleError) errors.title = titleError;
  
  const authorError = validateLength(formData.author, 'Author', VALIDATION_RULES.AUTHOR_MIN_LENGTH, VALIDATION_RULES.AUTHOR_MAX_LENGTH);
  if (authorError) errors.author = authorError;
  
  const genreError = validateLength(formData.genre, 'Genre', VALIDATION_RULES.GENRE_MIN_LENGTH, VALIDATION_RULES.GENRE_MAX_LENGTH);
  if (genreError) errors.genre = genreError;
  
  const descriptionError = validateLength(formData.description, 'Description', VALIDATION_RULES.DESCRIPTION_MIN_LENGTH, VALIDATION_RULES.DESCRIPTION_MAX_LENGTH);
  if (descriptionError) errors.description = descriptionError;
  
  return errors;
};

export const validateReviewForm = (formData) => {
  const errors = {};
  
  const ratingError = validateRating(formData.rating);
  if (ratingError) errors.rating = ratingError;
  
  const commentError = validateLength(formData.comment, 'Comment', VALIDATION_RULES.COMMENT_MIN_LENGTH, VALIDATION_RULES.COMMENT_MAX_LENGTH);
  if (commentError) errors.comment = commentError;
  
  return errors;
};

// Utility function to check if form is valid
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};

// Utility function to clear field error when user starts typing
export const clearFieldError = (errors, setErrors, fieldName) => {
  if (errors[fieldName]) {
    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  }
}; 