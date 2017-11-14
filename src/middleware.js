const Log = require('./node')

const {parse: urlParse} = require('url')
const {parse: qsParse} = require('querystring')

// https://css-tricks.com/snippets/html/base64-encode-of-1x1px-transparent-gif/
const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')

// custom logger to use formatter and stream
function CustomLog () {
  Log.call(this, 'middleware')
}
Object.setPrototypeOf(CustomLog.prototype, Log.prototype)
CustomLog.prototype.log = function (obj) {
  const str = this.formatter.format(obj)
  this.render(str)
}

module.exports = middleware

/**
* connect middleware which logs browser based logs on server side
* sends a transparent gif as response
* @return {function} connect middleware
*/
function middleware () {
  const log = new CustomLog()

  return function (req, res) {
    let query = req.query
    if (!req.query) {
      query = qsParse(urlParse(req.url).query)
    }
    res.setHeader('Cache-Control', 'no-store, no-cache')
    res.write(gif)
    res.end()

    const str = query.log
    if (str) {
      if (req.ip) {
        try {
          const obj = JSON.parse(str)
          obj.ip = req.ip
          log.log(obj)
          return
        } catch (e) {
        }
      }
    }
    log.log(str)
  }
}
