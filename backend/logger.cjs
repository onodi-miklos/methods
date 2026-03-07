const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "log.txt");

const logger = (options) => {return (req, res, next) =>{
  res.on("finish", () => {
    const timestamp = new Date().toISOString();

    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      params: req.params,
      query: req.query,
      body: req.body,
    };

    const logLine = `[${timestamp}] ${JSON.stringify(logData)}\n\n`;

    if(
      options.includes("console")
    ){
      console.log(logLine.trim())
    }
    if(
      options.includes("file")
    ){
      fs.appendFile(logFile, logLine, (err) => {
        if (err) console.error(err);
      });
    }
  });

  next();
}}

module.exports = logger;