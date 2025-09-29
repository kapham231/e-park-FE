import React from 'react'
import './css/default-button.css'

const DefaultButton = ({ children, type, size, ...attr }) => {
  return (
    <button {...attr} className={`default-button default-button-${type} default-button-${size}`}>
      <span className='shadow'></span>
      <span className='edge'></span>
      <span className='front text'>{children}</span>
    </button>
  )
}

export default DefaultButton
