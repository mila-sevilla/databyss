import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addAuthor } from '../../actions/author'

const clearForm = {
  firstName: '',
  lastName: '',
  entries: [],
  sources: [],
}

const AuthorForms = () => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState(clearForm)

  const { firstName, lastName } = formData

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = e => {
    e.preventDefault()
    dispatch(addAuthor(formData))
    //  addAuthor(formData)
    setFormData(clearForm)
  }

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>New Author</h3>
      </div>

      <form
        className='form my-1'
        onSubmit={e => {
          e.preventDefault()
          onSubmit(e)
        }}
      >
        <div className='form-group'>
          <input
            type='text'
            placeholder='First Name'
            name='firstName'
            value={firstName}
            onChange={e => onChange(e)}
          />
          <small className='form-text'>author's first name</small>
        </div>

        <div className='form-group'>
          <input
            type='text'
            placeholder='Last Name'
            name='lastName'
            value={lastName}
            onChange={e => onChange(e)}
          />
          <small className='form-text'>author's last name</small>
        </div>

        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  )
}

export default AuthorForms
