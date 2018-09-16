import React, { Component } from 'react'

function Menu(props) {
  const isOpen = props.open;
  if(isOpen) {
    return <OpenMenu />
  }
  else {
    return ""
  }
}

function OpenMenu(props) {
  return (
    <div className='fs-blackout'></div>
  )
}

export default class HamburgerMenu extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      open: false,
    };
  }

  handleClick(e) {
    console.log('handling click');
    this.setState({
      open: !this.state.open
    });
    console.log(this.state.open);
  }

  onComponentDidMount() {
  }

  render() {
    return(
      <div className="HamburgerMenu">
        <button className="hburger" onClick={this.handleClick}>
          <div className="upper-line"></div>
          <div className="mid-line"></div>
          <div className="lower-line"></div>
        </button>
        <Menu open={this.state.open}/>
        <div className="open">
          {this.props.children}
        </div>
      </div>

    );
  }
}
