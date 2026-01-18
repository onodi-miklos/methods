const express = require('express')
const path = require('path')
let {people} = require('./data.cjs')
const {logger} = require('./logger.cjs')
const app = express()

app.use([express.json(), express.urlencoded({ extended: true }), express.static(path.join(__dirname, './public')), logger])



app.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, './public/index.html'))
})


app.get('/data', (req, res) => {
  res.json({success: true, data: people})
})
app.get('/data/param/:personId', (req, res) => {
  const {personId} = req.params
  const person = people.find(
    (person) => person.id === Number(personId)
  )
  if(!person){
    return res.status(404).json({ success: false, msg: "person not found" })
  }
  return res.json({success: true, data: person})
})
app.get('/data/query', (req, res) => {
  let {search, limit} = req.query
  let sortedPeople = [...people]
  search = search?.trim().toLowerCase()
  if(search) {
    sortedPeople = sortedPeople.filter((person) => {
      return person.name.startsWith(search)
    })
  }
  if(limit) {
    sortedPeople = sortedPeople.slice(0, Number(limit))
  }
  if (sortedPeople.length < 1) {
    return res.status(200).json({ success: true, data: [] })
  }
  res.status(200).json({success: true, data: sortedPeople})
})

app.post('/data', (req, res) => {
  const { name } = req.body
  
  const ids = people.map((e) => {return e.id})
  let newId
  for(let i = 1;i <= ids.length+1; i++){
    if(!ids.includes(i)){
      newId = i
      break
    }}
    let newPerson = { id: newId, name }
    
    if (!name) {
      return res.status(400).json({success: false, msg: 'please provide name'})
    }
  people.push(newPerson)
  res.status(201).json({
    success: true,
    data: people
  })
})



app.listen(5000, () => {
  console.log('Server is listening on port 5000....')
})
