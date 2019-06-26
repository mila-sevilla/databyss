const express = require('express')
const router = express.Router()
const Author = require('../../models/Author')
// const Entry = require('../../models/Entry')

const auth = require('../../middleware/auth')

// @route    POST api/authors
// @desc     Adds author
// @access   Public
router.post('/', auth, async (req, res) => {
  try {
    /*
      INSERT ERROR HANDLER HERE
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

*/
    const { firstName, lastName, entries, sources } = req.body
    const author = new Author({
      firstName,
      lastName,
      entries,
      sources,
      user: req.user.id,
    })

    const post = await author.save()
    res.json(post)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route    GET api/authors/
// @desc     Get author by ID
// @access   private
router.get('/:id', auth, async (req, res) => {
  try {
    /*
      INSERT ERROR HANDLER HERE
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
*/

    const author = await Author.findOne({
      _id: req.params.id,
    })

    if (!author) {
      return res.status(400).json({ msg: 'There is no author for this id' })
    }

    res.json(author)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})
// @route    GET api/authors/
// @desc     Get all authors
// @access   private
router.get('/', auth, async (req, res) => {
  try {
    const author = await Author.find()
    if (!author) {
      return res.status(400).json({ msg: 'There are no authors' })
    }

    res.json(author)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
