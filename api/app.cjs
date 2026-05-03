const express = require('express')
const path = require('path')
const logger = require('@onodi-miklos/logger')
const router = require('./routes/data.cjs')

const app = express()

app.use(logger([
  // "console",
  "file"
]))

app.use([
  express.json(),
  express.urlencoded({ extended: true }),
  express.static(path.join(__dirname, "./public"))
]);


app.use("/api", router)


// db
let db

const { connectToDb, getDb } = require('./db.cjs')

connectToDb((err) => {
  if(!err) {
    app.listen(5000, () => {
      console.log('Server is listening on port 5000....')
    })
    db = getDb()
  }
})

app.get('/db', (req, res) => {
  let books = []

  db.collection('books')
    .find()
    .sort({ author: 1 })
    .forEach(book => books.push(book))
    .then(() => {
      res.status(200).json(books)
    })
    .catch(() => {
      res.status(500).json({error: 'Could not fetch the documents'})
    })
})


app.all(/.*/, (req, res) => {
  return res.status(404).send({success: false})
})