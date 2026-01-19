const fs = require('fs')
const path = require('path')

const logFile = path.join(__dirname, 'log.txt')

function logger(req, res, next) {
  const timestamp = new Date().toISOString()

  let logData = {
    method: req.method,
    url: req.url,
  }

  if (req.method === 'GET') {
    logData.params = req.params
    logData.query = req.query
  } else if (req.method === 'POST') {
    logData.body = req.body
  }

  const logLine = `[${timestamp}] ${JSON.stringify(logData)}\n`

  // Console log (unchanged behavior)
  console.log(logLine.trim())

  // File log
  fs.appendFile(logFile, logLine, (err) => {
    if (err) {
      console.error('Failed to write log:', err)
    }
  })

  next()
}

module.exports = { logger }
