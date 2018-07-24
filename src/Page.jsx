import React, { Component } from 'react';

export default class Page extends Component {
  constructor() {
    super();
    this.state = {
      siteDescription: "",
    };
  };

  componentDidMount() {
    fetch('http://www.greghennessey.com/wp-json')
    .then(results => {
      return results.json();
    }).then(data => {
      this.setState({
        siteDescription: data.description
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.siteDescription}
      </div>
    );
  }
}
