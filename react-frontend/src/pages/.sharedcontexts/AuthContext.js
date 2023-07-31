import { createContext, useEffect, useState } from 'react';
// import { appInsights } from '../../helpers/AppInsights';
// import { InteractionStatus } from '@azure/msal-browser';
// import { useIsAuthenticated, useMsal } from '@azure/msal-react';
// import { authProviderV2 } from '../../helpers/authProviderV2';
// import { loginRequest } from '../../helpers/AuthConfig';
// import { InteractionRequiredAuthError } from '@azure/msal-browser';

import * as AccessAPI from '../../api/Access';
import * as ProfileAPI from '../../api/Profile';

const AuthContext = createContext({
    reloadPromisified: () => { },
    reload: () => { },
    reloadTenants: () => { },
    getUserName: () => { },
    hasPermission: () => { },
    hasAnyPermission: () => { },
    hasGlobalPermission: () => { },
    canAccessAllTenants: () => { },
    getTenants: () => { },
    isFromTenant: () => { },
    canAccessAgency: () => { },
    logout: () => { },
});

const AuthProvider = (props) => {
    const [user, setUser] = useState();
    const [tenants, setTenants] = useState();
    // const { instance, inProgress } = useMsal();
    // const isAuthenticated = useIsAuthenticated();

    /**
     * Loading / Reloading methods
     */

    /**
     * Fetches current user details from the backend
     * @returns {Promise}
     */
    const loadUser = () => {
        return new Promise((resolve, reject) => {

            AccessAPI.getAccessByUserId().then(
                (response) => {
                    setUser(response.data);
                    console.log('AuthContext: Finished with load user');
                    resolve(response.data);
                    // retrieve user's tenant details
                    loadTenant();
                }, (error) => {
                    // appInsights.trackException({ error });
                    reject(error);
                });
        });
    }

    /**
     * Fetches current user's tenant details from the backend
     */
    const loadTenant = () => {
        return new Promise((resolve, reject) => {
            ProfileAPI.getProfile().then(
                (response) => {
                    setTenants(response.data);
                    resolve(response.data);
                }, (error) => {
                    // appInsights.trackException({ error });
                    reject(error);
                });
        });
    }

    /**
     * Promisified version of reload
     * @deprecated ONLY FOR USE BY PROFILE PAGE + LAYOUT, remove when app is properly rebuilt
     * @returns {Promise} Promise resolving into tenant list
     */
    const reloadPromisified = () => {
        return new Promise((resolve, reject) => {
            AccessAPI.getAccessByUserId().then(
                (response) => {
                    setUser(response.data);
                    ProfileAPI.getProfile().then(
                        (tenants) => {
                            setTenants(tenants.data);
                            resolve({
                                userDetail: response.data,
                                tenants: tenants.data,
                            });
                        }, (error) => {
                            reject(error);
                            // appInsights.trackException({ error });
                        });
                }, (error) => {
                    reject(error);
                    // appInsights.trackException({ error });
                });
        });
    }

    useEffect(() => {
        // authProviderv2 custom start point
        // fetch user on context initialization
        console.log('AuthContext: Initializing');
        // if (!isAuthenticated && inProgress === InteractionStatus.None) {
        //     console.log('AuthContext: no login or user has already logged in, doing redirect');
        //     instance.loginRedirect(loginRequest);
        // } else {
        //     const currentAccounts = authProviderV2.getAllAccounts();
        //     authProviderV2.acquireTokenSilent({ ...loginRequest, account: currentAccounts[0] })
        //         .then(() => {
        //             loadUser();
        //         })
        //         .catch(error => {
        //             console.log('acquireTokenSilent encountered an error');
        //             console.log(error);
        //             // acquireTokenSilent can fail for a number of reasons, fallback to interaction
        //             if (error instanceof InteractionRequiredAuthError) {
        //                 authProviderV2.acquireTokenRedirect(loginRequest);
        //             }
        //             throw error;
        //         });
        // }
        loadUser();
    }, []);

    /**
     * Reloads current user details from the backend
     */
    const reload = async () => {
        loadUser();
    }

    /**
     * Reloads current user's tenant details from the backend
     */
    const reloadTenants = async () => {
        loadTenant();
    }

    /**
     * Returns current user's username
     * @returns {string} current user's username
     */
    const getUserName = () => {
        return user[0].preferred_username;
    };

    /**
     * Returns a complete list of permissions of current user for a given tenant profile_id
     * @param {string} profile_id - tenant's profile_id 
     * @returns {string[]} complete list of permissions of current user, undefined if no match
     */
    const getTenantPermissions = (profile_id) => {
        let _assignment = user.filter(o => o.profile_id === profile_id)[0];
        if (!_assignment) {
            return [];
        } else {
            return _assignment.permissions.permissions;
        };
    };

    const getGlobalPermissions = () => {
        return user.filter(o => o.allowAccessToAllTenant === true);
    };

    /**
     * Returns true if current user has access to the IAM permission 
     * for the tenant specified
     * @param {string} permission 
     * @returns  {boolean} true if user has access to specified permission
     */
    const hasPermission = (permission, profile_id) => {

        // check for cross-tenant permission (isAllowAccessToAllTenant + resource name)
        let _globalPermissions = getGlobalPermissions();
        if (_globalPermissions.length > 0) {
            let _permissionMatch = _globalPermissions.filter((o) => {
                let pArr = o.permissions.permissions.filter(p => p === permission);
                return (pArr.length > 0);
            });
            // return true if there is a cross-tenant permission match, continue otherwise
            if (_permissionMatch.length > 0) {
                return true;
            };
        }

        // check for tenant-level access
        let tenantPermissions = getTenantPermissions(profile_id);

        let _permissions = tenantPermissions.filter(o => o === permission);
        return (_permissions.length > 0);
    }

    /**
     * Returns true if user has specified permission in any of the tenants
     * @param {string} permission 
     * @returns true if user has specified permission in any of the tenants
     */
    const hasAnyPermission = (permission) => {
        let _permissions = user.filter((o) => {
            let xArr = o.permissions.permissions.filter(x => {
                return (x === permission);
            });
            return (xArr.length > 0);
        });
        return (_permissions.length > 0);
    }

    const hasGlobalPermission = (permission) => {
        let _permissions = getGlobalPermissions().filter((o) => {
            let xArr = o.permissions.permissions.filter(x => x === permission);
            return (xArr.length > 0);
        });
        return (_permissions.length > 0);
    };

    /**
     * Returns true if current user has access to all tenants,
     * so long as user has at least 1 role assignment with allowAccessToAllTenant set to true
     * @returns {boolean} true if current user has access to all tenants
     */
    const canAccessAllTenants = () => {
        let _user = user.filter(u => u.allowAccessToAllTenant)
        return (_user.length > 0);
    };

    /**
     * Methods based on Tenants associated with user
     */

    /**
     * Returns list of tenants associated with the current user
     * @returns {Promise} list of tenants associated with the current user
     */
    const getTenants = () => {
        return new Promise((resolve) => {
            if (!!tenants) {
                resolve(tenants)
            } else {
                resolve(loadTenant());
            };
        });
    }

    /**
     * Returns true if current user belongs to specified tenant
     * @param {string} tenant - tenant name
     * @returns {boolean} true if user is part of tenant
     */
    const isFromTenant = (tenant) => {
        let _tenants = [...tenants].filter(o => o.tenant_name === tenant);
        return (_tenants.length > 0);
    };

    /**
     * Returns true if current user has access to specified agency
     * @param {string} agency full name, e.g. 'GOVERNMENT TECHNOLOGY AGENCY (GOVTECH)' (Tip: Use the agency helper) 
     * @returns {string} true if user is part of a tenant that belongs to an agency
     */
    const canAccessAgency = (agency) => {
        let _tenants = [...tenants].filter(o => o.agency_name === agency);
        return (_tenants.length > 0);
    };

    /**
     * Misc methods
     */

    const logout = () => {
        // authProvider.logout();
    }

    return (
        <AuthContext.Provider
            value={{
                reloadPromisified,
                reload,
                reloadTenants,
                getUserName,
                hasPermission,
                hasAnyPermission,
                hasGlobalPermission,
                canAccessAllTenants,
                getTenants,
                isFromTenant,
                canAccessAgency,
                logout,
                user,
                tenants,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthProvider };
export default AuthContext;
