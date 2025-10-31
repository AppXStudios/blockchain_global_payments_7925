const crypto = require('crypto');

/**
 * Security utilities for BGP platform
 * Provides secure token generation and validation functions
 */

/**
 * Generate a cryptographically secure random token
 * @param {number} length - Length of the token in bytes (default: 32)
 * @returns {string} - Hex-encoded random token
 */
function generateSecureToken(length = 32) {
  return crypto?.randomBytes(length)?.toString('hex');
}

/**
 * Generate a secure API key with prefix
 * @param {string} prefix - Prefix for the API key (default: 'bgp')
 * @returns {string} - Formatted API key
 */
function generateAPIKey(prefix = 'bgp') {
  const timestamp = Date.now()?.toString(36);
  const random = generateSecureToken(16);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Hash a password or sensitive data using SHA-256
 * @param {string} data - Data to hash
 * @param {string} salt - Salt to use (optional)
 * @returns {string} - Hex-encoded hash
 */
function hashData(data, salt = '') {
  const hash = crypto?.createHash('sha256');
  hash?.update(data + salt);
  return hash?.digest('hex');
}

/**
 * Generate a secure hash for webhook signatures
 * @param {string} data - Data to sign
 * @param {string} secret - Secret key
 * @returns {string} - HMAC-SHA512 signature
 */
function generateHMACSignature(data, secret) {
  const hmac = crypto?.createHmac('sha512', secret);
  hmac?.update(data);
  return hmac?.digest('hex');
}

/**
 * Verify HMAC signature
 * @param {string} data - Original data
 * @param {string} signature - Signature to verify
 * @param {string} secret - Secret key
 * @returns {boolean} - True if signature is valid
 */
function verifyHMACSignature(data, signature, secret) {
  const expectedSignature = generateHMACSignature(data, secret);
  return crypto?.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

/**
 * Sanitize user input for security
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }
  
  return (
    // Remove quotes
    // Remove potential HTML tags
    input?.trim()?.replace(/[<>]/g, '')?.replace(/['"]/g, '')?.substring(0, 1000)
  ); // Limit length
}

/**
 * Generate a secure session token
 * @returns {string} - Session token
 */
function generateSessionToken() {
  return generateSecureToken(64);
}

/**
 * Check if a string is a valid UUID
 * @param {string} uuid - UUID to validate
 * @returns {boolean} - True if valid UUID
 */
function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex?.test(uuid);
}

/**
 * Generate a random invoice/order ID
 * @param {string} prefix - Prefix for the ID
 * @returns {string} - Formatted ID
 */
function generateOrderID(prefix = 'ord') {
  const timestamp = Date.now();
  const random = Math.random()?.toString(36)?.substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

module.exports = {
  generateSecureToken,
  generateAPIKey,
  hashData,
  generateHMACSignature,
  verifyHMACSignature,
  sanitizeInput,
  generateSessionToken,
  isValidUUID,
  generateOrderID
};