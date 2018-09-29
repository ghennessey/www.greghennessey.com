import React, { Component } from 'react'
import Page from '../components/Page.js'
import Menu from '../components/Menu.js'
import ResumeButton from '../components/ResumeButton.js'
import LogoMark from '../components/Widgets.js'

//Pass this slug in to get the specific page data I am looking for
const PAGE_ID = 10;

//Home Page component
//Later I want to break this down into a component specifically for home
//and a component for Pages that Home extends
export default class Home extends Page {

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
    return (
      <div className="Home Page" style={{ backgroundImage: `url(${this.state.backgroundImage})` }}>
        <div className="nav-container">
          <LogoMark title={this.state.title} logo={this.state.logoImage} />
          <Menu />
        </div>
        <div className="page-content">
          {this.convertStringToHTML(this.state.pageContent)}
        </div>
        <ResumeButton />
      </div>
    )
  }
}
