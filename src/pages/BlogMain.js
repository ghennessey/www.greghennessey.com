import React, { Component } from 'react'
import Page from '../components/Page.js'
import Menu from '../components/Menu.js'
import ResumeButton from '../components/ResumeButton.js'
import HamburgerMenu from '../components/HamburgerMenu.js'
import LogoMark from '../components/Widgets.js'

//Pass this slug in to get the specific page data I am looking for
const PAGE_ID = 87;

export default class BlogMain extends Page {
  constructor() {
    super();
    this.handlePageNavClick = this.handlePageNavClick.bind(this);
    this.state = {
      title: '',
      backgroundImage: '',
      secondaryBGImage: '',
      pageContent: '',
      maxPostsPerPage: null,
      pageIndex: 1,
      numPages: null,
      loaderVisibility: 'hidden',
    };
  }

  fetchPostData() {
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

  //Once link data is grabbed, let's get the data and build the HTML content
  //structure
  buildLinkContent = (data) => {
    var blogPreviewContent = [];

    var blogData = data;
    //This is the index of where the loop will start
    var pageIndexOffset = this.state.pageIndex - 1;
    var loopStart = pageIndexOffset * this.state.maxPostsPerPage;
    var loopEnd = Number(this.state.maxPostsPerPage) + Number(loopStart);

    for(var i=loopStart; i < loopEnd; i++) {

      let blogPreviewData = blogData[i];

      if(blogPreviewData) {
        let previewImage = blogPreviewData.acf.header_image.url;
        let blogTitle = blogPreviewData.title.rendered;
        let blogDate = blogPreviewData.date;
        let blogExcerpt = blogPreviewData.excerpt.rendered;
        let blogLink = blogPreviewData.link;

        let blogBlock = [

          <div key={'blog-preview-'+i} className={'blog-preview-'+ i + ' container ' + 'slide-in'}>
            <div className='left-side'>
              <a href={blogLink}>
                <div className='blog-image' style={{ backgroundImage: `url(${previewImage})` }}></div>
              </a>
            </div>
            <div className='right-side'>
              <div className='row-0'>
                <a href={blogLink}>
                  <h1>{blogTitle}</h1>
                </a>
              </div>
              <div className='date row-1'>
                {blogDate}
              </div>
              <div className='content-snippet row-2'>
                  {this.convertStringToHTML(blogExcerpt)}
              </div>
              <div className='read-more row-3'>
                <a href={blogLink}>Read More >></a>
              </div>
            </div>
          </div>

        ];
        blogPreviewContent.push(blogBlock);
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
