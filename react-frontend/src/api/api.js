import axios from 'axios';
import Config from '../helpers/Config';
import { authProvider } from '../helpers/authProvider';
// import { authProviderV2 } from '../helpers/authProviderV2';
import { loginRequest } from '../helpers/AuthConfig';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

const api = axios.create({
    baseURL: Config.apiEndPoint,
    headers: {
        'Content-Type': 'application/json',
    },
});

const setToken = async (request) => {
    try {
        // TODO: New code for updated MSAL lib
        // get id token from auth Provider
        console.log('getting token')
        const currentAccounts = authProvider.getAllAccounts();
        const token = await authProvider.acquireTokenSilent({
          ...loginRequest,
          account: currentAccounts[0]
        })
          .catch(error => {
            console.log('acquireTokenSilent encountered an error');
            console.log(error);
            // acquireTokenSilent can fail for a number of reasons, fallback to interaction
            if (error instanceof InteractionRequiredAuthError) {
                authProvider.acquireTokenRedirect(loginRequest);
            }
            throw error;
          });
        console.log(token);
        // TODO: idk but normally you should be sending access tokens, but this is a prob over HTTPS
        request.headers['Authorization'] = `Bearer ${token.accessToken}`;
        // TODO: would using ID Tokens work?
        // request.headers['Authorization'] = `Bearer ${token.idToken}`;

    } catch (err) {
        console.log(err);
        console.log('setToken error')
        // Acquire token silent failure, and send an interactive request
        if (err instanceof InteractionRequiredAuthError) {
          authProvider.acquireTokenRedirect(loginRequest);
        }
    }
};

api.interceptors.request.use(
    async (request) => {
        await setToken(request);
        return request;
    },
    (error) => {
        console.log('Axios: API request error');
        console.log(error);
        // TODO: consider this use case
        // check if the token is no longer valid
        // ie. Token has expired
        // logout the user if the token has expired
        return Promise.reject(error);
    }
);

api.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log('Axios: API response');
    // console.log(response);
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.log('Axios: API response error');
    // console.log(error);
    // if (error instanceof InteractionRequiredAuthError) {
    //   authProviderV2.acquireTokenRedirect(loginRequest);
    // }
    return Promise.reject(error);
});

export default api;
