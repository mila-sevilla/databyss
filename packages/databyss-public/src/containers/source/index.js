import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Landing, Link, LandingSources, Raw } from '@databyss-org/ui'
import { authorParser } from './entryParser'
import { getAuthors } from '../../actions/author'

const defaultLandingProps = {
  cfList: [],
  title: 'Title',
  subtitle: 'subtitle',
  contentTitle: 'content title'
}

const Source = ({ match, history }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAuthors())
  }, [])
  const authors = useSelector(state => state.author.authors)
  const [renderSource, setRenderSource] = useState([])
  const [landingProps, setLandingProps] = useState(defaultLandingProps)

  useEffect(() => {
    if (authors.length > 0) {
      const parsedAuthors = authorParser(authors)
      const list = (
        <Landing
          {...landingProps}
          contentTitle="Databyss includes 210 entries of the motif “ABYSS” from 44 sources by Jacques Derrida">
          <LandingSources
            sources={parsedAuthors}
            renderSource={author => {
              return (
                <div>
                  <Link
                    href={`/source/author/${author.id}`}
                    onClick={() => history.push(`source/author/${author.id}`)}>
                    <Raw
                      html={`${author.authorName} - ${author.sourceCount} sources`}
                    />
                  </Link>
                </div>
              )
            }}
          />
        </Landing>
      )
      setRenderSource(list)
    }
  }, [authors])

  return renderSource
}

export default Source
