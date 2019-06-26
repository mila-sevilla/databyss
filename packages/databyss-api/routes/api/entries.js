const express = require('express')
const router = express.Router()
const Entry = require('../../models/Entry')
const Author = require('../../models/Author')
const Source = require('../../models/Source')

const auth = require('../../middleware/auth')

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
    const { pageFrom, source, author, pageTo, files, entry, index } = req.body
    const entries = new Entry({
      pageFrom,
      source,
      author,
      pageTo,
      files,
      entry,
      index,
      user: req.user.id,
    })

    const post = await entries.save()

    appendToList({
      authors: post.author,
      sourceId: post.source,
      entryId: post._id,
    })

    /*
    const author = await Author.findOne({
      _id: post.author,
    })

    const source = await Source.findOne({
      _id: post.source
    })
*/
    res.json(post)
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
    const entry = await Entry.find()
    if (!entry) {
      return res.status(400).json({ msg: 'There are no entries' })
    }

    res.json(entry)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

const appendToList = async ({ authors, entryId, sourceId }) => {
  try {
    const addToAuthor = authorId => {
      const promises = authorId.map(async a => {
        if (a) {
          let author = await Author.findOne({
            _id: a,
          }).catch(err => console.log(err))

          if (author) {
            let newInput = author
            let list = newInput.entries
            if (list.indexOf(entryId) > 0) return
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

    let response = addToAuthor(authors)

    if (sourceId) {
      let source = await Source.findOne({
        _id: sourceId,
      })

      if (source) {
        let newEntry = source
        let entrylist = newEntry.entries
        if (entrylist.indexOf(entryId) > 0) return
        entrylist.push(entryId)
        newEntry.entries = entrylist

        source = await Source.findOneAndUpdate(
          { _id: sourceId },
          { $set: newEntry },
          { new: true }
        )
      }
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = router
