import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//var WPAPI = require( 'wpapi' );
//var wp = new WPAPI({ endpoint: 'http://www.greghennessey.com/wp-json' });

const API = "http://www.greghennessey.com/wp-json";
const PAGES = "/wp/v2/pages";

class App extends Component {

  constructor() {
    super();
    this.state = {
      hits: [],
      //REMOVE - Page title needs to be moved into another lower component
      pageTitle: ''
    };
  }

  componentDidMount() {

    //Asyncronously get data and set the results
    fetch(API + PAGES)
      .then(results => results.json())
      .then(data => {
        //Grab the site JSON data and store it in a state for futre use
        //REMOVE - remove this log later
        console.log(data);
        this.setState({hits: data});
      }).then(
        //REMOVE - This section is just here to set an example pageTitle
        //later I would like to move this down into deeper functions and components and just
        //get site data at the high level
        data => {
          this.setState({
            pageTitle: this.state.hits[0].title.rendered
          });
        }
      );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div>{this.state.pageTitle}</div>
      </div>
    );
  }
}

export default App;
