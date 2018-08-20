import React, { Component } from 'react'
import Page from '../components/Page.js'
//User react HTML parser to get HTML out of the json returns from wordpress
import ReactHtmlParser from 'react-html-parser';

//Pass this slug in to get the specific page data I am looking for
const SLUG = 'home-page'

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

function MenuItems (props) {
  console.log("MenuItems props")
  console.log(props)
  return(
    <div className="Menu">
      <ul>
      // {this.props.items.map(d =>
      //  <li key={d.title}>
      //   <a key={d.ID} href="#">{d.title}</a>
      //  </li>)}
      </ul>
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
      menuItems: [],
      pageContent: '',
    };
  }

  componentWillMount() {
    this.getPageData(SLUG);
    this.getMenuItems();
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
      pageContent: this.state.pageData.content.rendered,
    });

    console.log(this.state.pageData);
  }

  convertStringToHTML = (string) => {
    var html = string;
    return ReactHtmlParser(html)
  }

  //Overwrite menuDataIsSet to get the results I rendered
  // menuDataIsSet = () => {
  //   console.log('New menu data is set');
  //   console.log(this.state.menuItems);
  // }

  render() {
    return (
      <div className="Home Page" style={{ backgroundImage: `url(${this.state.backgroundImage})` }}>
        <div className="loader-page-overlay">
          <LoaderAnimation />
        </div>
        <div className="nav-container">
          <img className="logo" src={this.state.logoImage} />
          <h1>{this.state.title}</h1>
          <MenuItems menuItems={this.state.menuItems} />
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
