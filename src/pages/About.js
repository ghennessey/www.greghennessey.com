import React, { Component } from 'react'
import Page from '../components/Page.js'
import Menu from '../components/Menu.js'
//User react HTML parser to get HTML out of the json returns from wordpress
import ReactHtmlParser from 'react-html-parser';

export default class About extends Page {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return(
      <div>
      <h1>This is the about page</h1>
      <Menu />
    </div>
    )
  }
}
