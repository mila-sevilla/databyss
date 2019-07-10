const express = require('express')
const router = express.Router()
const Entry = require('../../models/Entry')
const Author = require('../../models/Author')
const Source = require('../../models/Source')
const auth = require('../../middleware/auth')
const _ = require('lodash')

// @route    POST api/entry
// @desc     new Entry
// @access   Private
router.post('/', auth, async (req, res) => {
  try {
    /*
      INSERT ERROR HANDLER HERE
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
*/
    let {
      pageFrom,
      source,
      author,
      pageTo,
      files,
      entry,
      index,
      resource,
      firstName,
      lastName,
      _id, // NEED TO ADD THIS PARAM TO FRONT END
    } = req.body

    // If new source, create new Id
    if ((firstName || lastName) && !resource) {
      // POST NEW AUTHOR
      let authorPost
      authorPost = new Author({
        firstName: firstName,
        lastName: lastName,
        user: req.user.id,
      })
      authorPost = await authorPost.save()
      author.push(authorPost._id.toString())
    }

    if (resource) {
      let sourcePost
      let authorId
      if (firstName || lastName) {
        let authorPost
        // create new author
        authorPost = new Author({
          firstName: firstName,
          lastName: lastName,
          user: req.user.id,
        })
        authorPost = await authorPost.save()
        authorId = authorPost._id.toString()
        author.push(authorId)

        // create new souce
        const newSource = new Source({
          resource,
          user: req.user.id,
          authors: author,
        })
        sourcePost = await newSource.save()
        source = sourcePost._id.toString()

        //Update author with new source id
        authorPost = await Author.findOne({ _id: authorId })
        authorPost.sources = authorPost.sources.concat(source)
        authorPost = await Author.findOneAndUpdate(
          { _id: authorId },
          { $set: authorPost },
          { new: true }
        )
      } else {
        // create new source with or without existing author
        const newSource = new Source({
          resource,
          authors: author ? author : [],
          user: req.user.id,
        })
        sourcePost = await newSource.save()
        source = sourcePost._id.toString()

        // check to see if author exists
        if (_.isArray(author)) {
          appendAuthorToSource({ authors: author, sourceId: source })
        }
      }
    }

    const entryFields = {
      pageFrom: pageFrom ? pageFrom : '',
      source: source ? source : '',
      author: author ? author : [],
      pageTo: pageTo ? pageTo : '',
      files: files ? files : [],
      entry,
      index: index ? index : 0,
      user: req.user.id,
    }

    // CHECK HERE FOR IF ENTRY EXISTS
    let entryExists = await Entry.findOne({ _id: _id })
    if (entryExists) {
      if (req.user.id.toString() !== entryExists.user.toString()) {
        return res.status(401).json({ msg: 'This post is private' })
      }

      // update entry
      entryFields._id = _id
      entryExists = await Entry.findOneAndUpdate(
        { _id: _id },
        { $set: entryFields }
      ).then(() => {
        // if source exists, append entry to source
        if (source) {
          appendEntryToSource({ sourceId: source, entryId: entryExists._id })
        }
        // if author exists, append entry to author
        if (author) {
          appendEntryToAuthors({ authors: author, entryId: entryExists._id })
        }
      })
    } else {
      // create new entry
      const entries = new Entry(entryFields)
      const post = await entries.save()

      // if source exists, append entry to source
      if (source) {
        appendEntryToSource({ sourceId: source, entryId: post._id })
      }
      // if author exists, append entry to author
      if (author) {
        appendEntryToAuthors({ authors: author, entryId: post._id })
      }
      res.json(post)
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route    GET api/entry
// @desc     Get entry by ID
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
    const entry = await Entry.findOne({
      _id: req.params.id,
    })

    if (!entry) {
      return res.status(400).json({ msg: 'There is no entry for this id' })
    }
    if (req.user.id.toString() !== entry.user.toString()) {
      return res.status(401).json({ msg: 'This post is private' })
    }

    res.json(entry)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})
// @route    GET api/entries/
// @desc     Get all entries
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const entry = await Entry.find({ user: req.user.id })
    if (!entry) {
      return res.status(400).json({ msg: 'There are no entries' })
    }

    res.json(entry)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

const appendEntryToSource = async ({ sourceId, entryId }) => {
  let source = await Source.findOne({
    _id: sourceId,
  }).catch(err => console.log(err))
  if (source) {
    let newInput = source
    let newEntriesList = newInput.entries
    if (newEntriesList.indexOf(entryId) > -1) return
    newEntriesList.push(entryId)
    newInput.entries = newEntriesList
    source = await Source.findOneAndUpdate(
      { _id: sourceId },
      { $set: newInput },
      { new: true }
    ).catch(err => console.log(err))
  }
}

const appendEntryToAuthors = ({ authors, entryId }) => {
  const promises = authors.map(async a => {
    if (a) {
      let author = await Author.findOne({
        _id: a,
      }).catch(err => console.log(err))
      if (author) {
        let newInput = author
        let list = newInput.entries
        if (list.indexOf(entryId) > -1) return
        list.push(entryId)
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

const appendAuthorToSource = ({ sourceId, authors }) => {
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

module.exports = router
