import React, { Component } from 'react'
import { connect } from 'react-redux'

import Menu from '../components/Menu.js'

import { openHamburgerMenu, closeHamburgerMenu } from '../store/actions/menuActions'

const MenuOpen = () => {
  return(
    <div className='menu-open'>
      <Menu vertical />
    </div>
  )
}

class HamburgerMenu extends Component {
  handleClick = () => {
    if(!this.props.menu.ui.hamburgerOpen) {
      this.props.openHamburgerMenu();
    } else {
      this.props.closeHamburgerMenu();
    }
  }

  componentWillUnmount() {
    //In the case the hamburger menu is open, let's close it
    this.props.closeHamburgerMenu();
  }

  render() {

    const open = this.props.menu.ui.hamburgerOpen;

    return(
      <div className="HamburgerMenu">
        { open ? <div className='fs-blackout'></div> : null }
        { open ? <MenuOpen /> : null }
        <button className="btn" onClick={this.handleClick}>
          <i className="fas fa-bars"></i>
        </button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    menu: state.menu
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openHamburgerMenu: () => dispatch(openHamburgerMenu()),
    closeHamburgerMenu: () => dispatch(closeHamburgerMenu()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HamburgerMenu)