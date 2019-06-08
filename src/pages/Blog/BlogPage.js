import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";

import BlogPreviewArea from './BlogPreviewArea'

import ResumeButton from '../../components/ResumeButton.js'
import HamburgerMenu from '../../components/HamburgerMenu.js'
import LogoMark from '../../components/LogoMark.js'
import LoadingSpinner from '../../components/LoadingSpinner.js'

import ReactHtmlParser from 'react-html-parser';

import { 
  startBlogPageFetch, 
  getTotalNumberOfBlogPosts,
  setMaxPostsPerPage,
  getPosts,
  setCurrentPage,
  goToBlogPage,
} from '../../store/actions/blogActions'

const queryString = require('query-string');

const MAX_POSTS_PER_PAGE = 3;

///////////////////////////////////////////////////////////////////////////////
// Pagination
///////////////////////////////////////////////////////////////////////////////

const Pagination = ({onClick, currentPage, maxPostsPerPage, blogPostTotal}) => {

  const numPages = Math.ceil(blogPostTotal / maxPostsPerPage);

  let pages = [];
  for(let i = 0; i < numPages; i++) {
    let pageNum = parseInt(i + 1, 10);
    let liClass = parseInt(currentPage) === pageNum ? "page-item active" : "page-item";
    pages.push(<li key={pageNum} className={liClass}><a id={pageNum} className="page-link" onClick={onClick} href="#">{pageNum}</a></li>);
  }

  return (
    <nav aria-label="Page navigation example" className="my-5 pt-5 text-center align-self-center d-flex">
      <ul className="pagination">
        <li className="page-item">
          <a className="page-link" id="back" onClick={onClick} href="#" aria-label="Previous">
            <span id="back" aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {pages}
        <li className="page-item">
          <a className="page-link" id="forward" onClick={onClick} href="#" aria-label="Next">
            <span id="forward" aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  )
}

///////////////////////////////////////////////////////////////////////////////
// BLOG PAGE CLASS
///////////////////////////////////////////////////////////////////////////////
class BlogPage extends Component {

  componentWillMount() {
    //If there is no query string ie. '?page=#' then let's push them to the first page.
    //Also push them to 1 if the current page is 0 or less
    const { search } = this.props.location;
    const currentPage = queryString.parse(search);
    if(!search || currentPage.page <= 0) {
      this.props.history.push({
        search: 'page=1'
      });
      this.forceUpdate();
    } else {
      this.props.setCurrentPage(currentPage.page);
    }    

    this.props.setMaxPostsPerPage(MAX_POSTS_PER_PAGE);
    this.props.startBlogPageFetch();
    this.props.getTotalNumberOfBlogPosts();
  }

  componentDidUpdate(prevProps) {
    const currentPage = queryString.parse(this.props.location.search);
    //Max Posts per Page is Set / Updated
    if(prevProps.blog.ui.maxPostsPerPage !== this.props.blog.ui.maxPostsPerPage) {
      //Once max posts is set then get the posts for the page
      this.props.getPosts(this.props.blog.ui.maxPostsPerPage, currentPage.page);
    }

    //If the page changes, then get the new posts
    if(prevProps.location.search !== this.props.location.search) {
      this.props.setCurrentPage(currentPage.page);
      this.props.getPosts(this.props.blog.ui.maxPostsPerPage, currentPage.page);
    }
  }

  onPageClick = (e) => {
    e.preventDefault();

    const inputID = e.target.id;
    const { currentPage } = this.props.blog.data;
    const maxPage = Math.ceil(this.props.blog.data.blogPostTotal / this.props.blog.ui.maxPostsPerPage);
    let newPage;
    let newPageQueryString = '?page=';

    //If INPUT ID is FORWARD and the new page isn't greater than the max page then go to the next page
    if(inputID === 'forward') {
      newPage = parseInt(currentPage) + 1;
      if(newPage <= maxPage) {
        this.props.history.push({
          pathname: this.props.match.path,
          search: newPageQueryString + newPage
        });
        this.props.setCurrentPage(newPage);
      }
      return
    }

    //If INPUT ID is BACK and the new page isn't lower than 1, then go to the next page
    if(inputID === 'back') {
      newPage = parseInt(currentPage) - 1;
      if(newPage > 0) {
        this.props.history.push({
          pathname: this.props.match.path,
          search: newPageQueryString + newPage
        });
        this.props.setCurrentPage(newPage);
      }
      return
    }

    //If the INPUT ID is a number, let's go to the page if it's not lower or higher than min or max;
    if(inputID > 0 && inputID <= maxPage) {
        newPage = inputID;
        this.props.setCurrentPage(newPage);
        this.props.getPosts(this.props.blog.ui.maxPostsPerPage, newPage);
        this.props.history.push({
          pathname: this.props.match.path,
          search: newPageQueryString + newPage
        });
        this.props.setCurrentPage(newPage);
        return
    }

  }

  render() {
    const { backgroundImage, secondaryBgImage, pageHeader } = this.props.blog.data;
    
    return(
      <div className="container-fluid page-blog d-flex flex-column" >
        {/* Top Section */}
        <div className='row top-section background-cover g-shadow-1' style={{ backgroundImage: `url(${secondaryBgImage})` }}>
          <LogoMark className='horizontal top-left mt-3 ml-3'/>
          <div className="col d-flex g-text-shadow-1 justify-content-center text-center page-content g-shadow-1">
            { ReactHtmlParser(pageHeader) }
          </div>
        </div>

        {/* Bottom Section - Blog Items */}
        <div className='row background-repeat flex-grow-1 d-flex align-items-middle flex-column' style={{ backgroundImage: `url(${backgroundImage})` }}>
          <div className='col page-content'>
            <BlogPreviewArea currentPage={this.props.blog.data.currentPage} posts={this.props.blog.data.blogPosts} />
          </div>
          <Pagination onClick={this.onPageClick} currentPage={this.props.blog.data.currentPage} maxPostsPerPage={this.props.blog.ui.maxPostsPerPage} blogPostTotal={this.props.blog.data.blogPostTotal}/>
        </div>
        {/* <ResumeButton /> */}
        <HamburgerMenu />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    blog: state.blog,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startBlogPageFetch: () => dispatch(startBlogPageFetch()),
    getTotalNumberOfBlogPosts: () => dispatch(getTotalNumberOfBlogPosts()),
    setMaxPostsPerPage: (maxPosts) => dispatch(setMaxPostsPerPage(maxPosts)),
    getPosts: (perPage, currentPage) => dispatch(getPosts(perPage, currentPage)),
    setCurrentPage: (currentPage) => dispatch(setCurrentPage(currentPage)),
    goToBlogPage: (currentPage, increment, maxPage) => dispatch(goToBlogPage(currentPage, increment, maxPage)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogPage)