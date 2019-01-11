import React, { Component } from 'react'
import { Link } from "react-router-dom"
import ResumeButton from '../components/ResumeButton.js'
import HamburgerMenu from '../components/HamburgerMenu.js'
import LogoMark from '../components/Widgets.js'
import LoadingSpinner from '../components/LoadingSpinner.js'
import convertStringToHTML from '../components/Helpers.js'

const dateFormat = require('dateformat');
const queryString = require('query-string');

//Pass this slug in to get the specific page data I am looking for
const PAGE_ID = 87;
const PAGES_API = 'http://www.greghennessey.com/wp-json/wp/v2/posts';

///////////////////////////////////////////////////////////////////////////////
// BLOG PREVIEW CLASS
///////////////////////////////////////////////////////////////////////////////
class BlogPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blogClick: this.props.onClick,
      blogRoute: this.props.pageSlug
    };
  }

  render() {
    let date = dateFormat(this.props.blogDate, "mmmm dS, yyyy");

    return(
      <div key={this.props.uniqueKey} className={'blog-preview '+ this.props.blogClass + ' container transition-in'}
        style={{animationDelay: this.props.animDelay}}>
        <div className='left-side'>
          <Link to={{pathname: '/blog/' + this.props.pageSlug, state: {modal: true}}}>
            <div className='blog-image'>
              <div className='blog-image-inner' style={{ backgroundImage: `url(${this.props.previewImage})` }}></div>
            </div>
          </Link>
        </div>
        <div className='right-side'>
          <div className='row-0'>
            <Link to={{pathname: '/blog/' + this.props.pageSlug, state: {modal: true}}}><h1>{this.props.blogTitle}</h1></Link>
          </div>
          <div className='date row-1'>
            {date}
          </div>
          <div className='content-snippet row-2'>
              {this.props.blogExcerpt}
          </div>
          <div className='read-more row-3'>
            <Link to={{pathname: '/blog/' + this.props.pageSlug, state: {modal: true}}}>Read More >></Link>
          </div>
        </div>
      </div>
    )
  }
}

///////////////////////////////////////////////////////////////////////////////
// BLOG PREVIEW AREA CLASS
///////////////////////////////////////////////////////////////////////////////
class BlogPreviewArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //A state to show or hide the loading spinner
      loaderVisibility: false,
      //Set the maximum number of characters allowed in a blog title post so we can truncate it
      maxBlogTitleLength: 30,
      //This is the content for the HTML preview area that holds multiple blog previews
      blogPreviewContent: undefined,
    };
  }

  //This method fetches blog data that will be displayed as a blog preview
  async fetchPostData() {
    if(this.state.blogPreviewContent !== undefined) {
      this.setState({blogPreviewContent: undefined});
    }

    //Let's construct the API call here. Get the base, plus the number of posts per page
    //And the page we're on
    let api_Base = PAGES_API;
    let api_PostsPerPage = '?per_page=' + this.props.maxPosts;
    let api_CurrentPage = '&page=' + this.props.currentPage;
    let api_Final = api_Base + api_PostsPerPage + api_CurrentPage;

    const data = await(await(fetch(api_Final))).json();

    //Once we have retrieved data, build appropriate content
    this.buildLinkContent(data);
  }

  //Once post data is grabbed, let's get the data and build the HTML content
  //structure
  buildLinkContent = (data) => {
    var blogPreviewContent = [];
    var blogData = data;

    //Animation Settings
    var transitionDelay = 0.05;

    for(var i=0; i < blogData.length; i++) {
      let blogPreviewData = blogData[i];

      if(blogPreviewData) {
        blogPreviewContent.push(
          <BlogPreview
            key = {i}
            id = {blogPreviewData.id}
            blogTitle = {this.shortenBlogTitle(blogPreviewData.title.rendered)}
            blogDate = {blogPreviewData.date}
            blogClass = {'blog-preview-'+i}
            animDelay = {transitionDelay * (i) + 's'}
            previewImage = {blogPreviewData.acf.header_image.url}
            blogExcerpt = {convertStringToHTML(blogPreviewData.excerpt.rendered)}
            blogLink = {blogPreviewData.link}
            pageSlug = {blogPreviewData.slug}
            handleBlogPostData={this.props.handleBlogPostData}
          />);
      }
    }

    this.setState({
      blogPreviewContent: blogPreviewContent,
      loaderVisibility: false,
    });

    //Show pagination once content is built
    this.props.handlePaginationVisibility(true);
  }

  shortenBlogTitle = (blogTitle) => {
    let oldBlogTitle = blogTitle;
    let newBlogTitle;
    if(oldBlogTitle.length > this.state.maxBlogTitleLength) {
      newBlogTitle = oldBlogTitle.slice(0, this.state.maxBlogTitleLength) + "...";
    } else {
      newBlogTitle = oldBlogTitle;
    }
    return newBlogTitle;
  }

  componentDidMount() {
    if(this.props.currentPage) {
      this.fetchPostData();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //When the state pageIndex is updated, I do a new data call to fetch page data
    if(prevProps.currentPage !== this.props.currentPage) {
      this.fetchPostData();
      this.setState({
        blogPreviewData: undefined,
        loaderVisibility: true,
      });
    }
  }

  render() {
    return (
      <div className='blog-list-container'>
        <div className='loader'>
          <LoadingSpinner display={this.state.loaderVisibility} />
        </div>
        {this.state.blogPreviewContent}
      </div>
    );
  }
}

///////////////////////////////////////////////////////////////////////////////
// Pagination
// A stateless component for pagination that just accepts props from the
// BlogPage class and renders a small component.
///////////////////////////////////////////////////////////////////////////////

const Pagination = ({visibility, handlePageNavClick, pageIndex, numPages}) => {
  //If there is no page, then do not show the pagination
  //OR if there is only one or less pages, hide the pagination
  if(!pageIndex || numPages <= 1) {
    visibility = false;
  }

  return (
  <div className='pagination' style={{ visibility: visibility ? 'visible' : 'hidden' }}>
    <a className='button-back' onClick={handlePageNavClick}>&lt; Back</a>
    <span>{pageIndex + "/" + numPages}</span>
    <a className='button-forward' onClick={handlePageNavClick}>Forward &gt;</a>
  </div>
  )
}

///////////////////////////////////////////////////////////////////////////////
// BLOG PAGE CLASS
///////////////////////////////////////////////////////////////////////////////

export default class BlogPage extends Component {
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

    //If there is no query param for the BlogPage, then we replace the current url
    //in the window with a query param for page 1
    if(!this.props.history.location.search && this.props.match.path !== '/blog/:postID') {
      //this.updateURL(1, true);
    }
  }

  updateURL(pageQueryID, replace=false) {
    const url = this.props.match.path;
    const pageQuery = '?page=';

    //If false, we push a new entry (this is useful when we're navigating back and forth
    //through different blog pages)
    if(!replace) {
      this.state.history.push({
        pathname: url,
        search: pageQuery + pageQueryID
      });
    } else {
      //Otherwise, we replace the current url. This is so that we can update the current url
      this.state.history.replace({
        pathname: url,
        search: pageQuery + pageQueryID
      });
    }

    this.setState({
      history: this.state.history
    });
  }

  async componentDidMount() {
    const maxPages = await(await(fetch(PAGES_API))).json();
    const pageData = await(await(fetch('http://www.greghennessey.com/wp-json/wp/v2/pages/' + PAGE_ID))).json();

    // console.log('\n----- <BlogPage Mounted> - Async -----\n<BlogPage> data is retrieved as follows:');
    // //console.log(pageData);
    // console.log('Props from route:');
    // console.log(this.props);

    //When the component mounts, parse the query string to get what page we are on and set it as the index
    let pageIndex = this.parseQueryString(this.props);
    //TODO - If pageIndex ends up returning null because its not an int, then I need to redirect

    this.setState({
      //This title is used for the Logo Mark
      title: pageData.page_header,
      backgroundImage: pageData.background_image.url,
      secondaryBGImage: pageData.secondary_bg_image.url,
      logoImage: pageData.logo_image.url,
      //This is just the title of the page
      pageContent: pageData.content.rendered,
      //Blog posts per page shows how many will be loaded and displayed
      maxPostsPerPage: pageData.acf.max_posts,
      numPages: Math.round(maxPages.length / this.state.maxPostsPerPage),
      pageIndex: pageIndex,
      blogSlug: undefined,
    });

    //This will set the current page to the max page available in the case that
    //Someone entered a huge query param that is out of scope
    if(this.state.pageIndex > this.state.numPages) {
      this.setState({
        pageIndex: this.state.numPages
      });
    }
  }

  parseQueryString = ({history: {location: {search}}}) => {
    const parsedQuery = queryString.parse(search);
    let queryStringID = parseInt(parsedQuery.page, 10);

    //If the queryString is valid then return it
    if(queryStringID === parseInt(queryStringID, 10)) {
      return queryStringID
    //Otherwise return null and recommend a redirect
    } else {
      return null
    }
  }

  //This function sets the page index (What page we're on) and is usually called When
  //I click on the back/next buttons
  setPageIndex = (index) => {
    let newIndex = index;

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

  componentDidUpdate(prevProps, prevState, snapshot) {
    //When the state pageIndex is updated, I do a new data call to fetch page data
    //I also hide the pagination since this is the safest place to do it
    if(prevState.pageIndex !== this.state.pageIndex) {
      //this.updateURL(this.state.pageIndex);
      this.handlePaginationVisibility(false);
      this.props.updateQueryString(this.state.pageIndex);
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

  render() {
    return(
      <div className="BlogMain Page" style={{ backgroundImage: `url(${this.state.backgroundImage})` }}>
        <section className='top-section' style={{ backgroundImage: `url(${this.state.secondaryBGImage})` }}>
          <LogoMark title={this.state.title} logo={this.state.logoImage} styleType='horizontal'/>
          <div className="page-content">
            {convertStringToHTML(this.state.pageContent)}
          </div>
        </section>
        <section className='bottom-section'>
          <div className='page-content'>
            <BlogPreviewArea
              currentPage={this.state.pageIndex}
              maxPosts={this.state.maxPostsPerPage}
              handlePaginationVisibility={this.handlePaginationVisibility}
              handleBlogPostData={this.handleBlogPostData}
            />
          </div>
          <Pagination
            visibility={this.state.paginationVisibility}
            handlePageNavClick={this.handlePageNavClick}
            pageIndex={this.state.pageIndex}
            numPages={this.state.numPages}
          />
        </section>
        <ResumeButton />
        <HamburgerMenu />
      </div>
    )
  }
}
// <BlogPostModal
 //  history={this.state.history}
 //  blogSlug={this.state.blogSlug}
 // />
