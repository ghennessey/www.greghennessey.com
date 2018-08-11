import React, { Component } from 'react'

//This is the base component for a page and allows me to get and return specifically
//basic information. I extend this for each Page created and can make custom functionality

const API = "http://www.greghennessey.com/wp-json"
const PAGES = "/wp/v2/pages/?"

export default class Page extends Component {

  constructor() {
    super();
    this.state = {
      title: '',
      pageData: [],
    };
  }

  getPageData(pageSlug) {
    fetch(API + PAGES + pageSlug)
      .then(results => results.json())
      .then(data => {
        for (var i = 0; i < data.length; i++) {
          if(data[i].slug === pageSlug) {
            //Set and structure basic site information here
            console.log('page data');
            console.log(data[i]);
            this.setState({
              pageData: data[i],
              title: data[i].title.rendered
            });
            return;
          }
        }
      });
  }

}
