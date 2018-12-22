import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom"
import Page from '../components/Page.js'
import Menu from '../components/Menu.js'
import ResumeButton from '../components/ResumeButton.js'
import HamburgerMenu from '../components/HamburgerMenu.js'
import LogoMark from '../components/Widgets.js'
import BlogPost from '../components/BlogPost.js'
import LoadingSpinner from '../components/LoadingSpinner.js'
import $ from "jquery";
import createBrowserHistory from 'history/createBrowserHistory'
import convertStringToHTML from '../components/Helpers.js'

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
      //Set a dummy route until the data is ready
      blogRoute: '/some-post'
    };
  }

  render() {
    return(
      <div key={this.props.uniqueKey} className={this.props.blogClass + ' container transition-in'} style={{
        animationDelay: this.props.animDelay}}>
        <div className='left-side'>

          <Link to={this.state.blogRoute}>
            <div className='blog-image'>
              <div className='blog-image-inner' style={{ backgroundImage: `url(${this.props.previewImage})` }}></div>
            </div>
          </Link>

        </div>
        <div className='right-side'>
          <div className='row-0'>
            <Link to={this.state.blogRoute}><h1>{this.props.blogTitle}</h1></Link>
          </div>
          <div className='date row-1'>
            {this.props.blogDate}
          </div>
          <div className='content-snippet row-2'>
              {this.props.blogExcerpt}
          </div>
          <div className='read-more row-3'>
            <a href={this.props.blogLink}>Read More >></a>
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
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return <div className="debug-blogpreview" style={{ width: '400px', height: '100px', backgroundColor: 'blue' }}>
      Current Page {this.props.currentPage}
    </div>
  }
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
      //blogPreviewContent is the blog preview content HTML
      blogPreviewContent: null,
      maxPostsPerPage: 3,
      //pageIndex is the current page we're on and will be set by the query param of the URL
      pageIndex: null,
      numPages: '',
      loaderVisibility: null,
      blogPost: null,
      //blogIDs is a list of slug to id key value pairs for the purpose of routing
      //and sending the correct data through the router
      blogIDs: {},
      maxBlogTitleLength: 30,
      paginationVisibility: false,
    };

    //If there is no query param for the BlogPage, then we replace the current url
    //in the window with a query param for page 1
    if(!this.props.history.location.search) {
      this.updateURL(1, true);
    }
  }

  updateURL(pageQueryID, replace=false) {
    let url = this.props.match.url;
    let pageQuery = '?page=';
    let newURL = url + pageQuery + pageQueryID;

    //If false, we push a new entry (this is useful when we're navigating back and forth
    //through different blog pages)
    if(!replace) {
      this.props.history.push(newURL);
    } else {
    //Otherwise, we replace the current url. This is so that we can update the current url
      this.props.history.replace(newURL);
    }
  }

  async componentDidMount() {

    const maxPages = await(await(fetch(PAGES_API))).json();
    const pageData = await(await(fetch('http://www.greghennessey.com/wp-json/wp/v2/pages/' + PAGE_ID))).json();

    console.log('\n----- Blog Page Mounted - Async -----\nBlog Page data is retrieved as follows:');
    console.log(pageData);
    console.log(this.props);

    //When the component mounts, parse the query string to get what page we are on and set it as the index
    let pageIndex = this.parseQueryString(this.props);

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
      paginationVisibility: 'visible',
      pageIndex: pageIndex,
    });
  }

  parseQueryString = ({history: {location: {search}}}) => {
    const parsedQuery = queryString.parse(search);
    let queryStringID = parsedQuery.page;

    return queryStringID
  }

  setPageIndex = (index) => {
    let newIndex = index;

    console.log(this.props);

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
    if(prevState.pageIndex != this.state.pageIndex) {
      //this.fetchPostData();
    }
  }

  //This method shows or removes a spinning loader component depending on if
  //data is loading or not
  switchLoaderVisibility() {
    var visibility = this.state.loaderVisibility;
    var newVisibility;
    if(visibility === null) {
      newVisibility = <LoadingSpinner />;
    } else {
      newVisibility = null
    }
    this.setState({
      loaderVisibility: newVisibility,
    });
  }

  //This method fetches blog data that will be displayed as a blog preview
  fetchPostData() {
    //Show the "Loading Spinner" while I'm getting post data
    this.switchLoaderVisibility();
    this.setState({
      paginationVisibility: false,
    });

    //Let's construct the API call here. Get the base, plus the number of posts per page
    //And the page we're on
    let api_Base = PAGES_API;
    let api_PostsPerPage = '?per_page=' + this.state.maxPostsPerPage;
    let api_CurrentPage = '&page=' + this.state.pageIndex;
    let api_Final = api_Base + api_PostsPerPage + api_CurrentPage;

    fetch(api_Final)
      .then(results => results.json())
      .then(data => {
        if(data) {
          //Turn the loader off again since data is loaded
          this.switchLoaderVisibility();

          console.log('\n----- Post Data ----- \n' +
          'Data being called here is being used in the blog previews we are generating');
          console.log(data);
          this.buildLinkContent(data);
        }
      });
  }

  shortenBlogTitle = (blogTitle) => {
    let oldBlogTitle = blogTitle;
    let newBlogTitle;
    if(oldBlogTitle.length > 30) {
      newBlogTitle = oldBlogTitle.slice(0, this.state.maxBlogTitleLength) + "...";

    } else {
      newBlogTitle = oldBlogTitle;
    }
    return newBlogTitle;
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
          />);

          let blogRoutingData = {}

          //blogRoutingData[blogPreviewData.slug].id = blogPreviewData.id;
      }

      //Show pagination nav again, since we were hiding it
      this.setState({
        paginationVisibility: true,
      });
    }

    this.setState({
      blogPreviewContent: blogPreviewContent,
      //blogIDs: blogRoutingData
    });
  }

  //Handle CLICK of Pagination Buttons
  handlePageNavClick(e) {
    let clickedButton = e.target.className;
    let back = 'button-back';
    let forward = 'button-forward';

    let currentIndex = parseInt(this.state.pageIndex);

    if(clickedButton === forward) {
      this.setPageIndex(currentIndex + 1);
    } else if (clickedButton === back) {
      this.setPageIndex(currentIndex - 1);
    } else {
      console.log('There seems to be an issue detecting which button was pressed.');
    }
  }

  render() {
    var loaderVisibility = this.state.loaderVisibility;
    return(
      <div className="BlogMain Page" style={{ backgroundImage: `url(${this.state.backgroundImage})` }}>
        <section className='top-section' style={{ backgroundImage: `url(${this.state.secondaryBGImage})` }}>
          <LogoMark title={this.state.title} logo={this.state.logoImage} style='horizontal'/>
          <div className="page-content">
            {convertStringToHTML(this.state.pageContent)}
          </div>
        </section>
        <section className='bottom-section'>
          <div className='page-content'>
            <div className='blog-list-container'>
              <div className='loader'>
                {this.state.loaderVisibility}
              </div>
                {<BlogPreviewArea currentPage={this.state.pageIndex} />}
            </div>
          </div>
          <div className='pagination' style={{ visibility: this.state.paginationVisibility ? 'visible' : 'hidden' }}>
            <a className='button-back' onClick={this.handlePageNavClick}>&lt; Back</a>
            <span>{this.state.pageIndex + "/" + this.state.numPages}</span>
            <a className='button-forward' onClick={this.handlePageNavClick}>Forward &gt;</a>
          </div>
        </section>
        <ResumeButton />
        <HamburgerMenu />
      </div>
    )
  }
}
