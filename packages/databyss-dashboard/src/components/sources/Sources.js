import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import SourceItem from './SourceItem'
import SourcesForm from './SourceForms'
import { getSources } from '../../actions/source'

const Sources = ({ getSources, source: { sources, loading } }) => {
  useEffect(() => {
    getSources()
  }, [getSources])

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Sources</h1>
      <p className='lead'>
        <i className='fas fa-user' /> add new source
      </p>
      <SourcesForm />

      <div className='posts'>
        {sources.map(source => (
          <SourceItem key={source._id} source={source} />
        ))}
      </div>
    </Fragment>
  )
}

Sources.propTypes = {
  getSources: PropTypes.func.isRequired,
  source: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  source: state.source,
})

export default connect(
  mapStateToProps,
  { getSources }
)(Sources)
