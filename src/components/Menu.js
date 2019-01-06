import React, { Component } from 'react'
import { Link } from "react-router-dom";

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

  async componentDidMount() {
    const menuData = await(await(fetch('http://www.greghennessey.com/wp-json/gh/v1/menu_items'))).json();
    this.setState({
      items: menuData
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //When the state pageIndex is updated, I do a new data call to fetch page data
    if(prevState.items !== this.state.items) {
      var menuStruct = [];
      //console.log('\n-----Menu Paths (Menu.js)-----');
      for(var i=0; i < this.state.items.length; i++) {
        var path = this.getPagePath(this.state.items[i].url);
        //console.log('path: ' + path);
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
