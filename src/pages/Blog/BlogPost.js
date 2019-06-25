import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactHtmlParser from 'react-html-parser';
import { Redirect } from "react-router-dom";
import moment from 'moment'

import HamburgerMenu from '../../components/HamburgerMenu.js'

import  { getBlogPost, clearBlogPostData } from '../../store/actions/blogPostActions'

import GreenBadge from '../../assets/GreenBadge.png'

class BlogPost extends Component {

  constructor() {
    super();
    this.state = {
      showBackButton: true,
    };
  }

  componentWillMount() {
    //Get the post slug from the url and let's search if it's valid
    const { blogSlug } = this.props.match.params;

    //If it's valid then let's grab the data and display it.
    this.props.getBlogPost( blogSlug );

    //Check if the page has been POP'd and show or hide the back button accordingly
    const { action } = this.props.history;
    if(action === "POP") {
      this.setState({
        showBackButton: false,
      });
    }
  }

  componentWillUnmount() {
    //Clear the cached blog data
    this.props.clearBlogPostData();
  }

  render() {
    const date = moment(this.props.post.data.date).format("MMMM Do, YYYY");
    return (
      <div className="page-blog-post container-fluid d-flex flex-column">

        {/* Top Section - Blog Title & Image */}
        <div className="row top-section background-image background-cover" style={{ backgroundImage: `url(${ this.props.post.data.headerImage })` }}>
          <div className="col d-flex text-center justify-content-center">
            {/* Back Button */}
            {this.state.showBackButton ? <button onClick={() => { this.props.history.goBack() }} className='btn btn-outline-light btn-back mt-3 ml-3'>Back</button> : null}
            <h1 className="g-text-glow-with-shadow m-0 align-items-center d-flex">{this.props.post.data.pageHeader}</h1>
          </div>
        </div>

        {/* Bottom Section - Blog Content */}
        <div className="row bottom-section flex-grow-1">
          <div className="col px-0">
            <div className="container bg-white">
              
            <div className="row">
              <div className="col py-5 px-2 px-md-5">
                {ReactHtmlParser(this.props.post.data.content)}
              </div>
            </div>

            </div>
          </div>
        </div>
        <HamburgerMenu/>
        {/* If there's an error, redirect */}
        { this.props.post.ui.blogPostNotFound ? <Redirect to="/404" /> : null }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    post: state.post,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getBlogPost: (slug) => dispatch(getBlogPost(slug)),
    clearBlogPostData: () => dispatch(clearBlogPostData()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogPost)

        // {/* Top Row - Header Image */}
        // <div className="row top-section d-flex align-items-center justify-content-center text-center g-shadow-1">
        //   {this.state.showBackButton ? <button onClick={() => { this.props.history.goBack() }} className='btn btn-outline-light btn-back mt-3 ml-3'>Back</button> : null}
        //   <div className="container h-100 w-100 d-flex flex-column justify-content-center text-center">
        //     <h1 className="align-middle g-text-glow-with-shadow">{this.props.post.data.pageHeader}</h1>
        //   </div>
        //   <div className="background-image background-cover h-100 w-100" style={{ backgroundImage: `url(${ this.props.post.data.headerImage })` }}></div>
        // </div>
        // {/* Bottom Row - Blog Content */}
        // <div className="row bottom-section">
        //   <div className="col px-0 d-flex">
        //     <div className="container d-inline-block blog-container g-shadow-1 py-5 px-5 bg-white">
        //       <div className="row">
        //         <div className="col-12 mb-4 text-center px-0"><h4>Greg Hennessey <img src={GreenBadge} alt="Blog Badge" style={{height: '50px', width: '50px'}}/> {date}</h4></div>
        //         <div className="col-12 text-left px-0">
        //           {ReactHtmlParser(this.props.post.data.content)}
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>