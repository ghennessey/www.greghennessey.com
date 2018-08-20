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
  var items = [];

  for(var i=0; i < props.menuItems.length; i++) {
    items.push(
      <li key={props.menuItems[i].title}>
        <a key={props.menuItems[i].ID} href="#">{props.menuItems[i].title}</a>
      </li>
    );
  }

  return(
    <div className="Menu">
      <ul>
        {items}
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

  render() {
    return (
      <div className="Home Page" style={{ backgroundImage: `url(${this.state.backgroundImage})` }}>
        <div className="loader-page-overlay">
          <LoaderAnimation />
        </div>
        <div className="nav-container">
          <img className="logo" src={this.state.logoImage} />
          <h1>{this.state.title}</h1>
          <MenuItems menuItems={this.state.menuItems}>
            <div>This is just a test</div>
          </MenuItems>
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
