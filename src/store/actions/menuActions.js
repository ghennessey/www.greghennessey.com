import axios from 'axios';

const MENU_API = 'http://www.greghennessey.com/wp-json/gh/v1/menu_items';

export const fetchMenuItems = () => {
    return (dispatch) => {

        dispatch({ type: 'MENU_FETCH_STARTED' });

        axios.get(MENU_API).then(resp => {
            const { data } = resp;

            let menuItems = data.map(item => {
                return {
                    title: item.title,
                    url: item.url
                }
            });

            dispatch({ type: 'SET_MENU_DATA', menuItems: menuItems });

            dispatch({ type: "MENU_INITIALIZED" });
            dispatch({ type: 'MENU_FETCH_COMPLETE' });

        }).catch(err => {
            dispatch({ type: 'MENU_FETCH_ERROR', err });
        });
    }
}

export const openHamburgerMenu = () => {
    return (dispatch) => {
        dispatch({ type: "OPEN_HAMBURGER_MENU" });
    }
}

export const closeHamburgerMenu = () => {
    return (dispatch) => {
        dispatch({ type: "CLOSE_HAMBURGER_MENU" });
    }
}