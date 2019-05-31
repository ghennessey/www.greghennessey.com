import axios from 'axios';

const ABOUT_PAGE_ENDPOINT = 'http://www.greghennessey.com/wp-json/wp/v2/pages/21';

export const startAboutFetch = () => {
    return (dispatch) => {
        dispatch({ type: "ABOUT_PAGE_FETCH_IN_PRGORESS" });

        axios.get(ABOUT_PAGE_ENDPOINT).then(resp => {
            const { data } = resp;

            const title = data.page_header;
            const bgImage = data.acf.background_image.url;
            const secondBgImage = data.acf.secondary_bg_image.url;
            const pageContent = data.content.rendered;

            dispatch({ type: 'SET_ABOUT_PAGE_DATA', data: {
                pageHeader: title,
                backgroundImage: bgImage,
                secondaryBgImage: secondBgImage,
                pageContent: pageContent,
            } });

            dispatch({ type: "ABOUT_PAGE_FETCH_COMPLETE" });
            dispatch({ type: "ABOUT_PAGE_INITIALIZED" });

        }).catch(err => {
            dispatch({ type: 'ABOUT_PAGE_FETCH_ERROR', err });
        });
    }
}