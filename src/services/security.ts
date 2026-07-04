/**
 * Security services for data sanitization, input validation, and secure parsing.
 */

/**
 * Sanitizes a string by stripping script tags and other potentially dangerous HTML elements.
 * Useful for processing AI responses and user text inputs.
 * 
 * @param input The raw input string to sanitize
 * @returns The sanitized string
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  return input
    // Remove script elements
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove inline event handlers (onmouseover, onclick, etc.)
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    // Remove javascript: pseudo-protocol links
    .replace(/href="javascript:[^"]*"/gi, 'href="#"')
    .replace(/href='javascript:[^']*'/gi, 'href="#"');
}

/**
 * Validates whether a string is a valid email address.
 * 
 * @param email The email string to validate
 * @returns boolean indicating validity
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a username to match standard alphanumeric constraints.
 * 
 * @param username The username string to validate
 * @returns boolean indicating validity
 */
export function isValidUsername(username: string): boolean {
  if (!username || username.length < 3 || username.length > 20) return false;
  // Allow alphanumeric, underscores, and hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return usernameRegex.test(username);
}

/**
 * Parses and sanitizes a JSON string safely.
 * 
 * @param jsonString The raw JSON string to parse
 * @returns The parsed and sanitized object, or null if parsing fails
 */
export function safeJsonParse<T>(jsonString: string): T | null {
  try {
    const sanitized = sanitizeString(jsonString);
    return JSON.parse(sanitized) as T;
  } catch (e) {
    console.error('Failed to parse or sanitize JSON string:', e);
    return null;
  }
}
