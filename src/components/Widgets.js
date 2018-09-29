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

  return (
    <div className='logo-mark'>
      <img className="logo" alt='Logo' src={logo} />
      <h1>{title}</h1>
    </div>
  )
}

export default LogoMark;
