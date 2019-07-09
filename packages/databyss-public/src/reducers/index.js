import { combineReducers } from 'redux'
import alert from './alert'
import auth from './auth'
import profile from './profile'
import entry from './entry'
import author from './author'
import source from './source'
import counter from './counter'

export default combineReducers({
  alert,
  auth,
  profile,
  entry,
  author,
  source,
  counter
})
