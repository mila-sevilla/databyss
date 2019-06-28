const express = require('express')
const router = express.Router()
const Source = require('../../models/Source')
const Author = require('../../models/Author')

const auth = require('../../middleware/auth')

// @route    POST api/sources
// @desc     Add Source
// @access   Private
router.post('/', auth, async (req, res) => {
  /*
      INSERT ERROR HANDLER HERE
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
*/
  const {
    title,
    authors,
    abbreviation,
    city,
    publishingCompany,
    sourceType,
    url,
    files,
    entries,
    date,
    resource,
    authorFirstName,
    authorLastName,
    _id,
  } = req.body

  let authorPost = {}

  // if new author add author and retrive ID
  if (authorFirstName || authorLastName) {
    const author = new Author({
      firstName: authorFirstName,
      lastName: authorLastName,
      user: req.user.id,
    })
    authorPost = await author.save()
    authors.push(authorPost._id.toString())
  }

  const sourceFields = {
    title,
    authors,
    abbreviation,
    city,
    publishingCompany,
    sourceType,
    url,
    files,
    entries,
    date,
    resource,
    user: req.user.id,
  }

  //if source exists update it and exit
  try {
    let source = await Source.findOne({ _id: _id })
    if (source) {
      if (req.user.id.toString() !== source.user.toString()) {
        return res.status(401).json({ msg: 'This post is private' })
      }

      sourceFields._id = _id
      source = await Source.findOneAndUpdate(
        { _id: _id },
        { $set: sourceFields }
      ).then(() => {
        if (authorPost) {
          appendSourceToAuthor({
            authors: authors,
            sourceId: _id.toString(),
          }).then(() => {
            if (entries) {
              // if entry exists append the authorID to both entry and source
              appendEntryToAuthor({
                entries: entries,
                authors: authors,
              })
            }
          })
        }
      })
      return res.json(source)
    } else {
      // if new source has been added
      const sources = new Source(sourceFields)
      const post = await sources.save()

      // if authors id exist append to source
      if (authors.length > 0) {
        appendSourceToAuthor({
          authors: authors,
          sourceId: post._id.toString(),
        })
      }

      // if entry exists append the authorID to both entry and source
      if (entries.length > 0) {
        appendEntryToAuthor({
          entries: entries,
          authors: authors,
        })
      }
      res.json(post)
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route    GET api/sources
// @desc     Get source by id
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    /*
      INSERT ERROR HANDLER HERE
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  
*/

    const sources = await Source.findOne({
      _id: req.params.id,
    })
    if (!sources) {
      return res.status(400).json({ msg: 'There is no source for this id' })
    }
    if (req.user.id.toString() !== sources.user.toString()) {
      return res.status(401).json({ msg: 'This post is private' })
    }

    res.json(sources)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route    GET api/sources/
// @desc     Get all sources
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    /*
      INSERT ERROR HANDLER HERE
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
*/
    const source = await Source.find()
    if (!source) {
      return res.status(400).json({ msg: 'There are no sources' })
    }

    res.json(source)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})
// @route    GET api/sources/
// @desc     Get all sources
// @access   public
router.get('/', async (req, res) => {
  try {
    const source = await Source.find({ user: req.user.id })
    if (!source) {
      return res.status(400).json({ msg: 'There are no sources' })
    }

    res.json(source)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

const appendSourceToAuthor = ({ authors, sourceId }) => {
  const promises = authors.map(async a => {
    if (a) {
      let author = await Author.findOne({
        _id: a,
      }).catch(err => console.log(err))
      if (author) {
        let newInput = author
        let list = newInput.sources
        if (list.indexOf(sourceId) > -1) return
        list.push(sourceId)
        newInput.sources = list
        author = await Author.findOneAndUpdate(
          { _id: a },
          { $set: newInput },
          { new: true }
        ).catch(err => console.log(err))
      }
    }
  })
  return Promise.all(promises)
}

const appendEntryToAuthor = ({ entries, authors }) => {
  const promises = authors.map(async a => {
    if (a) {
      let author = await Author.findOne({
        _id: a,
      }).catch(err => console.log(err))
      if (author) {
        let newInput = author
        let list = newInput.entries
        list = list.concat(entries.filter(e => list.indexOf(e) < 0))
        // figure out how to remove duplicates
        newInput.entries = list
        author = await Author.findOneAndUpdate(
          { _id: a },
          { $set: newInput },
          { new: true }
        ).catch(err => console.log(err))
      }
    }
  })
  return Promise.all(promises)
}

module.exports = router
