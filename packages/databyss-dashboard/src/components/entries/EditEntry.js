import React, { useState, useEffect } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { addEntry, getEntry, clearEntry } from '../../actions/entry'
import { getAuthors, clearAuthor } from '../../actions/author'
import { getSources, clearSource } from '../../actions/source'

const clearForm = {
  author: [],
  source: '',
  pageFrom: '',
  pageTo: '',
  files: [],
  entry: '',
  index: 0,
  document: '',
  resource: '',
  _id: '',
}

const EditEntry = ({ match }) => {
  const dispatch = useDispatch()
  useEffect(
    () => {
      dispatch(getEntry(match.params.id))
      dispatch(getAuthors())
      dispatch(getSources())
      return () => {
        dispatch(clearEntry())
        dispatch(clearAuthor())
        dispatch(clearSource())
      }
    },
    [dispatch, match.params.id]
  )

  const entriesState = useSelector(state => state.entry)
  const loading = entriesState.loading
  const entryState = entriesState.entry

  useEffect(
    () => {
      if (_.isObject(entryState)) {
        setFormData({
          author: loading || !entryState.author ? [] : entryState.author,
          source: loading || !entryState.source ? '' : entryState.source,
          _id: loading || !entryState._id ? '' : entryState._id,
          pageFrom: loading || !entryState.pageFrom ? '' : entryState.pageFrom,
          pageTo: loading || !entryState.pageTo ? '' : entryState.pageTo,
          files: loading || !entryState.files ? [] : entryState.files,
          entry: loading || !entryState.entry ? '' : entryState.entry,
          index: loading || !entryState.index ? '' : entryState.index,
          document: loading || !entryState.document ? '' : entryState.document,
          resource: loading || !entryState.resource ? '' : entryState.resource,
        })
      }
    },
    [loading, entryState]
  )

  const [formData, setFormData] = useState(clearForm)

  const { source, pageFrom, pageTo, entry, resource } = formData

  let sourceState = useSelector(state => state.source)
  let newSources = sourceState.sources

  const sourcesList = newSources.map(s => (
    <option key={s._id} value={s._id} label={s.resource} />
  ))

  const onChange = e => {
    if (e.target.name === 'source') {
      let a = newSources.filter(s => s._id === e.target.value)
      let newFormData = formData
      newFormData.author = a[0] ? a[0].authors : []

      setFormData(newFormData)
    }
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const [renderedAuthors, setRenderedAuthors] = useState([])

  useEffect(
    () => {
      if (formData.author.length !== renderedAuthors.length) {
        const list = formData.author.map(async id => {
          const res = await axios.get(`/api/authors/${id}`)
          return res.data
        })
        Promise.all(list).then(l => {
          const render = l.map(a => <h3 key={a._id}>{a.lastName}</h3>)
          setRenderedAuthors(render)
        })
      }
    },
    [formData.author, renderedAuthors.length]
  )

  const onSubmit = e => {
    formData.document = formData.entry
    e.preventDefault()
    dispatch(addEntry(formData))
    setFormData(clearForm)
  }

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>New Entry</h3>
      </div>

      <form
        className="form my-1"
        onSubmit={e => {
          e.preventDefault()
          onSubmit(e)
        }}
      >
        {resource.length === 0 && (
          <div className="form-group">
            <select name="source" value={source} onChange={e => onChange(e)}>
              <option value="">
                *{!source ? ' Select Existing Source' : ' New Source'}{' '}
              </option>
              {sourcesList}
            </select>
            <small className="form-text">source</small>
            {renderedAuthors.length > 0 && (
              <div className="form-group">
                {renderedAuthors}
                <small className="form-text">authors</small>
              </div>
            )}{' '}
          </div>
        )}

        {!source && (
          <div className="form-group">
            <textarea
              placeholder="or add a new resource"
              cols="30"
              rows="5"
              name="resource"
              value={resource}
              onChange={e => onChange(e)}
            />
            <small className="form-text">add new source</small>
          </div>
        )}
        <div className="form-group">
          <input
            type="text"
            placeholder="Page From"
            name="pageFrom"
            value={pageFrom}
            onChange={e => onChange(e)}
          />
          <small className="form-text">What page is this source from</small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Page To"
            name="pageTo"
            value={pageTo}
            onChange={e => onChange(e)}
          />
          <small className="form-text">if more than one page</small>
        </div>

        <div className="form-group">
          <textarea
            placeholder="add a new entry"
            cols="30"
            rows="5"
            name="entry"
            value={entry}
            onChange={e => onChange(e)}
          />
          <small className="form-text">new entry</small>
        </div>

        <input type="submit" className="btn btn-dark my-1" value="Update" />
      </form>
    </div>
  )
}

export default EditEntry
