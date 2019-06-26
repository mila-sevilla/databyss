import React from 'react'
import { Link } from 'react-router-dom'

const EntryItem = ({
  entry: { _id, entry, source, author, pageTo, pageFrom },
}) => (
  <div className='post bg-white p-1 my-1'>
    <div>
      <Link to={`/entries/${_id}`}>
        <h4>{entry}</h4>
      </Link>
    </div>
    <div>
      <p className='my-1'>authors: {author.length}</p>
      <p className='my-1'>
        Page(s): {pageFrom}
        {pageTo > 0 && '-' + pageTo}
      </p>
      <p className='my-1'>{entry}</p>
    </div>
  </div>
)

export default EntryItem
