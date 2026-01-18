const fs = require('fs')
const path = require('path')


function logger(req, res, next) {
  const logFile = path.join(__dirname, 'log.txt')

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

  
  next()
}

module.exports = { logger }
