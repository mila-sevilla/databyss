import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addSource } from '../../actions/source'
import { getAuthors } from '../../actions/author'

const clearForm = {
  resource: '',
  abbreviation: '',
  authors: [],
  date: '',
  city: '',
  publishingCompany: '',
  sourceType: '',
  url: '',
  files: '',
  entries: [],
}

const SourceForm = () => {
  useEffect(() => {
    return setFormData({ ...clearForm, authors: [] })
  }, [])
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAuthors())
  }, [dispatch])
  const authorState = useSelector(state => state.author)

  const [formData, setFormData] = useState(clearForm)

  const {
    resource,
    abbreviation,
    authors,
    date,
    city,
    publishingCompany,
    sourceType,
    url,
  } = formData

  const [renderList, setRenderList] = useState({})
  const [authorList, setAuthorList] = useState([])

  useEffect(() => {
    setAuthorList(authorState.authors)
  }, [authorState, formData])

  useEffect(() => {
    setAuthorList(authorState.authors.filter(a => authors.indexOf(a._id) < 0))
  }, [formData, authorState, authors])

  useEffect(() => {
    setRenderList({
      dropdown: authorList.map(a => (
        <option key={a._id} value={a._id} label={a.lastName} />
      )),
      selected: authors.map(a => {
        const match = authorState.authors.find(b => b._id === a)
        return (
          <th key={match._id}>
            <button
              className='btn-small btn-light'
              onClick={() => removeAuthor(match._id)}
            >
              <i className='fas fa-window-close text-danger' />
            </button>
            {'  ' + match.lastName}
          </th>
        )
      }),
    })
  }, [authorList, formData, authorState, authors])

  const removeAuthor = id => {
    setFormData({ ...formData, authors: authors.filter(a => a !== id) })
  }

  const onChange = e => {
    if (e.target.name === 'authors') {
      let list = authors
      list.push(e.target.value)
      setFormData({ ...formData, authors: list })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const onSubmit = e => {
    dispatch(addSource(formData))
    setFormData({ ...clearForm, authors: [] })
  }

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>New Source</h3>
      </div>

      <form
        className='form my-1'
        onSubmit={e => {
          e.preventDefault()
          onSubmit(e)
        }}
      >
        <div className='form-group'>
          <div className='m-1'>
            {renderList.dropdown && (
              <select name='authors' onChange={e => onChange(e)}>
                <option value='0'>* Select Author(s)</option>
                {renderList.dropdown}
              </select>
            )}
            <small className='form-text'>select one or more authors</small>
          </div>
          <div className='dash-buttons m-1'>
            {authors.length > 0 && (
              <div>
                <h2>Selected</h2>
                <table className='table'>
                  <tbody>
                    <tr>{renderList.selected}</tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className='form-group'>
          <textarea
            placeholder='add a new resource'
            cols='30'
            rows='5'
            name='resource'
            value={resource}
            onChange={e => onChange(e)}
          />
          <small className='form-text'>new source</small>
        </div>

        <div className='form-group'>
          <input
            type='text'
            placeholder='Abbreviation'
            name='abbreviation'
            value={abbreviation}
            onChange={e => onChange(e)}
          />
          <small className='form-text'>author's first name</small>
        </div>

        {/* this authors drop down menu here */}

        <div className='form-group'>
          <input
            type='text'
            placeholder='Date'
            name='date'
            value={date}
            onChange={e => onChange(e)}
          />
          <small className='form-text'>source's publishing date</small>
        </div>

        <div className='form-group'>
          <input
            type='text'
            placeholder='City'
            name='city'
            value={city}
            onChange={e => onChange(e)}
          />
          <small className='form-text'>city published in</small>
        </div>

        <div className='form-group'>
          <input
            type='text'
            placeholder='Publishing Company'
            name='publishingCompany'
            value={publishingCompany}
            onChange={e => onChange(e)}
          />
          <small className='form-text'>company that published source</small>
        </div>

        <div className='form-group'>
          <input
            type='text'
            placeholder='Source Type'
            name='sourceType'
            value={sourceType}
            onChange={e => onChange(e)}
          />
          <small className='form-text'>what type of source is this?</small>
        </div>

        <div className='form-group'>
          <input
            type='text'
            placeholder='URL'
            name='url'
            value={url}
            onChange={e => onChange(e)}
          />
          <small className='form-text'>source web site</small>
        </div>

        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  )
}

export default SourceForm
