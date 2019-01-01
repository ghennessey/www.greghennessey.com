import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import { ModalContainer, ModalRoute } from 'react-router-modal'

import Home from './pages/Home.js'
import About from './pages/About.js'
import BlogPage from './pages/BlogPage.js'
import BlogPost from './pages/BlogPost.js'

import './styles/App.css'

//TODO - Just leaving this here so I can see how they imported an SVG
//import logo from './logo.svg';

class BlogRouting2 extends Component {
  previousLocation = this.props.location;

  componentWillUpdate(nextProps) {
    let { location } = this.props;

    if(
      nextProps.history.action !== "POP" &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location
    }
  }

  render() {
    let { location } = this.props;

    let isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ); // not initial render

    return (
      console.log('isModal? :' + isModal),
      <div>
        <Switch location={isModal ? this.previousLocation : location}>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route path="/blog" render={() => (
            console.log('Rendering <BlogBase>'),
            <BlogBase />
          )} />
          <Route path="/blog/:postID" render={() => (
            console.log('Rendering <BlogModal> without modal'),
            <BlogModal />
          )} />
        </Switch>
        {isModal ? <Route path="/blog/:postID" render={() => (
          console.log('Rendering <BlogModal> as a modal'),
          <BlogModal />
        )} /> : null}
      </div>
    );
  }
}

function BlogBase({match, history}) {
  return(
    <div>
      <h1 style={{color: 'white', fontSize: '40px'}}>BlogBase</h1>
      <ul style={{paddingTop: '20px'}}>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to={{pathname: '/blog/123', state: {modal: true}}}>Specific Post w Modal</Link></li>
        <li><Link to={{pathname: '/blog/123', state: {modal: false}}}>Specific Post NO Modal</Link></li>
      </ul>
    </div>
  );
}

function BlogModal({ match, history }) {
  return(
    console.log('Rendering <BlogModal>'),
    <div style={{backgroundColor: 'white', marginTop: '50px'}}>
      <h2 style={{color: 'blue', fontSize: '28px'}}>BlogModal Post</h2>
    </div>
  );
}

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
      history.push(match.path + '?page=1');
    }
  }

  componentDidUpdate(prevProps) {
    console.log('\nComponent Updated');
    console.log(this.props);
  }

  render() {
    //Check if I have passed 'modal=true' into the Link. If it doesn't exist, then this is not a Modal
    //and it will render separately from the main blog page
    let { state } = this.props.location;
    let isModal = !( state && state.modal );

    return(
      <div>
        <Route exact={isModal} path="/blog" component={BlogBase} />
        <Route path='/blog/:blogID' component={BlogModal} />
      </div>
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



// <Route exact path="/blog" render={({match, history}) =>
//   (console.log('Attempting to render Path 1'),
//   <BlogPage match={match} history={history} />)}
// />
// <Route path="/post/:postID" render={( {match, history} ) =>
//   (console.log('Attempting to render Path 2'),
//   <BlogPost match={match} history={history} /> )}
// />
