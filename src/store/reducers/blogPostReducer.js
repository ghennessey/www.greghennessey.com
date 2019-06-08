const initState = {
    data: {
        headerImage: undefined,
        pageHeader: '',
        content: undefined,
        date: undefined,
    },
    ui: {
        blogPostNotFound: false,
    }
}

const blogPostReducer = (state = initState, action) => {
    switch(action.type) {
        case "SET_BLOG_POST_DATA":
            return {
                ...state,
                data: {
                    ...state.data,
                    pageHeader: action.data.pageHeader,
                    headerImage: action.data.headerImage,
                    content: action.data.content,
                    date: action.data.date,
                }
            }
        case "BLOG_POST_NOT_FOUND":
            return {
                ...state,
                ui: {
                    ...state.ui,
                    blogPostNotFound: true,
                }  
            }
        case "CLEAR_BLOG_POST_DATA":
            return {
                ...initState
            }
        default:
            return state
    }
}

export default blogPostReducer