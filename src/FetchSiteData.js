import React, { Component } from 'react';

export default class FetchSiteData extends Component {
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
        name: data.name
      });
    });
  }

  render() {
    return (
      <div>{this.state.name}</div>
    );
  }
}
