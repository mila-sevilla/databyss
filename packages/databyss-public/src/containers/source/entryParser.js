import axios from 'axios'

export const entryParser = ({ entries, source, author }) => {
  const res = getEntriesList(entries).then(e => {
    return {
      title: source.resource,
      display: source.abbreviation ? source.abbreviation : 'ABV',
      locations: e.map(l => {
        // console.log(l.pageFrom.toString())
        return {
          raw: l.pageFrom ? `p. ${l.pageFrom.toString()}` : '',
          entries: [
            {
              content: l.entry
            }
          ]
        }
      })
    }
  })
  return res
}

export const authorParser = authors => {
  const entries = authors.map(a => {
    return {
      authorName: `${a.lastName}, ${a.firstName}`,
      sourceCount: `${a.sources.length}`,
      id: a._id
    }
  })
  return entries
}

export const entriesParser = ({ sources }) => {
  const entries = sources.map(async s => {
    let source = await axios.get(`/api/sources/${s}`)
    source = source.data
    let author = await axios.get(`/api/authors/${source.authors[0]}`)
    author = author.data.lastName
    return {
      abv: source.abbreviation,
      author: author,
      entryCount: source.entries.length,
      title: source.resource,
      id: source._id
    }
  })
  return Promise.all(entries)
}

export const getAuthorName = async authorList => {
  if (authorList[0]) {
    const entryRes = await axios.get(`/api/authors/${authorList[0]}`)
    return entryRes.data
  }
}

export const getEntriesList = entries => {
  const promises = entries.map(async e => {
    const entryRes = await axios.get(`/api/entries/${e}`)
    return entryRes.data
  })
  return Promise.all(promises)
}

export const getAuthor = idList => {
  const promises = idList.map(async e => {
    if (e.authors[0]) {
      const entryRes = await axios.get(`/api/authors/${e.authors[0]}`)
      const { firstName, lastName } = entryRes.data
      if (entryRes.data) {
        return { firstName, lastName, ...e }
      } else {
        return null
      }
    }
  })
  return Promise.all(promises)
}
