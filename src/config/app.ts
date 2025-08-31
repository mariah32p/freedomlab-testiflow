// App configuration
export const APP_CONFIG = {
  // Set to false for mock mode (landing page only)
  // Set to true when ready for production with real auth
  ENABLE_REAL_AUTH: true,
  
  // Mock user data for demo purposes
  MOCK_USER: {
    id: 'mock-user-123',
    email: 'demo@example.com',
    created_at: new Date().toISOString(),
  }
};