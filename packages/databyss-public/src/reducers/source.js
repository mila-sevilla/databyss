import {
  GET_SOURCES,
  SOURCE_ERROR,
  DELETE_SOURCE,
  ADD_SOURCE,
  GET_SOURCE,
  RECEIVE_SOURCES,
} from '../actions/types'

const initialState = {
  sources: [],
  source: null,
  loading: true,
  error: {},
}

export default function(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case GET_SOURCES:
      return {
        ...state,
        loading: true,
      }
    case RECEIVE_SOURCES:
      return {
        ...state,
        sources: payload,
        loading: false,
      }
    case GET_SOURCE:
      return {
        ...state,
        source: payload,
        loading: false,
      }
    case ADD_SOURCE:
      return {
        ...state,
        sources: [payload, ...state.sources],
        loading: false,
      }
    case DELETE_SOURCE:
      return {
        ...state,
        sources: state.sources.filter(sources => sources._id !== payload),
        loading: false,
      }
    case SOURCE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      }

    default:
      return state
  }
}
