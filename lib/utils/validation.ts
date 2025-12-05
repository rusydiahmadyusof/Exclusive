/**
 * Security validation utilities
 */

/**
 * Validate UUID format
 */
export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Sanitize search query to prevent injection
 */
export const sanitizeSearchQuery = (query: string): string => {
  // Remove potentially dangerous characters
  return query
    .trim()
    .replace(/[<>'"\\]/g, '')
    .slice(0, 100); // Limit length
};

/**
 * Validate and sanitize numeric input
 */
export const validateNumber = (value: any, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number | null => {
  const num = typeof value === 'string' ? parseInt(value, 10) : Number(value);
  if (isNaN(num) || num < min || num > max) {
    return null;
  }
  return num;
};

/**
 * Validate quantity (1-999)
 */
export const validateQuantity = (quantity: any): number | null => {
  return validateNumber(quantity, 1, 999);
};

