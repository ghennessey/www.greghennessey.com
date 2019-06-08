import axios from 'axios';

const MENU_API = 'http://www.greghennessey.com/wp-json/gh/v1/menu_items';

export const fetchMenuItems = (url) => {
    return (dispatch) => {

        dispatch({ type: 'MENU_FETCH_STARTED' });

        axios.get(MENU_API).then(resp => {
            const { data } = resp;

            let menuItems = data.map(item => {
                const stringToCut = "http://www.greghennessey.com";
                const url = item.url.substring(stringToCut.length, item.url.length);
                return {
                    title: item.title,
                    url: url
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