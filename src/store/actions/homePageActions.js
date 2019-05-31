import axios from 'axios';

const HOME_PAGE_API = 'http://www.greghennessey.com/wp-json/wp/v2/pages/10'

export const startHomePageFetch = () => {
    return (dispatch) => {
        dispatch({ type: "HOME_PAGE_FETCH_IN_PRGORESS" });

        axios.get(HOME_PAGE_API).then(resp => {
            const { data } = resp;

            const title = data.page_header;
            const backgroundImage = data.background_image.url;
            const pageContent = data.content.rendered;

            dispatch({ type: 'SET_HOME_PAGE_DATA', data: {
                pageHeader: title,
                backgroundImage: backgroundImage,
                pageContent: pageContent,
            } });

            dispatch({ type: "HOME_PAGE_FETCH_COMPLETE" });
            dispatch({ type: "HOME_PAGE_INITIALIZED" });

        }).catch(err => {
            dispatch({ type: 'HOME_PAGE_FETCH_ERROR', err });
        });

    }
}