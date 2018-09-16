import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Home from './pages/Home.js'
import About from './pages/About.js'
import Menu from './components/Menu.js'

import './styles/App.css'

//TODO - Just leaving this here so I can see how they imported an SVG
//import logo from './logo.svg';

//This is the main rendering component for my App and basic structure of the site
//It all starts here
export default class App extends Component {

  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <Router>

        <div className="App">
          <header>
          </header>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
        </div>
      </Router>
    );
  }
}
