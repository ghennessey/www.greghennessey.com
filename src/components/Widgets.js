import React from 'react'

export default function LogoMark(props) {

  let { title, logo, styleType } = props;

  if(!styleType) {
    styleType = 'horizontal'
  }

  return (
    <div className={'logo-mark ' + styleType}>
      <img className={'logo ' + styleType} src={ logo } />
      <h1>{ title }</h1>
    </div>
  )
}
