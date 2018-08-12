import React, { Component } from 'react'
import Page from '../components/Page.js'

//Pass this slug in to get the specific page data I am looking for
const SLUG = 'home-page'

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
    });

    console.log(this.state.pageData);
  }

  //Overwrite menuDataIsSet to get the results I rendered
  menuDataIsSet = () => {
    console.log('New meny data is set');
    console.log(this.state.menuItems);
  }

  render() {
    return (
      <div className="Home Page" style={{ backgroundImage: `url(${this.state.backgroundImage})` }}>
        <div className="nav-container">
          <img className="logo" src={this.state.logoImage} />
          <h1>{this.state.title}</h1>
          <ul>
            {
              this.state.menuItems.map(d =>
                <li key={d.pageSlug}>
                  <a key={d.pageSlug} href="#">{d.pageTitle}</a>
                </li>)
            }
          </ul>
        </div>
      </div>
    )
  }
}

export default Home
