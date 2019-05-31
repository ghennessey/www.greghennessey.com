import axios from 'axios';

const BLOG_PAGE_ENDPOINT = 'http://www.greghennessey.com/wp-json/wp/v2/pages/87';
const BLOG_POSTS_ENDPOINT = 'http://www.greghennessey.com/wp-json/wp/v2/posts';

export const startBlogPageFetch = () => {
    return (dispatch) => {
        dispatch({ type: "BLOG_PAGE_FETCH_IN_PRGORESS" });
      
        axios.get(BLOG_PAGE_ENDPOINT).then(resp => {
            
            const { data } = resp;

            const pageHeader = data.content.rendered;
            const bgImage = data.acf.background_image.url;
            const secondBgImage = data.acf.secondary_bg_image.url;
            const pageContent = data.content.rendered;

            dispatch({ type: 'SET_BLOG_PAGE_DATA', data: {
                pageHeader: pageHeader,
                backgroundImage: bgImage,
                secondaryBgImage: secondBgImage,
                pageContent: pageContent,
            } });

            dispatch({ type: "BLOG_PAGE_FETCH_COMPLETE" });
            
        }).catch(err => {
            dispatch({ type: 'BLOG_PAGE_FETCH_ERROR', err });
        });
    }
}

export const getTotalNumberOfBlogPosts = () => {
    return (dispatch) => {
        axios.get(BLOG_POSTS_ENDPOINT).then(resp => {
            dispatch({ type: "SET_BLOG_POST_TOTAL", total: resp.headers["x-wp-total"] });
        });
    }
}

export const setMaxPostsPerPage = (maxPosts) => {
    return (dispatch) => {
        dispatch({ type: "SET_MAX_POSTS_PER_PAGE", maxPosts: maxPosts });
    }
}

export const getPosts = (perPage, currentPage) => {
    return (dispatch) => {
        const api = BLOG_POSTS_ENDPOINT + '?per_page=' + perPage + '&page=' + currentPage;
        axios.get(api).then(resp => {
            let postsOnPage = resp.data;
            let posts = {};
            posts[currentPage] = postsOnPage ; 
            dispatch({ type: 'SET_BLOG_POSTS_ON_PAGE', posts: posts });
        }).catch(err => {
            console.error('Error getting posts', err);
        });
    }
}

export const setCurrentPage = (currentPage) => {
    return (dispatch) => {
        dispatch({ type: "SET_CURRENT_PAGE", currentPage: currentPage });
    }
}

export const goToBlogPage = (currentPage, increment) => {
    return (dispatch) => {
        const newPage = currentPage + increment;
        dispatch({ type: "GO_TO_BLOG_PAGE", pageNum: newPage });
    }
}

