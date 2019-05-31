const initState = {
    data: {
       backgroundImage: undefined,
       blogPosts: {},
       blogPostTotal: undefined,
       currentPage: undefined,
       pageContent: undefined,
       pageHeader: undefined,
       secondaryBgImage: undefined,
       blogPage: undefined,
    },
    ui: {
        fetchInProgress: false,
        maxPostsPerPage: undefined,
    }
}

const blogReducer = (state = initState, action) => {
    switch(action.type) {
        case "SET_BLOG_PAGE_DATA":
            return {
                ...state,
                data: {
                    ...state.data,
                    pageHeader: action.data.pageHeader,
                    backgroundImage: action.data.backgroundImage,
                    secondaryBgImage: action.data.secondaryBgImage,
                    pageContent: action.data.pageContent
                }
            }
        case "SET_BLOG_POST_TOTAL":
            return {
                ...state,
                data: {
                    ...state.data,
                    blogPostTotal: action.total
                }
            }
        case "SET_MAX_POSTS_PER_PAGE":
            return {
                ...state,
                ui: {
                    ...state.ui,
                    maxPostsPerPage: action.maxPosts
                }
            }
        case "SET_BLOG_POSTS_ON_PAGE":
            console.log('Blog posts getting set to', action.posts);
            return {
                ...state,
                data: {
                    ...state.data,
                    blogPosts: {
                        ...state.data.blogPosts,
                        ...action.posts
                    }
                }
            }
        case "SET_CURRENT_PAGE":
            return {
                ...state,
                data: {
                    ...state.data,
                    currentPage: action.currentPage
                }
            }
        default:
            return state
    }
}

export default blogReducer