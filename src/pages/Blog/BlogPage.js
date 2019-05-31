import React, { Component } from 'react'
import { connect } from 'react-redux'

import BlogPreviewArea from './BlogPreviewArea'

import ResumeButton from '../../components/ResumeButton.js'
import HamburgerMenu from '../../components/HamburgerMenu.js'
import LogoMark from '../../components/LogoMark.js'
import LoadingSpinner from '../../components/LoadingSpinner.js'

import convertStringToHTML from '../../components/Helpers.js'

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
  constructor(props) {
    super(props);
    this.handlePageNavClick = this.handlePageNavClick.bind(this);

    this.state = {
      title: '',
      backgroundImage: '',
      secondaryBGImage: '',
      //pageContent is actually just the title of the blog
      pageContent: '',
      maxPostsPerPage: 3,
      //pageIndex is the current page we're on and will be set by the query param of the URL
      pageIndex: null,
      numPages: undefined,
      paginationVisibility: false,
      //Lets get the router history from our Router so we can save its state and manipulate it
      history: this.props.history,
    };

  }

  componentWillMount() {
    this.props.setMaxPostsPerPage(MAX_POSTS_PER_PAGE);
    this.props.startBlogPageFetch();
    this.props.getTotalNumberOfBlogPosts();

    const currentPage = queryString.parse(this.props.location.search)
    this.props.setCurrentPage(currentPage.page);
  }

  componentDidUpdate(prevProps, prevState) {
    //When the state pageIndex is updated, I do a new data call to fetch page data
    //I also hide the pagination since this is the safest place to do it
    if(prevState.pageIndex !== this.state.pageIndex) {
      //this.updateURL(this.state.pageIndex);
      this.handlePaginationVisibility(false);
      this.props.updateQueryString(this.state.pageIndex);
    }

    if(this.props.blog.ui.maxPostsPerPage !== prevProps.blog.ui.maxPostsPerPage) {
      //Look at the query string which should be ?page=# and get the #
      const pageQuery = queryString.parse(this.props.location.search);
      this.props.getPosts(this.props.blog.ui.maxPostsPerPage, pageQuery.page);
    }

    //Get the current page again if the query param for the page changes
    if(this.props.location.search !== prevProps.location.search) {
      const currentPage = queryString.parse(this.props.location.search)
      this.props.setCurrentPage(currentPage.page);
    }
  }

  //Handle CLICK of Pagination Buttons
  handlePageNavClick = (e) => {
    let clickedButton = e.target.className;
    let back = 'button-back';
    let forward = 'button-forward';

    let currentIndex = parseInt(this.state.pageIndex, 0);
    let newIndex = currentIndex;

    if(clickedButton === forward) {
      newIndex++
    } else if (clickedButton === back) {
      newIndex--;
    } else {
      console.log('There seems to be an issue detecting which button was pressed.');
    }

    //This is to safeguard someone from going over or under the min/max number of pages
    if(newIndex <= 0) {
      newIndex = 1;
    } else if(newIndex >= this.state.numPages) {
      newIndex = this.state.numPages;
    }

    this.setState({
      pageIndex: newIndex,
    });
  }

  handlePaginationVisibility = (visibility) => {
    this.setState({paginationVisibility: visibility});
  }

  handleBlogPostData = (slug) => {
    this.setState({
      blogSlug: slug
    });
  }

  onPageClick = (e) => {
    e.preventDefault();
    console.log(this.props.history);
    const inputID = e.target.id;
    const { currentPage } = this.props.blog.data;
    const maxPage = Math.ceil(this.props.blog.data.blogPostTotal / this.props.blog.ui.maxPostsPerPage);
    let newPage;
    let newPageQueryString = '?page=';
    //If INPUT ID is FORWARD and the new page isn't greater than the max page then go to the next page
    console.log(currentPage);
    if(inputID === 'forward') {
      newPage = parseInt(currentPage) + 1;
      if(newPage <= maxPage) {
        this.props.setCurrentPage(newPage);
        this.props.getPosts(this.props.blog.ui.maxPostsPerPage, newPage);
      }
      this.props.history.push({
        pathname: this.props.match.path,
        search: newPageQueryString + newPage
      });
      return
    }
    //If INPUT ID is BACK and the new page isn't lower than 1, then go to the next page
    if(inputID === 'back') {
      newPage = parseInt(currentPage) - 1;
      if(newPage > 0) {
        console.log('Lets go back');
        this.props.setCurrentPage(newPage);
        this.props.getPosts(this.props.blog.ui.maxPostsPerPage, newPage);
      }
      this.props.history.push({
        pathname: this.props.match.path,
        search: newPageQueryString + newPage
      });
      return
    }

    //If the INPUT ID is a number, let's go to the page if it's not lower or higher than min or max;
    if(inputID > 0 && inputID <= maxPage) {
        newPage = inputID;
        console.log('Lets go to page', newPage);
        this.props.setCurrentPage(newPage);
        this.props.getPosts(this.props.blog.ui.maxPostsPerPage, newPage);
        this.props.history.push({
          pathname: this.props.match.path,
          search: newPageQueryString + newPage
        });
        return
    }

  }

  render() {
    console.log('\n>>>>>>BLOG DATA IN COMPONENT', this.props.blog);
    const { backgroundImage, secondaryBgImage, pageHeader } = this.props.blog.data;
    return(
      <div className="container-fluid page-blog d-flex flex-column" >
        {/* Top Section */}
        <div className='row top-section background-cover g-shadow-1' style={{ backgroundImage: `url(${secondaryBgImage})` }}>
          <LogoMark className='horizontal top-left mt-3 ml-3'/>
          <div className="col d-flex g-text-shadow-1 justify-content-center text-center page-content g-shadow-1">
            { convertStringToHTML(pageHeader) }
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