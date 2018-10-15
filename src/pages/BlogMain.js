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

//Routes
const routes = {
  blogPost: {
    base_path: '/blog/post'
  }
}

const customHistory = createBrowserHistory();

const BlogPostRoute = ({ match }) => {
  return <BlogPost postID={match} postSlug={match.params.post_id} history={customHistory}></BlogPost>
}

class BlogPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogClick: this.props.onClick,
      //Set a dummy route until the data is ready
      blogRoute: '/blog/some-post'
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
          <a href={this.props.blogLink}>
            <div className='blog-image'>
              <div className='blog-image-inner' style={{ backgroundImage: `url(${this.props.previewImage})` }}></div>
            </div>
          </a>
        </div>
        <div className='right-side'>
          <div className='row-0'>
            <Link id={this.props.id} to={this.state.blogRoute}><h1>{this.props.blogTitle}</h1></Link>
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
      maxPostsPerPage: null,
      pageIndex: 1,
      numPages: null,
      loaderVisibility: null,
      blogPost: null,
      //This is a list of slug to id key value pairs for the purpose of routing
      //and sending the correct data through the router
      blogIDs: {}
    };
  }

  fetchPostData() {
    this.fadeContentOut();
    //Get Blog Preview Data
    ///wp-json/acf/v3/posts
    this.switchLoaderVisibility();
    fetch('http://www.greghennessey.com/wp-json/wp/v2/posts')
      .then(results => results.json())
      .then(data => {
        if(data) {
          console.log('----- Post Data -----');
          console.log(data);
          this.buildLinkContent(data),
          this.switchLoaderVisibility(),
          this.setState({
            numPages: Math.round(data.length / this.state.maxPostsPerPage),
          });
        }
      });
  }

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

  componentWillMount() {
    this.getPageData(PAGE_ID);
  }

  setPageNumber(increment) {
    let currentPage = this.state.pageIndex;
    let newPage = this.state.pageIndex + increment;
    let maxPage = this.state.numPages;
    //Check that the page we want to go to doesn't exceed the range of Pages
    //we can navigate
    if(newPage <= maxPage && newPage > 0) {
      let pageDataOffset = newPage * maxPage;
      this.setState({
        pageIndex: newPage,
      });
      this.fetchPostData();
    }

  }

  fadeContentOut() {
    var contentContainers = this.state.blogPreviewContent;
    if(contentContainers) {
      for(var i=0; i < contentContainers.length; i++) {
        let bClass = '.'+contentContainers[i].props.blogClass;
        $(bClass).removeClass('transition-in').css({visibility: 'hidden', animationDelay: '0s', opacity: '0'});
      }
    }
  }

  //Once link data is grabbed, let's get the data and build the HTML content
  //structure
  buildLinkContent = (data) => {
    var blogPreviewContent = [];
    var blogData = data;
    //This is the index of where the loop will start
    var pageIndexOffset = this.state.pageIndex - 1;
    var loopStart = pageIndexOffset * this.state.maxPostsPerPage;
    var loopEnd = Number(this.state.maxPostsPerPage) + Number(loopStart);

    //Animation Settings
    var transitionDelay = 0.05;

    for(var i=loopStart; i < loopEnd; i++) {

      let blogPreviewData = blogData[i];

      if(blogPreviewData) {
        blogPreviewContent.push(
          <BlogPreview
            key = {i}
            id = {blogPreviewData.id}
            blogTitle = {blogPreviewData.title.rendered}
            blogDate = {blogPreviewData.date}
            blogClass = {'blog-preview-'+i}
            animDelay = {transitionDelay * (i - loopStart) + 's'}
            previewImage = {blogPreviewData.acf.header_image.url}
            blogExcerpt = {this.convertStringToHTML(blogPreviewData.excerpt.rendered)}
            blogLink = {blogPreviewData.link}
            pageSlug = {blogPreviewData.slug}
            onClick = {this.setupBlogPost}
          />);

          let blogRoutingData = {}

          blogRoutingData[blogPreviewData.slug].id = blogPreviewData.id;

          

          // let oldIDsState = this.state.blogIDs;
          // let newIDsState = [...oldIDsState, blogRoutingData];
          //
          // this.setState({
          //   blogIDs: newIDsState
          // });
          //
          // console.log("----- blogPreviewData blogID's updated ------");
          // console.log(this.state.blogIDs);
      }
    }
    this.setState({
      blogPreviewContent: blogPreviewContent,
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

  setupBlogPost(e) {

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
              <div className='loader' style={{}}>
                {this.state.loaderVisibility}
              </div>
              {
                /* This is where all of the preview content is generated */
                this.state.blogPreviewContent
              }
            </div>
            <div className='pagination'>
              <a className='button-back' onClick={this.handlePageNavClick}>&lt; Back</a>
              {this.state.pageIndex + "/" + this.state.numPages}
              <a className='button-forward' onClick={this.handlePageNavClick}>Forward &gt;</a>
            </div>
          </div>
        </section>
        <ResumeButton />
        <HamburgerMenu />
        <Route
          path="/blog/post/:post_slug"
          component={BlogPostRoute}
          history={customHistory}
          postID={12}
        />
      </div>
    )
  }
}
//  <Route strict={true} exact={false} path={routes.blogPost.base_path + routes.blogPost.wildcard} component={BlogPost}/>
