import { startTimeKey } from '../serializers/res.js'

const isNotObject = (any) => !any || typeof any !== 'object'

const ecsError = (err, ecsObj) => {
  if (!(err?.message)) {
    return
  }

  const type =
    Object.prototype.toString.call(err.constructor) === '[object Function]'
      ? err.constructor.name
      : err.name

  ecsObj.error = {
    type,
    message: err.message,
    stack_trace: err.stack
  }
}

const ecsClient = (req, ecsObj) => {
  const ip = req.ip ? req.ip : req.socket?.remoteAddress
  const port = req.socket?.remotePort
  if (ip) {
    ecsObj.client = {
      ip,
      port
    }
  }
}

const ecsUrl = (req, ecsObj) => {
  const { originalUrl, url, headers } = req
  const _url = originalUrl || url
  if (!_url) return

  const [path, query] = _url.split('?')
  ecsObj.url = { path, query }

  if (headers?.host) {
    const [domain, port] = (headers.host || '').split(':')
    ecsObj.url.domain = domain
    if (port) {
      ecsObj.url.port = Number(port)
    }
  }
}

const ecsReq = (req, ecsObj) => {
  if (isNotObject(req)) {
    return
  }
  ecsClient(req, ecsObj)

  ecsUrl(req, ecsObj)

  const { method, httpVersion } = req
  if (!method) return

  const {
    cookie,
    authorization,
    'user-agent': userAgent,
    ...headers
  } = req.headers || {}

  ecsObj.http = ecsObj.http || {}
  ecsObj.http.request = {
    id: typeof req.id === 'function' ? req.id() : req.id,
    method,
    version: httpVersion,
    headers
  }
  ecsObj.user_agent = {
    original: userAgent
  }
}

const ecsRes = (res, ecsObj) => {
  if (isNotObject(res)) {
    return
  }
  const { statusCode } = res
  if (!statusCode) return

  const {
    'proxy-authenticate': _1,
    'set-cookie': _2,
    'content-type': mimeType,
    cookie,
    ...headers
  } = res.getHeaders() || {}

  ecsObj.http = ecsObj.http || {}
  ecsObj.http.response = {
    status_code: statusCode,
    mime_type: mimeType,
    headers
  }
  if (res[startTimeKey]) {
    ecsObj.http.response.latency = Date.now() - res[startTimeKey]
  }
}

export const ecsSerializers = {
  err: ecsError,
  req: ecsReq,
  res: ecsRes
}
