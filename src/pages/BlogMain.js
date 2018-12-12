import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import Page from '../components/Page.js'
import Menu from '../components/Menu.js'
import ResumeButton from '../components/ResumeButton.js'
import HamburgerMenu from '../components/HamburgerMenu.js'
import LogoMark from '../components/Widgets.js'
import BlogPost from '../components/BlogPost.js'
import LoadingSpinner from '../components/LoadingSpinner.js'
import $ from "jquery";
import createBrowserHistory from 'history/createBrowserHistory'

//Pass this slug in to get the specific page data I am looking for
const PAGE_ID = 87;
const PAGES_API = 'http://www.greghennessey.com/wp-json/wp/v2/posts';

//Routes
const routes = {
  blogPost: {
    base_path: '/post'
  }
}

//const customHistory = createBrowserHistory();

// const BlogPostRoute = ({ match }) => {
//   return <BlogPost postSlug={match.params.post_slug} history={customHistory} />
// }

class BlogPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogClick: this.props.onClick,
      //Set a dummy route until the data is ready
      blogRoute: '/some-post'
    };
  }

  componentWillMount() {
    //When the data is ready set our proper route
    var blogRoute = routes.blogPost.base_path + '/' + this.props.pageSlug;
    this.setState({
      blogRoute: blogRoute,
    });
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

export default class BlogMain extends Page {
  constructor() {
    super();
    this.handlePageNavClick = this.handlePageNavClick.bind(this);
    this.state = {
      title: '',
      backgroundImage: '',
      secondaryBGImage: '',
      //This is actually just the title of the blog
      pageContent: '',
      //This is the blog preview content HTML
      blogPreviewContent: null,
      maxPostsPerPage: 3,
      pageIndex: 1,
      numPages: '',
      loaderVisibility: null,
      blogPost: null,
      //This is a list of slug to id key value pairs for the purpose of routing
      //and sending the correct data through the router
      blogIDs: {}
    };
  }

  componentWillMount() {
    this.getPageData(PAGE_ID);
    //Set the max number of pages we can view
    this.setMaxNumPages(PAGES_API);
  }

  //When a page button is clicked, set the page number so we know which data to grab
  setPageNumber(increment) {
    let currentPage = this.state.pageIndex;
    let newPage = this.state.pageIndex + increment;
    let maxPage = this.state.numPages;

    //Check that the page we want to go to doesn't exceed the range of Pages
    //we can navigate
    if(newPage <= maxPage && newPage > 0 && maxPage) {
      //Set New Page & Clear old page content
      this.setState({
        pageIndex: newPage,
        blogPreviewContent: null,
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //When the state pageIndex is updated, I do a new data call to fetch page data
    if(prevState.pageIndex != this.state.pageIndex) {
      console.log('PAGE INDEX IS UPDATED');
      this.fetchPostData();
    }
  }

//This method fades out blog preview content in a transition when content is
//loading
  fadeContentOut() {
    var contentContainers = this.state.blogPreviewContent;
    if(contentContainers) {
      for(var i=0; i < contentContainers.length; i++) {
        let bClass = '.'+contentContainers[i].props.blogClass;
        $(bClass).removeClass('transition-in').css({visibility: 'hidden', animationDelay: '0s', opacity: '0'});
      }
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
    //Fade content out while I'm loading, so I can show the loading spinner
    //this.fadeContentOut();
    //Show the "Loading Spinner" while I'm getting post data
    this.switchLoaderVisibility();

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

          console.log('----- Post Data ----- \n' +
          'Data being called here is being used in the blog previews we are generating');
          console.log(data);

          this.buildLinkContent(data);
        }
      });
  }

  //TODO - This needs to be made more efficient. I don't like loading all Data
  //just to get how many pages are in the blog. I might need to build my own
  //PHP callback for this
  setMaxNumPages = (api) => {
    fetch(api)
      .then(results => results.json())
      .then(data => {
        if(data) {
          this.setState({
            numPages: Math.round(data.length / this.state.maxPostsPerPage),
          });
        }
      });
  }

  //Once post data is grabbed, let's get the data and build the HTML content
  //structure
  buildLinkContent = (data) => {
    var blogPreviewContent = [];
    var blogData = data;

    console.log('\nBuild link Content');
    console.log(blogData);

    //Animation Settings
    var transitionDelay = 0.05;

    for(var i=0; i < blogData.length; i++) {

      console.log(i);

      let blogPreviewData = blogData[i];

      console.log(blogPreviewData);

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
            blogExcerpt = {this.convertStringToHTML(blogPreviewData.excerpt.rendered)}
            blogLink = {blogPreviewData.link}
            pageSlug = {blogPreviewData.slug}
          />);

          let blogRoutingData = {}

          //blogRoutingData[blogPreviewData.slug].id = blogPreviewData.id;
      }
    }

    this.setState({
      blogPreviewContent: blogPreviewContent,
      blogIDs: blogRoutingData
    });
  }

  //Overwrite this callback from Page.getPageData to get the data I need for
  //this specific page
  pageDataIsSet = () => {
    //Set the states
    this.setState({
      //This title is used for the Logo Mark
      title: this.state.pageData.page_header,
      backgroundImage: this.state.pageData.background_image.url,
      secondaryBGImage: this.state.pageData.secondary_bg_image.url,
      logoImage: this.state.pageData.logo_image.url,
      //This is just the title of the page
      pageContent: this.state.pageData.content.rendered,
      //Blog posts per page shows how many will be loaded and displayed
      maxPostsPerPage: this.state.pageData.acf.max_posts,
    });

    this.fetchPostData();
  }

  //Handle CLICK of Pagination Buttons
  handlePageNavClick(e) {
    let clickedButton = e.target.className;
    let back = 'button-back';
    let forward = 'button-forward';
    if(clickedButton === forward) {
      this.setPageNumber(1)
    } else if (clickedButton === back) {
      this.setPageNumber(-1);
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
            {this.convertStringToHTML(this.state.pageContent)}
          </div>
        </section>
        <section className='bottom-section'>
          <div className='page-content'>
            <div className='blog-list-container'>
              <div className='loader'>
                {this.state.loaderVisibility}
              </div>
              {
                /* This is where all of the preview content is generated */
                this.state.blogPreviewContent
              }
            </div>
            <div className='pagination'>
              <a className='button-back' onClick={this.handlePageNavClick}>&lt; Back</a>
              <span>{this.state.pageIndex + "/" + this.state.numPages}</span>
              <a className='button-forward' onClick={this.handlePageNavClick}>Forward &gt;</a>
            </div>
          </div>
        </section>
        <ResumeButton />
        <HamburgerMenu />
      </div>
    )
  }
}

// <Route
//   path = "/blog/post/:post_slug"
//   render = {BlogPostRoute}
//   history = {customHistory}
// />

//<RouteWithProps path={"/blog/post/:post_slug"} component={BlogPost} blogIDs={this.state.blogIDs} history={customHistory} />
