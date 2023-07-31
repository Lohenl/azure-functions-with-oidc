import { Fragment } from 'react';
import { Popup } from "@progress/kendo-react-popup";
import { ListView, ListViewHeader } from '@progress/kendo-react-listview';
import { useNavigate } from 'react-router-dom';

// icon references:
// https://www.telerik.com/kendo-react-ui/components/styling/icons/
// https://boxicons.com/
// https://pictogrammers.com/library/mdi/

const HeaderProfilePopup = ({ anchor, show, setShow }) => {
    const navigate = useNavigate();

    let options = [
        {
            text: 'Cool Profiles',
            icon: "k-icon k-i-user",
            route: '/profile',
            canAccess: true,
        }
    ];


    const onClick = (route) => {
        navigate(route);
        setShow(false);
    }

    const HeaderRender = () => {
        return (
            <ListViewHeader
                style={{
                    backgroundColor: '#eee',
                    color: 'black',
                    fontSize: 19,
                    borderBottom: '1px solid #dee2e6',
                    textAlign: 'center',
                    padding: '10px',
                }}
                className="pl-3 pb-2 pt-2"
            >
                <span>Menu</span>
            </ListViewHeader>)
    }

    const ItemRender = (props) => {
        let item = props.dataItem;
        if (item.canAccess) {
            return (
                <div
                    className="row p-2 border-bottom align-middle"
                    style={{
                        margin: 0,
                    }}
                >
                    <button
                        className="k-button k-button-md k-rounded-md k-button-flat k-button-flat-base"
                        onClick={() => { onClick(item.route); }}
                    >
                        <i className={item.icon} />
                        {item.text}
                    </button>
                </div>
            );
        } else {
            return (<Fragment></Fragment>);
        }

    };

    return (
        <Popup anchor={anchor.current} show={show} popupClass={"popup-content"}>
            <ListView
                data={options}
                item={ItemRender}
                style={{
                    width: '100%',
                }}
                header={HeaderRender}
            />
        </Popup>
    );

};

export default HeaderProfilePopup;
