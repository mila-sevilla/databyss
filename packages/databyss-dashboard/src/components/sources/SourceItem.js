import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { deleteSource } from '../../actions/source'

const SourceItem = ({
  source: {
    _id,
    resource,
    abbreviation,
    authors,
    date,
    city,
    publishingCompany,
    sourceType,
    url,
    files,
    entries,
  },
}) => (
  <div className='post bg-white p-1 my-1'>
    <Link to={`/sources/${_id}`}>
      <div>
        <p className='my-1'>{resource}</p>
      </div>
    </Link>

    <div>
      <p className='my-1'>Abbreviation: {abbreviation}</p>
      <p className='my-1'>Date: {date}</p>
      <p className='my-1'>City: {city}</p>
      <p className='my-1'>Publishing Company : {publishingCompany}</p>
      <p className='my-1'>Source Type: {sourceType}</p>
      <p className='my-1'>URL: {url}</p>
      <p className='my-1'>Total Entries: {entries.length}</p>
    </div>
  </div>
)

SourceItem.defaultProps = {
  //  showActions: true,
}

SourceItem.propTypes = {
  source: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteSource: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(
  mapStateToProps,
  { deleteSource }
)(SourceItem)
