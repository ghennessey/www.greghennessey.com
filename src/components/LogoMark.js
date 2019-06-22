import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getLogo } from '../store/actions/siteActions'

import Logo from '../assets/gh_logo_white.svg'

class LogoMark extends Component {

    componentWillMount() {
        if(!this.props.site.data.logo) {
            this.props.getLogo();
        }
    }

    render() {
        const { logoText } = this.props.site.data;

        return (
            <div className={'logo-mark g-text-glow-with-shadow ' + this.props.className}>
                <img className='logo' alt="Logo" src={ Logo } />
                <h1>{ logoText }</h1>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        site: state.site,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getLogo: () => dispatch(getLogo())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoMark)