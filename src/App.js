import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import createBrowserHistory from 'history/createBrowserHistory'

import Home from './pages/Home.js'
import About from './pages/About.js'
import BlogPage from './pages/BlogPage.js'
import BlogPost from './components/BlogPost.js'

import './styles/App.css'

//TODO - Just leaving this here so I can see how they imported an SVG
//import logo from './logo.svg';

const customHistory = createBrowserHistory();
//
// const BlogPostRoute = ({ match }) => {
//   return <BlogPost postSlug={match.params.post_slug} history={customHistory} />
// }
//
// const BlogRoute = ({history}) => {
//   console.log('<----- BlogRoute ----->');
//   console.log(history.location.pathname);
//   return <div></div>
// }

//This is the main rendering component for my App and basic structure of the site
//It all starts here
export default class App extends Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        <header>
        </header>
        <Router>
          <Fragment>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/about" component={About} />
              <Route exact path="/blog" render={({match, history}) =>
                <BlogPage match={match} history={history} />} />
            </Switch>
          </Fragment>
        </Router>
      </div>
    );
  }
}

// <Route exact path='/blog' render={({match, history}) => (
//   history.location.search === "" ? (<Redirect to={`${match.url}?page=1`} />) :
//     (<BlogPage {...match} {...history} />)
// )} />

// <Route exact strict path="/blog" render={ ({match, history}) => (
//   match.url === '/blog/' || match.url === '/blog' ? (
//     console.log(match),
//     <Redirect to={`${match.path}?page=1`} />
//   ) : (
//     <BlogPage query={history.location.search} />
//   )
// )} />
// <Route path="/blog/:post" component={BlogPost} />
