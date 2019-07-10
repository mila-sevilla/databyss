import React, { useEffect } from 'react'
import { Route, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Home from '../home'
import About from '../about'
import { loadUser, login } from './../../actions/auth'
import setAuthToken from './../../utils/setAuthToken'

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(login())
    dispatch(loadUser())
  }, [])
  return (
    <div>
      <header>
        <Link to="/">Home</Link>
        <Link to="/about-us">About</Link>
      </header>

      <main>
        <Route exact path="/" component={Home} />
        <Route exact path="/about-us" component={About} />
      </main>
    </div>
  )
}

export default App
