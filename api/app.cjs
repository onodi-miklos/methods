const path = require('path')
const logger = require('@onodi-miklos/logger')
const express = require('express')
const data = require('./routes/data.cjs')

const app = express()

app.use(logger([
  // "console",
  "file"
]))

app.use([
  express.json(),
  express.urlencoded({ extended: true }),
  // express.static(path.join(__dirname, "./public")),
]);


app.use("/api", data)


app.all(/.*/, (req, res) => {
  return res.status(404).send({success: false})
})

app.listen(5000, () => {
  console.log('Server is listening on port 5000....')
})