const initState = {
    data: {
        backgroundImage: undefined,
        secondaryBgImage: undefined,
        pageContent: undefined,
        pageHeader: undefined,
    },
    ui: {
        aboutPageInitialized: false,
        fetchInProgress: true,
    }
}

const aboutReducer = (state = initState, action) => {
    switch(action.type) {
        case "ABOUT_PAGE_FETCH_IN_PRGORESS":
            return {
                ...state,
                ui: {
                    ...state.ui,
                    fetchInProgress: true,
                }
            }
        case "ABOUT_PAGE_FETCH_COMPLETE":
            return {
                ...state,
                ui: {
                    ...state.ui,
                    fetchInProgress: false,
                }
            }

        case "SET_ABOUT_PAGE_DATA":
                return {
                    ...state,
                    data: {
                        ...state.data,
                        backgroundImage: action.data.backgroundImage,
                        secondaryBgImage: action.data.secondaryBgImage,
                        pageContent: action.data.pageContent,
                        pageHeader: action.data.pageHeader,
                    }
                }
        default:
            return state
    }
}

export default aboutReducer