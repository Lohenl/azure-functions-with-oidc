import { Fragment, useEffect, useState } from 'react';
import { Drawer, DrawerContent } from "@progress/kendo-react-layout";
import { useLocation, useNavigate } from 'react-router-dom';

import Header from './Header';
// import Footer from './Footer';
import DrawerOptions from './DrawerOptions';
import { publicRoutes } from '../../routes';
// import { authProvider } from '../../helpers/authProvider';
// import { AuthenticationState } from 'react-aad-msal';

const DrawerRouterContainer = (props) => {
    const [isAuthProtected, setIsAuthProtected] = useState(false);
    const [expanded, setExpanded] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // on browser navigation, check if path is public
    // show/hide the appropiate ui controls
    useEffect(() => {
        if (!location) return;
        let _routes = publicRoutes.filter(o => o.path === location.pathname);
        setIsAuthProtected(!_routes.length > 0);
    }, [location])

    const toggleDrawerExpansion = () => {
        setExpanded(!expanded);
    };

    const onSelect = (e) => {
        if (!e.itemTarget.props.route) return;
        setSelectedItem(e.itemTarget.props.route);
        setExpanded(false);
        navigate(e.itemTarget.props.route);
    };

    const setSelectedItem = (pathName) => {
        let currentPath = DrawerOptions.find((item) => item.route === pathName);
        if (!currentPath) return;
        if (currentPath.text) {
            return currentPath.text;
        }
    };

    let selected = setSelectedItem(location.pathname);

    return (
        <Fragment>
            <style>{`
                body {
                    background: #dfdfdf;
                }
                .title {
                    font-size: 18px;
                    margin: 0;
                }
                .k-badge-container {
                    margin-right: 8px;
                }
                .k-drawer-container {
                    top: '39.5px',
                    width: 100%;
                    height: 100%;
                }
                .k-drawer-item {
                    margin-left: 0;
                    margin-right: 0;
                    user-select: none;
                }
                .k-drawer {
                    min-height: 90vh;
                }
                .page-content {
                    padding-top: 30px !important;
                }
            `}
            </style>
            <Header
                isAuthProtected={isAuthProtected}
                toggleDrawerExpansion={toggleDrawerExpansion}
            />
            {isAuthProtected ? (
                <Drawer
                    expanded={expanded}
                    position={"start"}
                    mode={"push"}
                    mini={true}
                    items={DrawerOptions.map((item) => ({
                        ...item,
                        selected: item.text === selected,
                    }))}
                    onSelect={onSelect}
                >
                    <DrawerContent>
                        {props.children}
                        {/* <Footer /> */}
                    </DrawerContent>
                </Drawer>
            ) : (
                <Fragment>
                    {props.children}
                </Fragment>
            )}
        </Fragment>
    );


    // TODO: revisit this after rebuilding layout or when msal becomes a prority

    // return (
    //     <Route
    //         {...rest}
    //         render={(props) => {
    //             if (isAuthProtected && authProvider.authenticationState !== AuthenticationState.Authenticated) {
    //                 return (
    //                     <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    //                 );
    //             }

    //             return (
    //                 <Fragment>
    //                     <Header
    //                         toggleDrawerExpansion={toggleDrawerExpansion}
    //                     />
    //                     <Drawer
    //                         expanded={expanded}
    //                         position={"start"}
    //                         mode={"push"}
    //                         mini={true}
    //                         items={DrawerOptions.map((item) => ({
    //                             ...item,
    //                             selected: item.text === selected,
    //                         }))}
    //                         onSelect={onSelect}
    //                     >
    //                         <DrawerContent>
    //                             <Component {...props} />
    //                         </DrawerContent>
    //                     </Drawer>
    //                 </Fragment>
    //             );
    //         }}
    //     />
    // );

}

export default DrawerRouterContainer;
