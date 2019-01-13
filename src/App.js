import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from './pages/Home.js'
import About from './pages/About.js'
import BlogPage from './pages/BlogPage.js'
import {BlogPostModal, BlogPostNoModal} from './pages/BlogPost.js'

import LoadingSpinner from './components/LoadingSpinner.js'

import './styles/App.css'
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

class DebugRouter extends Router {
  constructor(props){
    super(props);
    console.log('initial history is: ', JSON.stringify(this.history, null,2))
    this.history.listen((location, action, match)=>{
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      )
      console.log(`The last navigation action was ${action}`, JSON.stringify(this.history, null,2));
    });
  }

  componentDidUpdate() {
    console.log('<DebugRouter> UPDATED with these props: ', this.props);
  }
}

const Error = () => {
  return <div><h1 style={{color: 'white', fontSize: "100px"}}>404</h1></div>
}

class ReRoute extends Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    let { pathname } = this.props.history.location;
    let { history } = this.props;

    console.log('<BlogReRoute> pathname: ', pathname);
    let slug = pathname.slice(1, pathname.length);
    console.log('<BlogReRoute> slug: ', slug);

    //1. look through posts and check if this is a valid post
    let postAPI = API.base + API.posts.base + API.posts.query + slug;
    const post_data = await(await(fetch(postAPI))).json();
    console.log('post_data: ', post_data[0].type);

    if(post_data[0].type === "post") {
      let updatedURL = '/blog' + pathname;

      history.push({
        pathname: updatedURL,
      });
    }
  }

  render() {

    let { pathname } = this.props.location;

    return(
      <div className='reroute' style={{backgroundImage: `url(${BGImage})`}}>
        <h1 style={{color: 'blue', fontSize: '100px'}}>BLOG REROUTE</h1>
        <h2 style={{color: 'white', fontSize: '30px'}}>Attempting to find reroute of: { pathname }</h2>
        <div className='loader'>
          <LoadingSpinner display={true} />
        </div>
      </div>
    );
  }
}


export default class App extends Component {

  constructor(props) {
    super(props);
    console.log('App is building');
  }


  render() {
    return (
      <div className="App">
        <header>
        </header>
        <DebugRouter>
          <Fragment>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/about" component={About} />
              <Route path="/blog" component={BlogRouting} />
              <Route path="/:pageID" component={ReRoute} />
              <Route component={Error} />
            </Switch>
          </Fragment>
        </DebugRouter>
      </div>
    );
  }
}
