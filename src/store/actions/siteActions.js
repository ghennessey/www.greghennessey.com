import axios from 'axios';

const LOGO_ENDPOINT = 'http://www.greghennessey.com/wp-json/wp/v2/pages/10';

export const getLogo = () => {
    return (dispatch) => {
        axios.get(LOGO_ENDPOINT).then(resp => {
            const { data } = resp;

            dispatch({ type: 'SET_SITE_LOGO', 
                logo: data.logo_image.url,
                logoText: data.page_header });

        }).catch(err => {
            dispatch({ type: 'LOGO_FETCH_ERROR', err });
        });
    }
}