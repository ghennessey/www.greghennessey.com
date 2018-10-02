import React, { Component } from 'react'
import Menu from '../components/Menu.js'

export default class HamburgerMenu extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      open: false,
      displayState: {
        true: 'visible',
        false: 'hidden'
      }
    };
  }

  handleClick(e) {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    return(
      <div className="HamburgerMenu">
        <div className='fs-blackout' style={{visibility: this.state.displayState[this.state.open]}}></div>
        <div className="open" style={{visibility: this.state.displayState[this.state.open]}}>
          <Menu />
        </div>
        <button className="hburger" onClick={this.handleClick}>
          <div className="upper-line"></div>
          <div className="mid-line"></div>
          <div className="lower-line"></div>
        </button>
      </div>

    );
  }
}
