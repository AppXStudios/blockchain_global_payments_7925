// Blockchain Global Payments SDK
// Complete TypeScript SDK for BGP API integration
// Compatible with Next.js frontend and Node.js backend

// Export all types with proper named exports
export * from './types';

// Export error classes
export * from './errors';

// Export utilities
export * from './utils';

// Export HTTP client
export * from './client';

// Export main API interface
export * from './api';

// Main bgp instance - Fixed export to use proper named export
import { bgp } from './api';
export { bgp };

/**
 * SDK Version
 */
export const SDK_VERSION = '1.0.0';

/**
 * SDK Info
 */
export const SDK_INFO = {
  name: 'Blockchain Global Payments SDK',
  version: SDK_VERSION,
  description: 'Complete TypeScript SDK for BGP API integration',
  author: 'Blockchain Global Payments LLC',
  homepage: 'https://blockchainpayments.com',
  repository: 'https://github.com/blockchain-global-payments/sdk',
  license: 'MIT'
} as const;

/**
 * Default export for backward compatibility
 */
const SDK = {
  bgp,
  SDK_VERSION,
  SDK_INFO
};

export default SDK;