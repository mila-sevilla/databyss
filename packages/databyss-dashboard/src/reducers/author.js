import {
  GET_AUTHORS,
  AUTHOR_ERROR,
  DELETE_AUTHOR,
  ADD_AUTHOR,
  GET_AUTHOR,
  RECEIVE_AUTHORS,
} from '../actions/types'

const initialState = {
  authors: [],
  author: null,
  loading: true,
  error: {},
}

export default function(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case GET_AUTHORS:
      return {
        ...state,
        loading: true,
      }
    case RECEIVE_AUTHORS:
      return {
        ...state,
        authors: payload,
        loading: false,
      }
    case GET_AUTHOR:
      return {
        ...state,
        author: payload,
        loading: false,
      }
    case ADD_AUTHOR:
      return {
        ...state,
        authors: [payload, ...state.authors],
        loading: false,
      }
    case DELETE_AUTHOR:
      return {
        ...state,
        authors: state.authors.filter(author => author._id !== payload),
        loading: false,
      }
    case AUTHOR_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      }

    default:
      return state
  }
}
