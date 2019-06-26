import axios from 'axios'
import { setAlert } from './alert'
import {
  GET_ENTRIES,
  ENTRY_ERROR,
  DELETE_ENTRY,
  ADD_ENTRY,
  GET_ENTRY,
  RECEIVE_ENTRIES,
} from './types'

// Get entries
export const getEntries = () => async dispatch => {
  try {
    const res = await axios.get('/api/entries')
    let entries = res.data

    getAuthor(entries).then(data => {
      getSources(data).then(d => {
        dispatch({ type: RECEIVE_ENTRIES, payload: d })
      })
    })

    dispatch({
      type: GET_ENTRIES,
    })
  } catch (err) {
    console.log(err)
    dispatch({
      type: ENTRY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// Delete post
export const deleteEntry = id => async dispatch => {
  try {
    await axios.delete(`/api/posts/${id}`)

    dispatch({
      type: DELETE_ENTRY,
      payload: id,
    })

    dispatch(setAlert('Entry Removed', 'success'))
  } catch (err) {
    dispatch({
      type: ENTRY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// Add post
export const addEntry = formData => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = await axios.post('/api/entries', formData, config)

    dispatch({
      type: ADD_ENTRY,
      payload: res.data,
    })
    dispatch(getEntries())
    dispatch(setAlert('Entry Created', 'success'))
  } catch (err) {
    console.log(err)
    dispatch({
      type: ENTRY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// Get post
export const getEntry = id => async dispatch => {
  try {
    const res = await axios.get(`/api/entries/${id}`)

    dispatch({
      type: GET_ENTRY,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: ENTRY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

//RETURNS A PROMISE TO GET ALL AUTHORS
const getAuthor = entry => {
  const promises = entry.map(async e => {
    const list = e.author.map(async a => {
      const res = await axios.get(`/api/authors/${a}`)
      return {
        ...e,
        author: res.data,
      }
    })
    return {
      ...e,
      author: list,
    }
  })
  return Promise.all(promises)
}

// Returns a promies to get all sources
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
