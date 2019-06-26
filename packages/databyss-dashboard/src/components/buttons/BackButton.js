import React from 'react'
import useReactRouter from 'use-react-router'

const BackButton = () => {
  const { history } = useReactRouter()
  return (
    <button onClick={() => history.goBack()} className='btn'>
      Back
    </button>
  )
}

export default BackButton
