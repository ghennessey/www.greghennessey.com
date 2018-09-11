import React, { Component } from 'react'
import Page from '../components/Page.js'
import Menu from '../components/Menu.js'
//User react HTML parser to get HTML out of the json returns from wordpress
import ReactHtmlParser from 'react-html-parser';

//Pass this slug in to get the specific page data I am looking for
const PAGE_ID = 10;

function ResumeButton () {
  return (
    <div className="resume-button">
      <button>Download Resume</button>
    </div>
  )
}

function LoaderAnimation () {
  return (
    <div className="loader-wrapper">
      <div className="Loader"></div>
    </div>
  )
}

//Home Page component
//Later I want to break this down into a component specifically for home
//and a component for Pages that Home extends
class Home extends Page {

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

  componentDidMount() {

  }

  //Overwrite this callback from Page.getPageData to get the data I need for
  //this specific page
  pageDataIsSet = () => {
    //Set the states
    this.setState({
      title: this.state.pageData.title.rendered,
      backgroundImage: this.state.pageData.background_image.url,
      logoImage: this.state.pageData.logo_image.url,
      pageContent: this.state.pageData.post_content,
    });
  }

  convertStringToHTML = (string) => {
    var html = string;
    return ReactHtmlParser(html)
  }

  render() {
    return (
      <div className="Home Page" style={{ backgroundImage: `url(${this.state.backgroundImage})` }}>
        <div className="nav-container">
          <img className="logo" alt='Logo' src={this.state.logoImage} />
          <h1>{this.state.title}</h1>
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

export default Home
