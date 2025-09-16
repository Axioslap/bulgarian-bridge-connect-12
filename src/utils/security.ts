
// Security utilities for input validation and sanitization

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" };
  }
  if (password.length > 128) {
    return { isValid: false, message: "Password must be less than 128 characters" };
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter, one lowercase letter, and one number" };
  }
  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  // Basic XSS prevention - remove script tags and dangerous attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const validateTextInput = (input: string, maxLength: number = 1000): { isValid: boolean; sanitized: string } => {
  const sanitized = sanitizeInput(input);
  const isValid = sanitized.length <= maxLength && sanitized.length > 0;
  return { isValid, sanitized };
};

// REMOVED: Insecure manual JWT validation functions
// These functions contained security vulnerabilities and are not needed
// when using Supabase's built-in authentication system
// Use supabase.auth.getUser() and supabase.auth.getSession() instead

export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
