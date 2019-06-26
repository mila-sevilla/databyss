import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import EntryItem from './EntryItem'
import EntryForm from './EntryForm'
import { getEntries } from '../../actions/entry'

const Entries = ({ getEntries, entry: { entries, loading } }) => {
  useEffect(() => {
    getEntries()
  }, [getEntries])

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Entries</h1>
      <p className='lead'>
        <i className='fas fa-user' /> write a new entry
      </p>
      <EntryForm />

      <div className='posts'>
        {entries.map(entry => (
          <EntryItem key={entry._id} entry={entry} />
        ))}
      </div>
    </Fragment>
  )
}

Entries.propTypes = {
  getEntries: PropTypes.func.isRequired,
  entry: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  entry: state.entry,
})

export default connect(
  mapStateToProps,
  { getEntries }
)(Entries)
