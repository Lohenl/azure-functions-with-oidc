import { Fragment, useEffect, useState } from 'react'
import { InteractionStatus } from '@azure/msal-browser';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal } from '@azure/msal-react';
import { Routes, HashRouter, Route } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Loader } from "@progress/kendo-react-indicators";

import { loginRequest } from './helpers/AuthConfig';
import DrawerRouterContainer from './components/Layout/DrawerRouterContainer';
import { AuthProvider } from './pages/.sharedcontexts/AuthContext';
import { authProtectedRoutes, publicRoutes } from './routes/';

import '@progress/kendo-theme-bootstrap/dist/all.css';

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  // instantly redirects to login
  // TODO: bake a proper UX sometime for non-onboarded users (i do have non-auth pages and layouts)
  // reference: // https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/errors.md#interaction_in_progress
  // TODO: consider tying in MsalProvider with createHashProvider
  // ideal state is that I dont use a messy combo of react state, conditional renders and auth/unauthTemplates
  // useEffect(() => {
  //   console.log('App.js: useEffect()');
  //   console.log(`isAuthenticated: ${isAuthenticated}, inProgress: ${inProgress}`);
  //   if (inProgress === InteractionStatus.Startup) {
  //     console.log('still starting up')
  //     return;
  //   };
  //   instance.handleRedirectPromise().then((tokenResponse) => {
  //     if (!tokenResponse) {
  //       // If .then was called but result is falsey, that means your app is not returning
  //       // from a redirect operation (e.g. user visiting the site for the first time)
  //       console.log('first time');
  //       console.log(`isAuthenticated: ${isAuthenticated}, inProgress: ${inProgress}`);
  //       // V1
  //       // instance.loginRedirect(loginRequest);

  //       // V2
  //       const accounts = instance.getAllAccounts();
  //       if (accounts.length === 0) {
  //         // No user signed in
  //         if (!isAuthenticated && inProgress === InteractionStatus.None) {
  //           console.log('BOOM MOTHERLOVER')
  //           instance.loginRedirect();
  //         }
  //       }
  //     } else {
  //       // If result is truthy, your app returned from a redirect operation,
  //       // and it completed successfully
  //       console.log('redirect was successful');
  //       console.log(`isAuthenticated: ${isAuthenticated}, inProgress: ${inProgress}`);
  //       if (!isAuthenticated && inProgress === InteractionStatus.None) {
  //         console.log('App.js: loginRedirect()');
  //         instance.loginRedirect(loginRequest);
  //       } else {
  //         console.log('App.js: setLoggedIn()');
  //         setLoggedIn(true);
  //       }
  //     }
  //   })


  // }, [isAuthenticated, inProgress, instance]);

  // https://stackoverflow.com/questions/66405214/browserautherror-interaction-in-progress-interaction-is-currently-in-progress
  // https://stackoverflow.com/questions/66405214/browserautherror-interaction-in-progress-interaction-is-currently-in-progress

  useEffect(() => {
    console.log(isAuthenticated);
    console.log(inProgress);
    console.log(instance);
    const forceLogin = async () => {
      const tokenResponse = await instance.handleRedirectPromise();
      console.log(tokenResponse);
      const accounts = instance.getAllAccounts();
      if (accounts.length === 0) {
        // No user signed in
        if (!isAuthenticated && inProgress === InteractionStatus.None) {
          console.log('performing redirect')
          await instance.loginRedirect(loginRequest);
        }
      } else {
        console.log('App.js: setLoggedIn()');
        setLoggedIn(true);
      }
    };
    forceLogin().catch(console.error);
  }, [isAuthenticated, inProgress, instance])

  // TODO: the whole conditional rendering, especially with providers is messy because
  // I have not found a way to properly bake in msalprovider into hashrouter
  // because oidc implicit flow and some other standard config likes to use hash as well.
  return (
    <Fragment>

      <UnauthenticatedTemplate>
        <p style={{ marginTop: '200px', textAlign: 'center' }}>Please wait while we redirect you to login</p>
        <div style={{ textAlign: 'center' }}>
          <Loader size="large" type={'converging-spinner'} />
        </div>
      </UnauthenticatedTemplate>

      <AuthenticatedTemplate>
        {loggedIn && (
          <HashRouter>
            <AuthProvider>
              <DrawerRouterContainer>
                <Routes>
                  {publicRoutes.map((route) => (
                    <Route
                      path={route.path}
                      element={<route.component />}
                      key={uuidv4()}
                    />
                  ))}
                  {authProtectedRoutes.map((route) => (
                    <Route
                      path={route.path}
                      element={<route.component />}
                      key={uuidv4()}
                    />
                  ))}
                </Routes>
              </DrawerRouterContainer>
            </AuthProvider>
          </HashRouter>
        )}
      </AuthenticatedTemplate>

    </Fragment>

  );
}

export default App;
