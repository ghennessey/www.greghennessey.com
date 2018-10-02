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
    this.state = {
      title: '',
      backgroundImage: '',
      secondaryBGImage: '',
      pageContent: '',
      maxPostsPerPage: null,
      pageIndex: 1,
    };
  }

  fetchPostData() {
    console.log('Calling fetchPostData');
    //Get Blog Preview Data
    ///wp-json/acf/v3/posts
    fetch('http://www.greghennessey.com/wp-json/wp/v2/posts')
      .then(results => results.json())
      .then(data => {
        if(data) {
          this.buildLinkContent(data)
        }
      })
  }

  componentWillMount() {
    this.getPageData(PAGE_ID);
  }

  //Once link data is grabbed, let's get the data and build the HTML content
  //structure
  buildLinkContent = (data) => {
    console.log('building link content ' + this.state.maxPostsPerPage);
    console.log(data);
    var blogPreviewContent = [];

    //If the loop is shorter than the Max Posts per Page, then we accept the
    //smaller number
    var loopLength = this.state.maxPostsPerPage > data.length ? data.length : this.state.maxPostsPerPage;

    //TODO - add a button so I can click into the next page of my blog

    for(var i=0; i < loopLength; i++) {
      //TODO - Remove these logs
      // console.log('---- Blog Data ' + i + ' ------');
      // console.log(data[i]);
      let blogPreviewData = data[i];

      let previewImage = blogPreviewData.acf.header_image.url;
      let blogTitle = blogPreviewData.title.rendered;
      let blogDate = blogPreviewData.date;
      let blogExcerpt = blogPreviewData.excerpt.rendered;
      let blogLink = blogPreviewData.link;

      let blogBlock = [

        <div key={'blog-preview-'+i} className={'blog-preview-'+ i + ' container'}>
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
            <div className='row-3'>
              <a href={blogLink}>Read More >></a>
            </div>
          </div>
        </div>

      ];
      blogPreviewContent.push(blogBlock);
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

  render() {
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

              {this.state.blogPreviewContent}

            </div>
          </div>
        </section>
        <ResumeButton />
        <HamburgerMenu />
      </div>

    )
  }
}
