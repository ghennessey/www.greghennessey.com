import $ from "jquery";
import React, { Component } from 'react'

export default class ImgFadeInOnLoad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    }
  }
  fadeInOnLoad(e) {
    $(e.target).animate({'opacity': '1'});
  }
  render() {
    return <img
      className={this.props.className}
      src={this.props.src}
      onLoad={this.fadeInOnLoad}
      style={{'opacity': '0'}}
      alt=""
     />
  }
}
