const { log } = require('console')
const fs = require('fs')
const path = require('path')

const logFile = path.join(__dirname, 'log.txt')

function logger(req, res, next) {

  res.on('finish', () => {
    const timestamp = new Date().toISOString()

    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      params: req.params,
      query: req.query,
      body: req.body
    }

    const logLine = `[${timestamp}] ${JSON.stringify(logData)}\n\n`

    // console.log(logLine.trim())

    fs.appendFile(logFile, logLine, err => {
      if (err) console.error(err)
    })
  })

  next()
}


module.exports = { logger }
