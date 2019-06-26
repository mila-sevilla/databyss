import axios from 'axios'
import { setAlert } from './alert'
import {
  GET_SOURCES,
  SOURCE_ERROR,
  DELETE_SOURCE,
  ADD_SOURCE,
  GET_SOURCE,
  RECEIVE_SOURCES,
} from './types'

// Get entries
export const getSources = () => async dispatch => {
  try {
    dispatch({
      type: GET_SOURCES,
    })

    const res = await axios.get('/api/sources')
    let sources = res.data
    /*
    getAuthor(entries).then(data => {
      getSources(data).then(d => {
        dispatch({ type: RECEIVE_ENTRIES, payload: d })
      })
    })
*/
    dispatch({
      type: RECEIVE_SOURCES,
      payload: sources,
    })
  } catch (err) {
    console.log(err)
    dispatch({
      type: SOURCE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// Delete post
export const deleteSource = id => async dispatch => {
  try {
    await axios.delete(`/api/posts/${id}`)

    dispatch({
      type: DELETE_SOURCE,
      payload: id,
    })

    dispatch(setAlert('Source Removed', 'success'))
  } catch (err) {
    dispatch({
      type: SOURCE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// Add post
export const addSource = formData => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = await axios.post('/api/sources', formData, config)

    dispatch({
      type: ADD_SOURCE,
      payload: res.data,
    })

    dispatch(setAlert('Source Created', 'success'))
  } catch (err) {
    console.log(err)
    dispatch({
      type: SOURCE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// Get post
export const getSource = id => async dispatch => {
  try {
    const res = await axios.get(`/api/sources/${id}`)

    dispatch({
      type: GET_SOURCE,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: SOURCE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

//RETURNS A PROMISE TO GET ALL AUTHORS
/*
const getAuthor = entry => {
  const promises = entry.map(async e => {
    const entryRes = await axios.get(`/api/authors/${e.author}`)
    return {
      ...e,
      author: entryRes.data,
    }
  })
  return Promise.all(promises)
}
*/

// Returns a promies to get all sources

/*
const getSources = entry => {
  const promises = entry.map(async e => {
    const entryRes = await axios.get(`/api/sources/${e.source}`)
    return {
      ...e,
      source: entryRes.data,
    }
  })
  return Promise.all(promises)
}
*/
