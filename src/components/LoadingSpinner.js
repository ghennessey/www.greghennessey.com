import React, { Component } from 'react'

export default class LoadingSpinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  }
}
