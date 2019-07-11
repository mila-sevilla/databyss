import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Landing,
  Link,
  LandingSources,
  EntriesBySource,
  Raw,
  Content,
  TocList
} from '@databyss-org/ui'
import SourceById from './SourceById'
import SourceByAuthor from './SourceByAuthor'
import { getAuthor, entriesParser, getAuthorName } from './entryParser'
// import { entries } from './cfList'
import { getAuthors } from '../../actions/author'
import { getEntries } from '../../actions/entry'
import { getSources, getSource } from '../../actions/source'

const defaultLandingProps = {
  cfList: [],
  title: 'Title',
  subtitle: 'subtitle',
  contentTitle: 'content title'
}

const Source = ({ match, history }) => {
  /*
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getSources())
  }, [])
  const sources = useSelector(state => state.source.sources)
  const [renderSource, setRenderSource] = useState([])
  const [landingProps, setLandingProps] = useState(defaultLandingProps)

  useEffect(() => {
    if (sources.length > 0) {
      entriesParser(sources).then(s => {
        console.log(s)

        const list = (
          <Landing
            {...landingProps}
            contentTitle="Databyss includes 210 entries of the motif “ABYSS” from 44 sources by Jacques Derrida">
            <LandingSources
              sources={s}
              renderSource={source => {
                return (
                  <div>
                    <Link
                      href={`/source/${source.id}`}
                      onClick={e => history.push(`source/${source.id}`)}>
                      <Raw
                        html={`${source.author.lastName} - ${source.title}${
                          source.entryCount ? ` (${source.entryCount})` : null
                        }`}
                      />
                    </Link>
                  </div>
                )
              }}
            />
          </Landing>
        )
        setRenderSource(list)
      })
    }
  }, [sources])
*/
  return match.params.id ? (
    <SourceById id={match.params.id} />
  ) : (
    <SourceByAuthor history={history} />
  )
}

export default Source
