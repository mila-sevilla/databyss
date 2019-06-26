import axios from 'axios'
import { setAlert } from './alert'
import {
  GET_AUTHORS,
  AUTHOR_ERROR,
  DELETE_AUTHOR,
  ADD_AUTHOR,
  GET_AUTHOR,
  RECEIVE_AUTHORS,
} from './types'

// Get entries
export const getAuthors = () => async dispatch => {
  try {
    dispatch({
      type: GET_AUTHORS,
    })

    const res = await axios.get('/api/authors')
    let authors = res.data
    /*
    getAuthor(entries).then(data => {
      getSources(data).then(d => {
        dispatch({ type: RECEIVE_ENTRIES, payload: d })
      })
    })
*/
    dispatch({
      type: RECEIVE_AUTHORS,
      payload: authors,
    })
  } catch (err) {
    console.log(err)
    dispatch({
      type: AUTHOR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// Delete post
export const deleteAuthor = id => async dispatch => {
  try {
    await axios.delete(`/api/posts/${id}`)

    dispatch({
      type: DELETE_AUTHOR,
      payload: id,
    })

    dispatch(setAlert('Author Removed', 'success'))
  } catch (err) {
    dispatch({
      type: AUTHOR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// Add post
export const addAuthor = formData => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  console.log(formData)

  try {
    const res = await axios.post('/api/authors', formData, config)

    dispatch({
      type: ADD_AUTHOR,
      payload: res.data,
    })

    dispatch(setAlert('Author Created', 'success'))
  } catch (err) {
    console.log(err)
    dispatch({
      type: AUTHOR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// Get post
export const getAuthor = id => async dispatch => {
  try {
    const res = await axios.get(`/api/authors/${id}`)

    dispatch({
      type: GET_AUTHOR,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: AUTHOR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

//RETURNS A PROMISE TO GET ALL AUTHORS

export const getAuthorList = entries => {
  const promises = entries.map(async e => {
    const entryRes = await axios.get(`/api/authors/${e}`)
    return entryRes.data
  })
  return Promise.all(promises)
}

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
