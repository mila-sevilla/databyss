import {
  GET_ENTRIES,
  ENTRY_ERROR,
  DELETE_ENTRY,
  ADD_ENTRY,
  GET_ENTRY,
  RECEIVE_ENTRIES,
} from '../actions/types'

const initialState = {
  entries: [],
  entry: null,
  loading: true,
  error: {},
}

export default function(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case GET_ENTRIES:
      return {
        ...state,
        loading: true,
      }
    case RECEIVE_ENTRIES:
      return {
        ...state,
        entries: payload,
        loading: false,
      }
    case GET_ENTRY:
      return {
        ...state,
        entry: payload,
        loading: false,
      }
    case ADD_ENTRY:
      return {
        ...state,
        entries: [payload, ...state.entries],
        loading: false,
      }
    case DELETE_ENTRY:
      return {
        ...state,
        entries: state.entries.filter(entry => entry._id !== payload),
        loading: false,
      }
    case ENTRY_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      }

    default:
      return state
  }
}
