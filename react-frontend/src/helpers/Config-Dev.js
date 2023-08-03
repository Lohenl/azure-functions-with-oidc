// For react-scripts env, you will need to prefix with REACT_APP_
const appId = process.env.REACT_APP_AZURE_APP_ID;
const tenantId = process.env.REACT_APP_AZURE_TENANT_ID;
const apiEndPoint = process.env.REACT_APP_AZURE_FUNCTIONS_URL;

module.exports = {
  appId,
  tenantId,
  // scopes: ['user.read', 'profile'],
  scopes: ['openid', 'email', 'user.read', 'profile'],
  redirectUri: 'http://localhost:3000',
  apiEndPoint,
  // appInsightInstrumentationKey: '467657f9-b09d-4563-8f82-352c1e18952e',
};
