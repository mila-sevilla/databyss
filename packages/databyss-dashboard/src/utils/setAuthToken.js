import axios from 'axios'

axios.defaults.baseURL = 'https://thawing-mountain-34862.herokuapp.com'

const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token
  } else {
    delete axios.defaults.headers.common['x-auth-token']
  }
}

export default setAuthToken
