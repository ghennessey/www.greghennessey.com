const initState = {
    menuInitialized: false,
    data: {
        menuItems: undefined,
    },
    ui: {
        fetchInProgress: false,
        hamburgerOpen: false,
    }
}

const menuReducer = (state = initState, action) => {
    switch(action.type) {
        //DATA STATE
        case "SET_MENU_DATA":
            return {
                ...state,
                data: {
                    ...state.data,
                    menuItems: action.menuItems
                }
            }

        //UI STATE
        case "MENU_FETCH_STARTED":
            return {
                ...state,
                ui: {
                    ...state.ui,
                    fetchInProgress: true,
                }
            }
        case "MENU_FETCH_COMPLETE":
            return {
                ...state,
                ui: {
                    ...state.ui,
                    fetchInProgress: false,
                }
            }
        case "MENU_INITIALIZED":
            return {
                ...state,
                menuInitialized: true,
            }
        
        case "OPEN_HAMBURGER_MENU":
            return {
                ...state,
                ui: {
                    ...state.ui,
                    hamburgerOpen: true
                }
            }
        case "CLOSE_HAMBURGER_MENU":
            return {
                ...state,
                ui: {
                    ...state.ui,
                    hamburgerOpen: false
                }
            }

        //ERROR HANDLING
        case "MENU_FETCH_ERROR":
            console.error('Error fetching menu itmes', action.err);
            return state
        default:
            return state
    }
}

export default menuReducer