import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from './pages/Home.js'
import About from './pages/About.js'
import BlogPage from './pages/Blog/BlogPage.js'
import { BlogPostModal, BlogPostNoModal } from './pages/Blog/BlogPost.js'

import LoadingSpinner from './components/LoadingSpinner.js'
import Menu from './components/Menu.js'

import './css/styles.css'

import BGImage from './assets/bgimage.jpg'

const API = {
  base: 'http://www.greghennessey.com/',
  pages: {
    base: 'wp-json/wp/v2/pages',
    about: 21,
    blog: 87,
    home: 10,
  },
  posts: {
    base: 'wp-json/wp/v2/posts',
    query: '?slug='
  }
}

class BlogRouting extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isModal: false
    }
  }

  componentDidMount() {
    //If we are directed to "/blog" as a path, show the <BlogPage>
    let { history, location, match } = this.props;

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
    const string = 'page=' + (queryID ? queryID : 1);

    console.log('Updating Query String');

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

    return(
      <Fragment>
        <Route exact={!isModal} path="/blog" render={() => (
            <BlogPage
              {...this.props}
              updateQueryString={this.updateQueryString}
              updateBlogSlug={this.updateBlogSlug}
            />
          )}
        />
        <Route path='/blog/:blogID' render={
          () => isModal ? <BlogPostModal {...this.props} /> : <BlogPostNoModal {...this.props} />
        }/>
      </Fragment>
    );
  }
}

const Error = () => {
  return (
    <div className='error404' style={{backgroundImage: `url(${BGImage})`}}>
      <div className='error-message'>
        <h1>404</h1>
        <h2>Page not found...</h2>
        <p>Choose your path, weary traveller</p>
        <Menu />
      </div>
    </div>
  )
}

class ReRoute extends Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    let { pathname } = this.props.history.location;
    let { history } = this.props;
    let slug = pathname.slice(1, pathname.length);

    //1. look through posts and check if this is a valid post
    //1.1 I'm going to fetch post data here
    let postAPI = API.base + API.posts.base + API.posts.query + slug;
    const post_data = await(await(fetch(postAPI))).json();

    //1.2 Then I check if it's valid data ie. it matches a "post" type in the data structure
    if(post_data[0] && post_data[0].type === "post") {
      let updatedURL = '/blog' + pathname;
      history.push({
        pathname: updatedURL,
      });
    } else {
      history.push({
        pathname: '/404',
      });
    }
  }

  render() {

    let { pathname } = this.props.location;

    return(
      <div className='reroute' style={{backgroundImage: `url(${BGImage})`}}>
        <div className='loader'>
          <LoadingSpinner display={true} />
        </div>
      </div>
    );
  }
}


class App extends Component {
  render() {
    return (
      <div className="App h-100 d-flex flex-grow-1">
        <header>
        </header>
        <Router>
          <Fragment>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/about" component={About} />
              <Route path="/blog" component={BlogRouting} />
              <Route path="/:pageID" component={ReRoute} />
              <Route component={Error} />
            </Switch>
          </Fragment>
        </Router>
      </div>
    );
  }
}

export default App