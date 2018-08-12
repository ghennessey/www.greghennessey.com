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
      menuItems: [],
    };
  }

  getMenuItems() {
    //Get a list of all pages and their URL's
    const findPages = (data) => {
      var pages = [];
      for(var i = 0; i < data.length; i++) {
        pages.push({
          pageTitle: data[i].title.rendered,
          pageSlug: data[i].slug,
        });
      }
      return pages;
    }

    fetch(API + PAGES)
      .then(results => results.json())
      .then(data => {
        var menuArray = findPages(data);
        this.setState({
          menuItems: menuArray,
        },
        () => (
                this.menuDataIsSet()
              )
        );
      });
  }

  menuDataIsSet = () => {
    console.log('Menu data is set');
  }

  getPageData(pageSlug) {
    fetch(API + PAGES + pageSlug)
      .then(results => results.json())
      .then(data => {
        for (var i = 0; i < data.length; i++) {
          //If the slug in the page I'm searching through matches what Im looking for
          if(data[i].slug === pageSlug) {
            //Set basic site data here
            this.setState({
              pageData: data[i]
            },
            //Callback on pageDataIsSet when we receive all data
            () => (
                    this.pageDataIsSet()
                  )
            );
          }
        }
      })
  }

  pageDataIsSet = () => {
    console.log('Page data is set');
    console.log(this.state.pageData);
  }

}
