import React, { Component } from 'react'
import Page from '../components/Page.js'
import Menu from '../components/Menu.js'
import ResumeButton from '../components/ResumeButton.js'
import HamburgerMenu from '../components/HamburgerMenu.js'

//Pass this slug in to get the specific page data I am looking for
const PAGE_ID = 21;

export default class About extends Page {
  constructor() {
    super();
    this.state = {
      title: '',
      backgroundImage: '',
      pageContent: '',
    };
  }

  componentWillMount() {
    this.getPageData(PAGE_ID);
  }

  //Overwrite this callback from Page.getPageData to get the data I need for
  //this specific page
  pageDataIsSet = () => {
    //Set the states
    this.setState({
      title: this.state.pageData.page_header,
      backgroundImage: this.state.pageData.background_image.url,
      logoImage: this.state.pageData.logo_image.url,
      pageContent: this.state.pageData.content.rendered,
    });
  }

  render() {
    return(
      <div className="About Page" style={{ backgroundImage: `url(${this.state.backgroundImage})` }}>
        <ResumeButton />
        <HamburgerMenu />
        <section className='left-section'>
          <div className="page-content">
            {this.convertStringToHTML(this.state.pageContent)}
          </div>
        </section>
        <section className='right-section'></section>
        <h1>This is the about page</h1>
    </div>

    )
  }
}
