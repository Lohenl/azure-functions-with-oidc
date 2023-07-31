module.exports = {
  appId: process.env.AZURE_APP_ID,
  tenantId: process.env.AZURE_TENANT_ID,
  scopes: ['user.read', 'profile'],
  // scopes: ['openid', 'email', 'user.read', 'profile'],
  redirectUri: 'http://localhost:3000',
  apiEndPoint: 'http://localhost:7071/api',
  // appInsightInstrumentationKey: '467657f9-b09d-4563-8f82-352c1e18952e',
};
