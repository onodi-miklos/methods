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
const { ObjectId } = require('mongodb')

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
    return res.status(200).json(books)
  })
  .catch(() => {
    return res.status(500).json({error: 'Could not fetch the documents'})
  })
})

app.get('/db/:id', (req, res) => {
  
  if (ObjectId.isValid(req.params.id)) {
    db.collection('books')
    .findOne({_id: new ObjectId(req.params.id)})
    .then(doc => {
      return res.status(200).json({doc})
    })
    .catch(err => {
      return res.status(500).json({error: 'Could not fetch the document'})
    })
  } else {
    return res.status(500).json({error: 'Not valid doc id'})
  }
  
})

app.post('/db', (req, res) => {
  const book = req.body
  
  db.collection('books')
  .insertOne(book)
  .then(result => {
    return res.status(201).json(result)
  })
  .catch(err => {
    return res.status(500).json({err: 'Could not create a new document'})
  })
})

app.delete('/db/:id', (req, res) => {
  if( ObjectId.isValid(req.params.id)) {
    db.collection('books')
      .deleteOne({_id: new ObjectId(req.params.id)})
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(err => {
        return res.status(500).json({error: 'Could not delete the document'})
      })
  } else {
    return res.status(500).json({error: 'Not a valid doc id'})
  }
})


app.all(/.*/, (req, res) => {
  return res.status(404).send({success: false})
})