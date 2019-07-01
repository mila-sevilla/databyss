import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import _ from 'lodash'

const EntryItem = ({
  entry: { _id, entry, source, author, pageTo, pageFrom },
}) => {
  const [sourceInfo, setSourceInfo] = useState({ authors: 0, resource: '' })
  useEffect(
    () => {
      if (!_.isEmpty(source)) {
        if (typeof source === 'string') {
          axios.get(`/api/sources/${source}`).then(res => {
            const data = res.data
            if (data.authors) {
              setSourceInfo({
                authors: data.authors.length,
                resource: data.resource,
              })
            }
          })
        } else {
          if (_.isArray(source.authors)) {
            setSourceInfo({
              authors: source.authors.length,
              resource: source.resource,
            })
          }
        }
      }
    },
    [source]
  )
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/entries/${_id}`}>
          <h4>{entry}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">authors: {sourceInfo.authors}</p>
        <p className="my-1">source: {sourceInfo.resource}</p>
        {pageFrom && (
          <p className="my-1">
            Page(s): {pageFrom}
            {pageTo > 0 && '-' + pageTo}
          </p>
        )}
      </div>
    </div>
  )
}

export default EntryItem
