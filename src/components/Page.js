import React, { Component } from 'react'
import ResumeButton from '../components/ResumeButton.js'
//User react HTML parser to get HTML out of the json returns from wordpress
import ReactHtmlParser from 'react-html-parser';
//This is the base component for a page and allows me to get and return specifically
//basic information. I extend this for each Page created and can make custom functionality

const API = "http://demo.wp-api.org/wp-json"
const PAGES = "/wp/v2/pages"

export default class Page extends Component {

  constructor() {
    super();
    this.state = {
      title: '',
      pageData: [],
      menuItems: [],
    };
  }

  getPageData(ID) {
    fetch('http://www.greghennessey.com/wp-json/wp/v2/pages/' + ID)
      .then(results => results.json())
      .then(data => {
        console.log('----Page data-----');
        console.log(data);
        if(data.id === ID) {
          //Set basic site data here
          this.setState({
            pageData: data
          },
          //Callback on pageDataIsSet when we receive all data
          () => (
                  this.pageDataIsSet()
                )
          );
        }
      })
  }

  //Callback function for when we receive page data
  pageDataIsSet = () => {
    console.log('page data is set');
  }

}
