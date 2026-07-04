import { describe, it, expect } from 'vitest';
import { sanitizeString, isValidEmail, isValidUsername, safeJsonParse } from '../services/security';

describe('Security Utilities', () => {
  describe('sanitizeString', () => {
    it('should strip script tags', () => {
      const dirty = 'Hello <script>alert("XSS")</script> World';
      expect(sanitizeString(dirty)).toBe('Hello  World');
    });

    it('should strip event handlers', () => {
      const dirty = '<button onclick="alert(1)">Click</button>';
      expect(sanitizeString(dirty)).toBe('<button >Click</button>');
    });

    it('should replace javascript links with #', () => {
      const dirty = '<a href="javascript:alert(1)">Link</a>';
      expect(sanitizeString(dirty)).toBe('<a href="#">Link</a>');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+label@sub.domain.co.uk')).toBe(true);
    });

    it('should invalidate incorrect emails', () => {
      expect(isValidEmail('testexample.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@domain')).toBe(false);
    });
  });

  describe('isValidUsername', () => {
    it('should validate correct usernames', () => {
      expect(isValidUsername('john_doe')).toBe(true);
      expect(isValidUsername('admin123')).toBe(true);
    });

    it('should invalidate too short or too long usernames', () => {
      expect(isValidUsername('ab')).toBe(false);
      expect(isValidUsername('a'.repeat(21))).toBe(false);
    });

    it('should invalidate usernames with illegal characters', () => {
      expect(isValidUsername('john.doe')).toBe(false);
      expect(isValidUsername('john@doe')).toBe(false);
    });
  });

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      const json = '{"key": "value"}';
      expect(safeJsonParse<{ key: string }>(json)).toEqual({ key: 'value' });
    });

    it('should sanitize and parse JSON with dangerous contents', () => {
      const json = '{"key": "<script>alert(1)</script>value"}';
      expect(safeJsonParse<{ key: string }>(json)).toEqual({ key: 'value' });
    });

    it('should return null for invalid JSON', () => {
      const json = '{invalid json}';
      expect(safeJsonParse(json)).toBeNull();
    });
  });
});
