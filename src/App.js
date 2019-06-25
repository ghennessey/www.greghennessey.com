import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from './pages/Home.js'
import About from './pages/About.js'
import BlogPage from './pages/Blog/BlogPage.js'
import BlogPost from './pages/Blog/BlogPost.js'

import Menu from './components/Menu.js'

import './css/styles.css'

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

const ErrorComponent = () => {
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

class App extends Component {
  render() {
    return (
      <div className="App h-100 d-flex flex-grow-1">
        <header>
        </header>
        <Router>
            <Switch>
              <Route path="/about" component={About} />
              <Route exact path="/blog/:blogSlug" component={BlogPost} />
              <Route exact path="/blog" component={BlogPage} />
              <Route path="/:blogSlug" component={BlogPost} />
              <Route path="/" component={Home} />
              <Route path="/404" component={ErrorComponent} />
              <Route component={ErrorComponent} />
            </Switch>
        </Router>
      </div>
    );
  }
}

export default App