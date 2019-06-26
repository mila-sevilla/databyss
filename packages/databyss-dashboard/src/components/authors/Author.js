import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import BackButton from './../buttons/BackButton'
import EntryItem from './../entries/EntryItem'
import SourceItem from './../sources/SourceItem'
import Spinner from '../layout/Spinner'
import { getAuthor } from '../../actions/author'

const Author = ({ match }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAuthor(match.params.id))
  }, [dispatch, match.params.id])

  const { author, loading } = useSelector(state => state.author)
  const [entries, setEntries] = useState([])
  const [sources, setSources] = useState([])

  useEffect(() => {
    if (author) {
      const entryList = author.entries.map(async id => {
        const res = await axios.get(`/api/entries/${id}`)
        return res.data
      })
      Promise.all(entryList).then(list => setEntries(list))
    }
  }, [author])

  useEffect(() => {
    if (author) {
      const sourceList = author.sources.map(async id => {
        const res = await axios.get(`/api/sources/${id}`)
        return res.data
      })
      Promise.all(sourceList).then(list => setSources(list))
    }
  }, [author])

  const [render, setRender] = useState({})

  useEffect(() => {
    if (entries.length > 0) {
      let list = entries.map(e => <EntryItem key={e._id} entry={e} />)
      setRender(r => ({ ...r, entries: list }))
    }
  }, [entries])

  useEffect(() => {
    if (sources.length > 0) {
      let list = sources.map(s => <SourceItem key={s._id} source={s} />)
      setRender(r => ({ ...r, sources: list }))
    }
  }, [sources])

  return loading || author === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <BackButton />
      <h1 className='lead text-dark'>
        Author: {author.lastName + ', ' + author.firstName}
      </h1>
      <div className='m-2'>
        <h3>Entries</h3>
        {render.entries && render.entries}
      </div>
      <div className='m-2'>
        <h3>Sources</h3>
        {render.sources && render.sources}
      </div>
    </Fragment>
  )
}

export default Author
