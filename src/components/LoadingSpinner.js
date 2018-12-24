import React, { Component } from 'react'

export default class LoadingSpinner extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if(this.props.display) {
      return <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    }
    else {
      return <div className="lds-roller"></div>
    }
  }
}
