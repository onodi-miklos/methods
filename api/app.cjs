const express = require('express')
const path = require('path')
const logger = require('@onodi-miklos/logger')
const apiRouter = require('./routes/api.cjs')
const dbRouter = require('./routes/db.cjs')

const app = express()

app.use(logger([
  "console",
  // "file"
]))

app.use([
  express.json(),
  express.urlencoded({ extended: true }),
  express.static(path.join(__dirname, "./public"))
]);

app.use("/api", apiRouter)

app.use('/db', dbRouter)


app.all(/.*/, (req, res) => {
  return res.status(404).json({success: false})
})

app.listen(5000, () => {
  console.log('server listening on port 5000....')
})