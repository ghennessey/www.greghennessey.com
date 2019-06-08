import axios from 'axios';

const BLOG_POST_ENDPOINT = 'http://www.greghennessey.com/wp-json/wp/v2/posts?slug=';

export const getBlogPost = (slug) => {
    return (dispatch) => {
        const api = BLOG_POST_ENDPOINT + slug;


        axios.get(api).then(resp => {

            const data = resp.data[0];
            const pageHeader = data.title.rendered;
            const headerImage = data.acf.header_image.url;
            const content = data.content.rendered;
            const date = data.date;

            //console.log('Getting blog post', resp.data[0]);
            dispatch({ type: "SET_BLOG_POST_DATA", data: {
                pageHeader: pageHeader,
                headerImage: headerImage,
                content: content,
                date: date,
            } });

        }).catch(err => {
            console.error("The blog post was not found", err);
            dispatch({ type: "BLOG_POST_NOT_FOUND"});
        });
    }
}

export const clearBlogPostData = () => {
    return(dispatch) => {
        dispatch({ type: "CLEAR_BLOG_POST_DATA" });
    }
}