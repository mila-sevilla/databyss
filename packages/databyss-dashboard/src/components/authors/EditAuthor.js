import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useReactRouter from 'use-react-router'

import { addAuthor, getAuthor, clearAuthor } from '../../actions/author'

const clearForm = {
  firstName: '',
  lastName: '',
  _id: '',
  entries: [],
  sources: [],
}

const EditAuthor = ({ match }) => {
  const dispatch = useDispatch()
  const { history } = useReactRouter()
  useEffect(
    () => {
      dispatch(getAuthor(match.params.id))
      return () => {
        dispatch(clearAuthor())
      }
    },
    [dispatch, match.params.id]
  )

  const { author, loading } = useSelector(state => state.author)

  const [formData, setFormData] = useState(clearForm)

  useEffect(
    () => {
      if (!loading && author) {
        setFormData({
          firstName: loading || !author.firstName ? '' : author.firstName,
          lastName: loading || !author.lastName ? '' : author.lastName,
          _id: loading || !author._id ? '' : author._id,
          entries: loading || !author.entries ? '' : author.entries,
          sources: loading || !author.sources ? '' : author.sources,
        })
      }
    },
    [loading, author]
  )

  const { firstName, lastName, _id } = formData

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = e => {
    e.preventDefault()
    dispatch(addAuthor(formData))
    history.push(`/authors/${_id}`)
  }

  return !loading ? (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>New Author</h3>
      </div>

      <form
        className="form my-1"
        onSubmit={e => {
          e.preventDefault()
          onSubmit(e)
        }}
      >
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

        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  ) : null
}

export default EditAuthor
