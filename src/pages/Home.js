import React, { Component } from 'react'

const SLUG_HOME = 'home-page'

//Home Page component
//Later I want to break this down into a component specifically for home
//and a component for Pages that Home extends
class Home extends Component {

  constructor() {
    super();
    this.state = {
      title: '',
      pageData: [],
    };
  }

  getPageData() {
    fetch('http://www.greghennessey.com/wp-json/wp/v2/pages/?home-page')
      .then(results => results.json())
      .then(data => {
        for (var i = 0; i < data.length; i++) {
          if(data[i].slug === SLUG_HOME) {
            this.setState({
              pageData: data[i],
              title: data[i].title.rendered
            });
            return;
          }
        }
      });
  }

  componentDidMount() {
    this.getPageData();
  }

  render() {
    return (
      <div className="Home">
        <h1>{this.state.title}</h1>
      </div>
    )
  }
}


export default Home
