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

  // if new author add new author and retrive ID
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

  try {
    let source = await Source.findOne({ _id: _id })
    if (source) {
      sourceFields._id = _id
      source = await Source.findOneAndUpdate(
        { _id: _id },
        { $set: sourceFields }
      )
      // If new author has been added
      if (authorPost) {
        appendToList({
          authors: authors,
          sourceId: _id.toString(),
        })
      }

      return res.json(source)
    }

    // Do parsing here
    const sources = new Source({
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
    })

    const post = await sources.save()

    // if authors id exist append to length
    if (authors.length > 0) {
      appendToList({
        authors: authors,
        sourceId: post._id,
      })
    }

    res.json(post)
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
    if (!source) {
      return res.status(400).json({ msg: 'There is no sources' })
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

const appendToList = ({ authors, sourceId }) => {
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
