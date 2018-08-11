import React, { Component } from 'react'
import './App.css'
import Home from './pages/Home.js'

//REMOVE - Just leaving this here so I can see how they imported an SVG
//import logo from './logo.svg';

const API = "http://www.greghennessey.com/wp-json"
const PAGES = "/wp/v2/pages/?"

//This is the main rendering component for my App and basic structure of the site
//It all starts here
class App extends Component {

  constructor() {
    super();
    this.state = {
      hits: []
    };
  }

  componentDidMount() {
    //Asyncronously get data and set the results
    // fetch(API + PAGES)
    //   .then(results => results.json())
    //   .then(data => {
    //     //Grab the site JSON data and store it in a state for future use
    //     console.log(data);
    //     this.setState({hits: data});
    //   });
  }

  render() {
    return (
      <div className="App">
        <header></header>
        <Home />
      </div>
    );
  }
}

export default App;
