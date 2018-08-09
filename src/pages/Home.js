import React, { Component } from 'react'

class Home extends Component {

  constructor() {
    super();
    this.state = {
      pageData: [],
    };
  }

  componentDidMount() {
    this.setState({
      pageData: this.props.pageData[0]
    });
  }

  render() {
    console.log(this.state.pageData);
    return(
      <div>
        <h1>{}</h1>
      </div>
    )
  }

}

export default Home
