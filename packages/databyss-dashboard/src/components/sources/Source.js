import React, { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import BackButton from './../buttons/BackButton'
import Spinner from '../layout/Spinner'
import AuthorItem from './../authors/AuthorItem'
import EntryItem from './../entries/EntryItem'
import { getSource, clearSource } from '../../actions/source'

const Source = ({ match }) => {
  const dispatch = useDispatch()
  useEffect(
    () => {
      setTimeout(() => dispatch(getSource(match.params.id)), 300)
      return () => {
        dispatch(clearSource())
      }
    },
    [dispatch, match.params.id]
  )

  const { source, loading } = useSelector(state => state.source)
  const [authorList, setAuthorList] = useState([])
  const [entryList, setEntryList] = useState([])

  useEffect(
    () => {
      if (source) {
        const authorsList = source.authors.map(async id => {
          const res = await axios.get(`/api/authors/${id}`)
          return res.data
        })
        Promise.all(authorsList).then(list => setAuthorList(list))
      }
    },
    [source, loading]
  )

  useEffect(
    () => {
      if (_.isObject(source) && _.isArray(source.entries)) {
        const entriesList = source.entries.map(async id => {
          const res = await axios.get(`/api/entries/${id}`)
          return res.data
        })
        Promise.all(entriesList).then(list => setEntryList(list))
      }
    },
    [source, loading]
  )

  const [renderedList, setRenderedList] = useState({})

  useEffect(
    () => {
      if (_.isArray(authorList)) {
        setRenderedList(r => ({
          ...r,
          authors: authorList.map(a => <AuthorItem key={a._id} author={a} />),
        }))
      }
    },
    [authorList]
  )

  useEffect(
    () => {
      if (_.isArray(entryList)) {
        setRenderedList(r => ({
          ...r,
          entries: entryList.map(e => <EntryItem key={e._id} entry={e} />),
        }))
      }
    },
    [entryList]
  )
  return loading || source === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <BackButton />
      <div className="dash-buttons p-1">
        <Link to={`/sources/edit/${source._id}`} className="btn btn-light">
          <i className="fas fa-user-circle text-primary" /> Edit Source
        </Link>
      </div>
      <h1 className="lead text-dark">Source: {source.resource}</h1>
      <p>Source Type: {source.sourceType}</p>
      <p>Date: {source.date}</p>
      <p>Publishing Company: {source.publishingCompany}</p>
      <p>City: {source.city}</p>
      <p>URL: {source.url}</p>

      <div className="m-2">
        <h3>Authors</h3>
        {authorList.length > 0
          ? renderedList.authors
          : 'no authors for this source'}
        <div className="profile-grid" />
      </div>
      <div className="m-2">
        <h3>Entries</h3>
        {entryList.length > 0
          ? renderedList.entries
          : 'no entries for this source'}
      </div>
    </Fragment>
  )
}

export default Source
