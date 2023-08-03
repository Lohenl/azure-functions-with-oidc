// For react-scripts env, you will need to prefix with REACT_APP_
const appId = process.env.REACT_APP_AZURE_APP_ID;
const tenantId = process.env.REACT_APP_AZURE_TENANT_ID;
const apiEndPoint = process.env.REACT_APP_AZURE_FUNCTIONS_URL;

module.exports = {
  appId,
  tenantId,
  scopes: ['openid', 'offline_access', 'email', 'profile', 'user.read'],
  redirectUri: 'http://localhost:3000',
  apiEndPoint,
};
