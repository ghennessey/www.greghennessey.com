import React, { Component } from 'react'
import Page from '../components/Page.js'
import Menu from '../components/Menu.js'
import ResumeButton from '../components/ResumeButton.js'
import HamburgerMenu from '../components/HamburgerMenu.js'
import LogoMark from '../components/Widgets.js'
import $ from "jquery";

//Pass this slug in to get the specific page data I am looking for
const PAGE_ID = 87;

class BlogPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: '',
    };
  }

  render() {
    return(
      <div key={this.props.uniqueKey} className={this.props.blogClass + ' container transition-in ' + this.state.classes} style={{
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
            <a href={this.props.blogLink}>
              <h1>{this.props.blogTitle}</h1>
            </a>
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
      loaderVisibility: 'hidden',
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
    if(visibility === 'hidden') {
      newVisibility = 'visible';
    } else {
      newVisibility = 'hidden'
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
        //$(bClass).addClass('transition-out');
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
            blogTitle = {blogPreviewData.title.rendered}
            blogDate = {blogPreviewData.date}
            blogClass = {'blog-preview-'+i}
            animDelay = {transitionDelay * (i - loopStart) + 's'}
            previewImage = {blogPreviewData.acf.header_image.url}
            blogExcerpt = {this.convertStringToHTML(blogPreviewData.excerpt.rendered)}
            blogLink = {blogPreviewData.link}
            fadeOut = {false}
          />);
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
  handlePageNavClick (e) {
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
              <div className='loader' style={{visibility: loaderVisibility}}>
                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              </div>
              {this.state.blogPreviewContent}
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
      </div>

    )
  }
}
