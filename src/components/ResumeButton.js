import React, { Component } from 'react'

export default class ResumeButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="resume-button">
        <button>Download Resume</button>
      </div>
    )
  }
}
