import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import AuthorItem from './AuthorItem'
import AuthorForm from './AuthorForms'
import { getAuthors } from '../../actions/author'

const Authors = ({ getAuthors, author: { authors, loading } }) => {
  useEffect(() => {
    getAuthors()
  }, [getAuthors])

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Authors</h1>
      <p className='lead'>
        <i className='fas fa-user' /> add new author
      </p>
      <AuthorForm />

      <div className='posts'>
        {authors.map(author => (
          <AuthorItem key={author._id} author={author} />
        ))}
      </div>
    </Fragment>
  )
}

Authors.propTypes = {
  getAuthors: PropTypes.func.isRequired,
  author: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  author: state.author,
})

export default connect(
  mapStateToProps,
  { getAuthors }
)(Authors)
