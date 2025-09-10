import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68c11a1ea76f1f46c1227a35", 
  requiresAuth: true // Ensure authentication is required for all operations
});
