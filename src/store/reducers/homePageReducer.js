const initState = {
    homePageInitialized: false,
    data: {
        backgroundImage: undefined,
        pageHeader: undefined,
        pageContent: undefined,
    },
    ui: {
        fetchInProgress: false,
    }
}

const homePageReducer = (state = initState, action) => {
    switch(action.type) {
        //UI STATE
        case "HOME_PAGE_FETCH_IN_PRGORESS":
            return {
                ...state,
                ui: {
                    ...state.ui,
                    fetchInProgress: true,
                }
            };
        case "HOME_PAGE_FETCH_COMPLETE":
            return {
                ...state,
                ui: {
                    ...state.ui,
                    fetchInProgress: false,
                }
            };
        
        case "HOME_PAGE_INITIALIZED":
            return {
                ...state,
                homePageInitialized: true,
            }

        //DATA STATE
        case "SET_HOME_PAGE_DATA":
            return {
                ...state,
                data: {
                    ...state.data,
                    pageHeader: action.data.pageHeader,
                    backgroundImage: action.data.backgroundImage,
                    pageContent: action.data.pageContent,
                }
            }
        
        //ERROR HANDLING
        case "HOME_PAGE_FETCH_ERROR":
            console.error("Error fetching Home Page data ", action.err);
            return state;
        default:
            return state;
    }
}

export default homePageReducer