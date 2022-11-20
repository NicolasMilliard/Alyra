import React from 'react'

const ButtonLoader = ({ aspect }) => {
  return (
    // Aspect determine if the button is full rounded or half rounded
    <button className={`${aspect}`}>
        <span className='flex flex-center'>
            <span className='spin-loader'></span>
            Loading...
        </span>
    </button>
  )
}

export default ButtonLoader