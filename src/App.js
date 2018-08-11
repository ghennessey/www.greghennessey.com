import React, { Component } from 'react'
import './App.css'
import Home from './pages/Home.js'

//REMOVE - Just leaving this here so I can see how they imported an SVG
//import logo from './logo.svg';

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
