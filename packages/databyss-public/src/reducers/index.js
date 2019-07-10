import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
//import { history } from './../store'

import alert from './alert'
import auth from './auth'
import profile from './profile'
import entry from './entry'
import author from './author'
import source from './source'
import counter from './counter'

export default history =>
  combineReducers({
    router: connectRouter(history),
    alert,
    auth,
    profile,
    entry,
    author,
    source,
    counter
    // router: connectRouter(history)
  })
