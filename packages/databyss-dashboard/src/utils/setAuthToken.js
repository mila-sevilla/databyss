import axios from 'axios'

console.log(process.env)
axios.defaults.baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'https://thawing-mountain-34862.herokuapp.com'

const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token
  } else {
    delete axios.defaults.headers.common['x-auth-token']
  }
}

export default setAuthToken
