import React, { Component } from 'react'
import './styles/App.css'
import Home from './pages/Home.js'

//REMOVE - Just leaving this here so I can see how they imported an SVG
//import logo from './logo.svg';

//This is the main rendering component for my App and basic structure of the site
//It all starts here
class App extends Component {

  constructor() {
    super();
    this.state = {
      page_home: {
        component: <Home/>,
        url: 'home-page',
      },
      page_about: {
        component:<Home/>,
        url: 'home-page',
      },
      currentPage: null
    };
  }

  componentWillMount() {
    //When we start up, if the currentPage is not yet set (because it's the first visit)
    //set the page to the home page.
    if(!this.state.currentPage) {
      this.setState({currentPage: this.state.page_home});
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="App">
        <header>
        </header>
        {this.state.currentPage.component}
      </div>
    );
  }
}

export default App;
