import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import { ModalContainer, ModalRoute } from 'react-router-modal'

import Home from './pages/Home.js'
import About from './pages/About.js'
import BlogPage from './pages/BlogPage.js'
import BlogPost from './pages/BlogPost.js'
import {BlogPostModal} from './pages/BlogPost.js'

import './styles/App.css'

//TODO - Just leaving this here so I can see how they imported an SVG
//import logo from './logo.svg';


class BlogRouting extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //If we are directed to "/blog" as a path, show the <BlogPage>
    let { history, location, match } = this.props;
    console.log('<BlogRouting> MOUNTED');
    console.log('history: ', history);
    console.log('location: ', location);
    console.log('match: ', match);

    //If there is no query param, let's set one
    //&& there is no further sub routing ie. '/blog/123'
    if(!location.search &&
      location.pathname === match.path ||
      location.pathname === match.path + '/') {
      this.updateQueryString();
    }
  }

  componentDidUpdate(prevProps) {
    // console.log('\n<BlogRouting> UPDATED');
    // let { history, location, match } = this.props;
    // console.log('history: ', history);
    // console.log('location: ', location);
    // console.log('match: ', match);
  }

  updateQueryString = (queryID) => {
    const { history, match } = this.props;
    const string = 'page=' + (queryID ? queryID : 1)

    history.push({
      pathname: match.path,
      search: string
    });
  }

  returnPostComponent = (isModal) => {
    console.log('???isModal: ' + isModal);
    return isModal ? <BlogPostModal {...this.props} /> : <BlogPost {...this.props} />
  }

  render() {
    //Check if I have passed 'modal=true' into the Link. If it doesn't exist, then this is not a Modal
    //and it will render separately from the main blog page
    let { state } = this.props.location;
    let isModal = !!( state && state.modal )

    return(
      <Fragment>
        <Route
          exact={!isModal}
          path="/blog"
          render={() => (
            <BlogPage
              {...this.props}
              updateQueryString={this.updateQueryString}
              updateBlogSlug={this.updateBlogSlug}
            />
          )}
        />
        {isModal ?
          (<Route path='/blog/:blogID' render={() => <BlogPostModal {...this.props} />} />) :
          (<Route path='/blog/:blogID' render={() => <BlogPost {...this.props} />} />)}
      </Fragment>
    );
  }
}

export default class App extends Component {
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
              <Route path="/blog" component={BlogRouting} />
            </Switch>
          </Fragment>
        </Router>
      </div>
    );
  }
}
