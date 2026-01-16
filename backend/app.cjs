const express = require('express')
const path = require('path')
let {people} = require('./data.cjs')
const app = express()

function logger(req, res, next){
  console.log(
    req.method,
    req.url
  )
  if(req.method === 'GET'){
    console.log(
      req.params,
      req.query
    )
  } else if(req.method === 'POST'){
    console.log(
      req.body
    )
  }
  next()
}

app.use([express.json(), express.urlencoded({ extended: true }), express.static(path.join(__dirname, './public')), logger])

// I want to add params and queries

app.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, './frontend/index.html'))
})


app.get('/data', (req, res) => {
  res.json(people)
})
app.post('/data', (req, res) => {
  const { id, name } = req.body
  if (!id || !name) {
    return res.status(400).json({success: false, msg: 'please provide id and name'})
  }

  people.push({ id, name })
  return res.status(201).json({
    success: true,
    data: people
})})






app.listen(5000, () => {
  console.log('Server is listening on port 5000....')
})