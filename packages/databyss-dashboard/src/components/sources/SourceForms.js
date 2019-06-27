import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addSource } from '../../actions/source'
import { getAuthors, addAuthor, clearAuthor } from '../../actions/author'

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
  authorFirstName: '',
  authorLastName: '',
}

const AuthorButton = ({ match, hanldeClick }) => (
  <button
    className="btn-small btn-light"
    onClick={hanldeClick}
    value={match._id}
  >
    <i className="fas fa-window-close text-danger" />
    {'  ' + match.lastName}
  </button>
)

const SourceForm = () => {
  const dispatch = useDispatch()

  useEffect(
    () => {
      setFormData({ ...clearForm, authors: [] })
      dispatch(getAuthors())
      return () => {
        setFormData(clearForm)
        dispatch(clearAuthor())
        setAuthorList([])
      }
    },
    [dispatch]
  )

  const { source, loading } = useSelector(state => state.source)
  const [formData, setFormData] = useState(clearForm)

  const authorState = useSelector(state => state.author)
  const author = authorState.author
  const authorsLoading = authorState.loading

  const dataLoading = loading || authorsLoading

  useEffect(
    () => {
      if (source) {
        setFormData({
          resource: loading || !source.resource ? '' : source.resource,
          abbreviation:
            loading || !source.abbreviation ? '' : source.abbreviation,
          _id: loading || !source._id ? '' : source._id,
          authors: loading || !source.authors ? '' : source.authors,
          date: loading || !source.date ? '' : source.date,
          city: loading || !source.city ? '' : source.city,
          publishingCompany:
            loading || !source.publishingCompany
              ? ''
              : source.publishingCompany,
          sourceType: loading || !source.sourceType ? '' : source.sourceType,
          url: loading || !source.url ? '' : source.url,
          files: loading || !source.files ? '' : source.files,
          entries: loading || !source.entries ? '' : source.entries,
        })
      }
    },
    [loading, source]
  )

  const {
    resource,
    abbreviation,
    authors,
    date,
    city,
    publishingCompany,
    sourceType,
    url,
    authorFirstName,
    authorLastName,
  } = formData

  const [renderList, setRenderList] = useState({ dropdown: [], selected: [] })
  const [authorList, setAuthorList] = useState([])

  useEffect(
    () => {
      if (author != null) {
        setFormData(f => ({
          ...f,
          authors:
            f.authors.indexOf(author._id) < 0
              ? f.authors.concat(author._id)
              : f.authors,
        }))
      }
    },
    [author]
  )

  useEffect(
    () => {
      setAuthorList(authorState.authors.filter(a => authors.indexOf(a._id) < 0))
    },
    [authorState, authors, formData]
  )

  useEffect(
    () => {
      setRenderList(r => ({
        ...r,
        selected:
          !dataLoading &&
          r.selected.length !== formData.authors.length &&
          authorState.authors.length > 0
            ? formData.authors.map((a, i) => {
                const match = authorState.authors.find(b => b._id === a)
                return (
                  match && (
                    <td key={i}>
                      <AuthorButton
                        match={match}
                        hanldeClick={e => {
                          e.preventDefault()
                          setFormData(f => ({
                            ...f,
                            authors: formData.authors.filter(
                              a => a !== match._id
                            ),
                          }))
                        }}
                      />
                    </td>
                  )
                )
              })
            : r.selected,
      }))
    },
    [authorState.authors, dataLoading, formData, author]
  )

  useEffect(
    () => {
      setRenderList(r => ({
        ...r,
        dropdown: authorList.map((a, i) => (
          <option key={i} value={a._id} label={a.lastName} />
        )),
      }))
    },
    [authorList, formData]
  )

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

  const addAuthors = () => {
    let authorForm = { firstName: authorFirstName, lastName: authorLastName }
    dispatch(addAuthor(authorForm))
    setFormData({ ...formData, authorFirstName: '', authorLastName: '' })
  }

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>New Source</h3>
      </div>

      <form
        className="form my-1"
        onSubmit={e => {
          e.preventDefault()
          onSubmit(e)
        }}
      >
        <div className="form-group">
          <div className="m-1">
            {renderList.dropdown && (
              <select name="authors" onChange={e => onChange(e)}>
                <option value="0">* Select Author(s)</option>
                {renderList.dropdown}
              </select>
            )}
            <small className="form-text">select one or more authors</small>
          </div>
          <div className="dash-buttons m-1">
            {authors.length > 0 && (
              <div>
                <h2>Selected</h2>
                <table className="table">
                  <tbody>
                    <tr>{renderList.selected}</tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <h3>New Author</h3>
          <input
            type="text"
            placeholder="first name"
            name="authorFirstName"
            value={authorFirstName}
            onChange={e => onChange(e)}
          />
          <small className="form-text">enter first name</small>
          <input
            type="text"
            placeholder="last name"
            name="authorLastName"
            value={authorLastName}
            onChange={e => onChange(e)}
          />
          <small className="form-text">last name</small>
        </div>
        <button
          type="button"
          onClick={() => addAuthors()}
          className="btn btn-dark my-1"
        >
          <p>add more authors</p>
        </button>

        <div className="form-group">
          <textarea
            placeholder="add a new resource"
            cols="30"
            rows="5"
            name="resource"
            value={resource}
            onChange={e => onChange(e)}
          />
          <small className="form-text">new source</small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Abbreviation"
            name="abbreviation"
            value={abbreviation}
            onChange={e => onChange(e)}
          />
          <small className="form-text">abbreviation</small>
        </div>

        {/* this authors drop down menu here */}

        <div className="form-group">
          <input
            type="text"
            placeholder="Date"
            name="date"
            value={date}
            onChange={e => onChange(e)}
          />
          <small className="form-text">source's publishing date</small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="City"
            name="city"
            value={city}
            onChange={e => onChange(e)}
          />
          <small className="form-text">city published in</small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Publishing Company"
            name="publishingCompany"
            value={publishingCompany}
            onChange={e => onChange(e)}
          />
          <small className="form-text">company that published source</small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Source Type"
            name="sourceType"
            value={sourceType}
            onChange={e => onChange(e)}
          />
          <small className="form-text">what type of source is this?</small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="URL"
            name="url"
            value={url}
            onChange={e => onChange(e)}
          />
          <small className="form-text">source web site</small>
        </div>

        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  )
}

export default SourceForm
