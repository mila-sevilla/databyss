import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Landing, Link, Entry, EntriesBySource } from '@databyss-org/ui'
import { entryParser } from './entryParser'
// import { entries } from './cfList'
import { getAuthors, getAuthor } from '../../actions/author'
import { getEntries } from '../../actions/entry'
import { getSources } from '../../actions/source'

const defaultLandingProps = {
  cfList: [],
  title: '',
  subtitle: '',
  contentTitle: '',
  renderCfItem: cf => {
    return (
      <Link key={cf.id} href={`/motif/abyss:${cf.id}`}>
        {cf.lastName}
      </Link>
    )
  }
}

const Home = props => {
  const dispatch = useDispatch()
  const [landingProps, setLandingProps] = useState(defaultLandingProps)

  useEffect(() => {
    dispatch(getAuthors())
    dispatch(getEntries())
    dispatch(getSources())
  }, [])

  const author = useSelector(state => state.author)
  // const entry = useSelector(state => state.entry)
  const source = useSelector(state => state.source)

  let sourceSubject = source.sources[8]

  useEffect(() => {
    if (sourceSubject) {
      dispatch(getAuthor(sourceSubject.authors[0]))
    }
  }, [sourceSubject])

  useEffect(() => {
    if (sourceSubject && author.author) {
      setLandingProps({
        cfList: [],
        title: sourceSubject.resource,
        subtitle: `${author.author.firstName} ${author.author.lastName}`,
        contentTitle: `Databyss includes ${
          sourceSubject.entries.length
        } entries from ${author.author && author.author.lastName}'s "${
          sourceSubject.resource
        }"`,
        renderCfItem: cf => {
          return (
            <Link key={cf.id} href={`/motif/abyss:${cf.id}`}>
              {cf.lastName}
            </Link>
          )
        }
      })
    }
  }, [sourceSubject, author])

  const [entries, setEntries] = useState([])

  useEffect(() => {
    if (sourceSubject && author.author) {
      entryParser({
        entries: sourceSubject.entries,
        source: sourceSubject,
        author: author.author
      }).then(e => setEntries([e]))
    }
  }, [sourceSubject, author])

  return (
    <div className="content">
      <Landing className="landing-content" {...landingProps} withToggle>
        <EntriesBySource
          sources={entries}
          renderEntry={entry => <Entry {...entry} />}
        />
      </Landing>
    </div>
  )
}

export default Home
