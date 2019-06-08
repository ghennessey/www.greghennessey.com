import React, { Component } from 'react'
import { Link } from "react-router-dom"
import moment from 'moment'
import convertStringToHTML from '../../components/Helpers.js'

const BlogPreview = ({date, excerpt, link, previewImage, title}) => {
    return (
        <div className="container blog-preview mt-5">
            <div className="row ">
                <div className="col-12 col-xl-4 overflow-hidden preview-img-col mb-3 mb-xl-0 p-0 g-shadow-1">
                    <a href={link}>
                        <div className="preview-img background-cover w-100 h-100" style={{ backgroundImage: `url(${previewImage})` }}></div>
                    </a>
                </div>
                <div className="col-12 col-xl-8 pl-xl-5">
                    <Link to={link}>
                        <h1 className="text-truncate d-inline-block" style={{width: '100%'}}>{title}</h1>
                    </Link>
                    <h5>{date}</h5>
                    {excerpt}
                    <div className="read-more text-right"><Link to={link}>Read More ></Link></div>
                </div>
            </div>           
        </div>
    )
}

class BlogPreviewArea extends Component {

    buildBlogPreviews = (currentPage, posts) => {
        let postsToRender = [];
        if(currentPage && posts) {
            let postList = [];
            const postsOnPage = posts[currentPage];
            
            for(posts in postsOnPage) {

                const post = postsOnPage[posts];
                const title = post.title.rendered;
                const pageLink = '/blog/' + post.slug;
                const date = moment(post.date).format("MMMM Do, YYYY");
                const previewImage = post.acf.header_image.sizes.large;
                const excerpt = convertStringToHTML(post.excerpt.rendered);
               
                postList.push(<BlogPreview
                    key={post.id}
                    title={title}
                    link={pageLink}
                    date={date}
                    previewImage={previewImage}
                    excerpt={excerpt}
                />);
            }

            postsToRender = postList;
        }
        return postsToRender;
    }

    render() {
        return (
            <div className='container blog-items pt-5'>
                {this.buildBlogPreviews(this.props.currentPage, this.props.posts)}
            </div>
        )
    }
}

  export default BlogPreviewArea