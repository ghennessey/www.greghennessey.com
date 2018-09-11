import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

//TODO - Set this up to dynamically interpret the site url
const SITE_URL = 'http://www.greghennessey.com';

export default class Menu extends Component {

  getPagePath(page) {
    var pagePath = page.slice(SITE_URL.length, page.length);
    //console.log('pagePath: ' + pagePath);
    return pagePath
  }

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      display: [],
    };
  }

  getMenuItems() {
    fetch('http://www.greghennessey.com/wp-json/gh/v1/menu_items')
      .then(results => results.json())
      .then(data => {
        this.setState({
          items: data,
        },
        () => (
                this.menuDataIsSet()
              )
        );
      });
  }

  //Callback - When the menu data is set, then build the rendering structure
  //for the menu items so that we have something to iterate through before
  //this is ever called
  menuDataIsSet = () => {
    var menuStruct = [];
    console.log('-----Menu Paths-----');
    for(var i=0; i < this.state.items.length; i++) {
      var path = this.getPagePath(this.state.items[i].url);
      console.log('path: ' + path);
      menuStruct.push(
        <li key={this.state.items[i].title}>
          <Link key={this.state.items[i].ID} to={path}>{this.state.items[i].title}</Link>
        </li>
      );
    }

    this.setState({
      display: menuStruct,
    });
  }

  handleClick(e) {
    //TODO - Build handling for selecting menu items
    console.log(e);
  }

  componentWillMount() {
    this.getMenuItems();
  }

  render() {
    return(
      <div className="Menu">
        <ul>
          {this.state.display}
        </ul>
      </div>
    );
  }
}
