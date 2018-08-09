import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

var WPAPI = require( 'wpapi' );
var wp = new WPAPI({ endpoint: 'http://www.greghennessey.com/wp-json' });

var PAGE_DATA = {
  PAGE_TITLE: ''
}


wp.pages().get(function( err, data ) {
    if ( err ) {
      return console.log("Cannot find the page you're looking for");
    }
    PAGE_DATA.PAGE_TITLE = data[0].title.rendered;
    console.log("Page title is " + PAGE_DATA.PAGE_TITLE);
});


class App extends Component {

  constructor() {
    super();
    this.state = {
      pageTitle: ''
    };
  }

  componentDidMount() {

    fetch('http://www.greghennessey.com/wp-json')
    .then(results => {
      return results.json();
    }).then(data => {
      console.log(data);
      this.setState({
        pageTitle: data.name
      });
    });

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
