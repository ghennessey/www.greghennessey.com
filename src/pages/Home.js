import React, { Component } from 'react'
import { connect } from 'react-redux'
import Menu from '../components/Menu.js'
//import ResumeButton from '../components/ResumeButton.js'
import convertStringToHTML from '../components/Helpers.js'

import LogoMark from '../components/LogoMark.js'

import { startHomePageFetch } from '../store/actions/homePageActions'

class Home extends Component {

  componentWillMount() {
    const { homePageInitialized } = this.props.home;
    if(!homePageInitialized) {
      this.props.startHomePageFetch();
    }
  }

  render() {
    const { pageHeader, backgroundImage, pageContent } = this.props.home.data;
  
    return (
      <div className="container-fluid page-home background-cover" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="container d-flex h-100 flex-column">
          
          <div className="fsBlackout"></div>

          {/* Top Row */}
          <div className="row">
            {/* Logo */}
            <div className="col-12 text-center text-white pt-5">
              <LogoMark title={pageHeader} className="vertical"/>
            </div>
            {/* Menu */}
            <div className="col-12 d-flex justify-content-center g-text-shadow-2">
              <Menu />
            </div>
          </div>

          {/* Content Row */}
          <div className="row flex-grow-1 align-items-center justify-content-center">
              <div className="col text-center home-content g-text-shadow-1">
                {convertStringToHTML(pageContent)}
              </div>
          </div>

          {/* <ResumeButton /> */}
        </div>       
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    home: state.home,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startHomePageFetch: () => dispatch(startHomePageFetch()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)