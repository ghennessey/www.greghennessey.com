import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from './pages/Home.js'
import About from './pages/About.js'
import BlogPage from './pages/Blog/BlogPage.js'
import BlogPost from './pages/Blog/BlogPost.js'

import LoadingSpinner from './components/LoadingSpinner.js'
import Menu from './components/Menu.js'

import './css/styles.css'

import BGImage from './assets/bgimage.jpg'

// const API = {
//   base: 'http://www.greghennessey.com/',
//   pages: {
//     base: 'wp-json/wp/v2/pages',
//     about: 21,
//     blog: 87,
//     home: 10,
//   },
//   posts: {
//     base: 'wp-json/wp/v2/posts',
//     query: '?slug='
//   }
// }

const Error = () => {
  return (
    <div className='error container d-flex flex-grow-1'>
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
    // let { pathname } = this.props.history.location;
    // let { history } = this.props;
    // let slug = pathname.slice(1, pathname.length);

    // //1. look through posts and check if this is a valid post
    // //1.1 I'm going to fetch post data here
    // let postAPI = API.base + API.posts.base + API.posts.query + slug;
    // const post_data = await(await(fetch(postAPI))).json();

    // //1.2 Then I check if it's valid data ie. it matches a "post" type in the data structure
    // if(post_data[0] && post_data[0].type === "post") {
    //   let updatedURL = '/blog' + pathname;
    //   history.push({
    //     pathname: updatedURL,
    //   });
    // } else {
    //   history.push({
    //     pathname: '/404',
    //   });
    // }
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
              <Route path="/about" component={About} />
              <Route exact path="/blog/:blogSlug" component={BlogPost} />
              <Route exact path="/blog" component={BlogPage} />
              <Route path="/:pageID" component={ReRoute} />
              <Route path="/404" component={Error} />
              <Route path="/" component={Home} />
              <Route component={Error} />
            </Switch>
          </Fragment>
        </Router>
      </div>
    );
  }
}

export default App