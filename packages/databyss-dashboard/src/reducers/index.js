import { combineReducers } from 'redux'
import alert from './alert'
import auth from './auth'
import profile from './profile'
import entry from './entry'
import author from './author'
import source from './source'

export default combineReducers({
  alert,
  auth,
  profile,
  entry,
  author,
  source,
})
