import React from 'react'
import useReactRouter from 'use-react-router'

const BackButton = () => {
  const { history } = useReactRouter()
  return (
    <button onClick={() => history.goBack()} className="btn dash-buttons p-1">
      <p> Back </p>
    </button>
  )
}

export default BackButton
