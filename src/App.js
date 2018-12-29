import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import createBrowserHistory from 'history/createBrowserHistory'
import { ModalContainer, ModalRoute } from 'react-router-modal'

import Home from './pages/Home.js'
import About from './pages/About.js'
import BlogPage from './pages/BlogPage.js'
import BlogPost from './pages/BlogPost.js'

import './styles/App.css'
import 'react-router-modal/css/react-router-modal.css'

//TODO - Just leaving this here so I can see how they imported an SVG
//import logo from './logo.svg';

const customHistory = createBrowserHistory();

export default class App extends Component {

  //previousLocation = this.props.location;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate() {
    console.log(this.props);
  }

  render() {
    return (
      <div className="App">
        <header>
        </header>
        <Router>
          <Fragment>
            <ModalContainer />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/about" component={About} />
              <Route path="/blog" render={({match, history}) =>
                <BlogPage match={match} history={history} />}
              />
              <Route path="/blog/post/:postID" render={( {match, history} ) =>
                <BlogPost match={match} history={history} /> }
              />
            </Switch>
          </Fragment>
        </Router>
      </div>
    );
  }
}
