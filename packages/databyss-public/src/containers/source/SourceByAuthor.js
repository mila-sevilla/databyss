import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Landing, Link, LandingSources, Raw } from '@databyss-org/ui'
import _ from 'lodash'
import { entriesParser } from './entryParser'
import { getAuthor } from '../../actions/author'
import { getSources } from '../../actions/source'

const defaultLandingProps = {
  cfList: [],
  title: 'Title',
  subtitle: 'subtitle',
  contentTitle: 'content title'
}

const SourceByAuthor = ({ history, authorId, match }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getSources())
  }, [])
  const sources = useSelector(state => state.source.sources)
  const author = useSelector(state => state.author.author)

  const [renderSource, setRenderSource] = useState([])
  const [landingProps, setLandingProps] = useState(defaultLandingProps)

  useEffect(() => {
    if (sources.length > 0 && match.params.id) {
      // add filter method here
      dispatch(getAuthor(match.params.id))
    }
  }, [sources])

  useEffect(() => {
    if (!_.isEmpty(author) && !_.isEmpty(sources)) {
      const titleProps = {
        cfList: [],
        title: `${author.lastName}`,
        subtitle: ''
      }
      setLandingProps(titleProps)
    }
  }, [author, sources])

  useEffect(() => {
    if (sources.length > 0 && author) {
      entriesParser(author.sources).then(s => {
        const list = (
          <Landing
            {...landingProps}
            contentTitle={`Databyss includes ${s.length} entries by `}>
            <LandingSources
              sources={s}
              renderSource={source => {
                return (
                  <div>
                    <Link
                      href={`/source/${source.id}`}
                      onClick={e => history.push(`/source/${source.id}`)}>
                      <Raw
                        html={`${source.title}${
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
  }, [landingProps])

  return renderSource
}

export default SourceByAuthor
