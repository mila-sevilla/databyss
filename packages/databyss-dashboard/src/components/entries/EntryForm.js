import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { addEntry, clearEntry } from '../../actions/entry'
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
  firstName: '',
  lastName: '',
}

const EntryForm = () => {
  const dispatch = useDispatch()
  useEffect(
    () => {
      dispatch(getAuthors())
      dispatch(getSources())
      return () => {
        dispatch(clearEntry())
        dispatch(clearAuthor())
        dispatch(clearSource())
        setFormData(clearForm)
      }
    },
    [dispatch]
  )

  const [formData, setFormData] = useState(clearForm)

  const {
    source,
    pageFrom,
    pageTo,
    entry,
    resource,
    lastName,
    firstName,
    author,
  } = formData

  let sourceState = useSelector(state => state.source)
  let newSources = sourceState.sources

  let authorState = useSelector(state => state.author)
  let newAuthors = authorState.authors

  const sourcesList =
    author.length > 0
      ? newSources
          .filter(s => s.authors.indexOf(author[0]) > -1)
          .map(s => <option key={s._id} value={s._id} label={s.resource} />)
      : newSources.map(s => (
          <option key={s._id} value={s._id} label={s.resource} />
        ))

  const authorsList = newAuthors
    ? newAuthors.map(a => (
        <option key={a._id} value={a._id} label={a.lastName} />
      ))
    : []

  const [, updateState] = React.useState()
  const forceUpdate = useCallback(() => updateState({}), [])

  const onChange = e => {
    if (e.target.name === 'source') {
      let a = newSources.filter(s => s._id === e.target.value)
      let newFormData = formData
      newFormData.author = a[0] ? a[0].authors : []
      setFormData(newFormData)
    }
    if (e.target.name === 'author') {
      let a = newAuthors.filter(a => a._id === e.target.value)
      let newFormData = formData
      newFormData.author = a[0] ? [a[0]._id] : []
      setFormData(newFormData)
      forceUpdate()
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
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
        {firstName.length === 0 &&
          lastName.length === 0 && (
            <div className="form-group">
              <select
                name="author"
                value={author[0]}
                onChange={e => onChange(e)}
              >
                <option value="">
                  *{!source ? ' Select Existing Author' : ' New Author'}{' '}
                </option>
                {authorsList}
              </select>
              <small className="form-text">author</small>
              {renderedAuthors.length > 0 && (
                <div className="form-group">
                  {renderedAuthors}
                  <small className="form-text">authors</small>
                </div>
              )}{' '}
            </div>
          )}

        {author.length < 1 && (
          <div>
            <div className="form-group">
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={firstName}
                onChange={e => onChange(e)}
              />
              <small className="form-text">author's first name</small>
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={lastName}
                onChange={e => onChange(e)}
              />
              <small className="form-text">author's last name</small>
            </div>
          </div>
        )}

        {resource.length === 0 && (
          <div className="form-group">
            <select name="source" value={source} onChange={e => onChange(e)}>
              <option value="">
                *{!source ? ' Select Existing Source' : ' New Source'}{' '}
              </option>
              {sourcesList}
            </select>
            <small className="form-text">source</small>
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

        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  )
}

export default EntryForm
