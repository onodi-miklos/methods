const express = require('express')
const path = require('path')
const data = require('./data.cjs')
const app = express()



app.use(express.static(path.join(__dirname, './public')))

app.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, './frontend/html/index.html'))
})
app.get('/data', (req, res) => {
  res.json(data)
})


app.listen(5000, () => {
  console.log('Server is listening on port 5000....')
})