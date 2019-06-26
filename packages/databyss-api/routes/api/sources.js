const express = require('express')
const router = express.Router()
const Source = require('../../models/Source')
const Author = require('../../models/Author')

const auth = require('../../middleware/auth')

// @route    POST api/sources
// @desc     Add Source
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
    const {
      title,
      authors,
      year,
      city,
      publishingCompany,
      sourceType,
      url,
      files,
      entries,
      date,
      resource,
    } = req.body

    // Do parsing here
    const sources = new Source({
      title,
      authors,
      year,
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

module.exports = router

const appendToList = async ({ authors, sourceId }) => {
  try {
    authorId => {
      const promises = authorId.map(async a => {
        if (a) {
          console.log(a)
          let author = await Author.findOne({
            _id: a,
          }).catch(err => console.log(err))
          console.log(author)
          if (author) {
            let newInput = author
            let list = newInput.sources
            if (list.indexOf(sourceId) > 0) return
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
    /*
    addToAuthor(authors).then(resolve => {
      resolve('')
    })

    */
  } catch (err) {
    console.log(err)
  }
}
