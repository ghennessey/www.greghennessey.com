const initState = {
    data: {
        logo: undefined,
        logoText: '',
    },
    ui: {}
}

const siteReducer = (state = initState, action) => {
    switch(action.type) {
        //DATA STATE
        case "SET_SITE_LOGO":
            return {
                ...state,
                data: {
                    ...state.data,
                    logo: action.logo,
                    logoText: action.logoText
                }
            }

        //ERROR HANDLING
        case "LOGO_FETCH_ERROR":
            console.log("Error fetching logo", action.err);
            return state
        default:
            return state
    }
}

export default siteReducer