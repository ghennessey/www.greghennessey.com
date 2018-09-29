import React, { Component } from 'react'

function LoaderAnimation () {
  return (
    <div className="loader-wrapper">
      <div className="Loader"></div>
    </div>
  )
}

function LogoMark(props) {

  let title = props.title;
  let logo = props.logo;

  //Is this a centered style logo mark or horizontal? For instance home uses
  //centered and About uses horizontal

  let style = props.style;



  return (
    <div className={'logo-mark ' + style}>
      <img className={'logo ' + style} alt='Logo' src={logo} />
      <h1>{title}</h1>
    </div>
  )
}

export default LogoMark;
