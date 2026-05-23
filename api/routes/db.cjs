const express = require("express");
const router = express.Router();
const { getBooks, getBook, addBook, deleteBook, patchBook } = require('../controllers/db.cjs')

// router.get('/', getBooks)
// router.get('/:id', getBook)
// router.post('/', addBook)
// router.delete('/:id', deleteBook)
// router.patch('/:id', patchBook)

router.route('/')
  .get(getBooks)
  .post(addBook)
router.route('/:id')
  .get(getBook)
  .delete(deleteBook)
  .patch(patchBook)

module.exports = router