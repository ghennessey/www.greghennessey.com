import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from './pages/Home.js'
import About from './pages/About.js'
import BlogPage from './pages/BlogPage.js'
import {BlogPostModal, BlogPostNoModal} from './pages/BlogPost.js'

import './styles/App.css'
import './css/styles.css'

//TODO - Just leaving this here so I can see how they imported an SVG
//import logo from './logo.svg';


class BlogRouting extends Component {

  componentDidMount() {
    //If we are directed to "/blog" as a path, show the <BlogPage>
    let { history, location, match } = this.props;
    // console.log('<BlogRouting> MOUNTED');
    // console.log('history: ', history, 'location: ', location, 'match: ', match);

    //If there is no query param, let's set one
    //&& there is no further sub routing ie. '/blog/123'
    // eslint-disable-next-line
    if(!location.search && // eslint-disable-next-line
      location.pathname === match.path || // eslint-disable-next-line
      location.pathname === match.path + '/') {
      this.updateQueryString();
    }
  }

  updateQueryString = (queryID) => {
    const { history, match } = this.props;
    const string = 'page=' + (queryID ? queryID : 1)

    history.push({
      pathname: match.path,
      search: string
    });
  }

  render() {
    //Check if I have passed 'modal=true' into the Link. If it doesn't exist, then this is not a Modal
    //and it will render separately from the main blog page
    //actiom 'POP' is when the website is first loaded, not when a page is encountered when its browsed
    let { history } = this.props;
    let { state } = this.props.location;
    let isModal = !!( state && state.modal && history.action !== 'POP' );

    let blogRouteToRender;
    if(isModal) {
      console.log('Blog Route rendering as MODAL');
      blogRouteToRender = <Route path='/blog/:blogID' render={() => <BlogPostModal {...this.props} />} />;
    } else {
      console.log('Blog Route rendering as NO MODAL');
      blogRouteToRender = <Route path='/blog/:blogID' render={() => <BlogPostNoModal {...this.props} />} />;
    }

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
        {blogRouteToRender}
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

//          {isModal ? (<Route path='/blog/:blogID' render={() => <BlogPostModal {...this.props} />} />) : (<Route path='/blog/:blogID' render={() => <BlogPostNoModal {...this.props} />} />)}
