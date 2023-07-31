import { Fragment, useRef, useState } from 'react';
import { AppBar, AppBarSection, AppBarSpacer, Avatar } from "@progress/kendo-react-layout";
import { Link } from 'react-router-dom'

import HeaderProfilePopup from './HeaderProfilePopup';
import avatarPlaceholder from '../../assets/images/placeholder/kendoka-react.png';
import { authProvider } from '../../helpers/authProvider';
// import { authProviderV2 } from '../../helpers/authProviderV2';

const Header = ({ toggleDrawerExpansion, isAuthProtected }) => {
    const profileAnchor = useRef(null);
    const [showProfilePopup, setShowProfilePopup] = useState(false);

    const profileClick = () => {
        setShowProfilePopup(!showProfilePopup);
    }

    const menuClick = () => {
        toggleDrawerExpansion();
    };

    function toggleFullscreen() {
        if (
            !document.fullscreenElement &&
          /* alternative standard method */ !document.mozFullScreenElement &&
            !document.webkitFullscreenElement
        ) {
            // current working methods
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(
                    Element.ALLOW_KEYBOARD_INPUT
                );
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }

    return (
        <Fragment>
            <AppBar>
                {isAuthProtected && (
                    <Fragment>
                        <AppBarSection>
                            <button
                                className="k-button k-button-md k-rounded-md k-button-flat k-button-flat-base"
                                onClick={menuClick}>
                                <span className="k-icon k-i-grid-layout" />
                            </button>
                        </AppBarSection>

                    </Fragment>
                )}

                <AppBarSpacer
                    style={{
                        width: 4,
                    }}
                />

                <AppBarSection>
                    <h1 className="title">Cool App</h1>
                </AppBarSection>

                {/* In the event of text-based links */}

                <AppBarSpacer
                    style={{
                        width: 32,
                    }}
                />

                <AppBarSection>
                    <Link to='/faqs' >
                        <span>FAQs</span>
                    </Link>
                </AppBarSection>


                <AppBarSpacer />

                <AppBarSection className="actions">
                    <button
                        onClick={toggleFullscreen}
                        className="k-button k-button-md k-rounded-md k-button-flat k-button-flat-base"
                    >
                        <i className="k-icon k-i-toggle-full-screen-mode" />
                    </button>
                </AppBarSection>

                {isAuthProtected && (
                    <Fragment>
                        <AppBarSection>
                            <span className="k-appbar-separator" />
                        </AppBarSection>

                        <AppBarSection>
                            <button
                                onClick={profileClick}
                                ref={profileAnchor}
                                className="k-button k-button-md k-rounded-md k-button-flat k-button-flat-base"
                            >
                                {authProvider.account.name}
                                {/* {authProviderV2.getAllAccounts()[0]?.name} */}
                                <Avatar type="image">
                                    <img src={avatarPlaceholder} alt={'Personal Avatar'} />
                                </Avatar>
                            </button>
                            <HeaderProfilePopup
                                anchor={profileAnchor}
                                show={showProfilePopup}
                                setShow={setShowProfilePopup}
                            />
                        </AppBarSection>
                    </Fragment>
                )}
            </AppBar>
        </Fragment>
    );
}

export default Header;
