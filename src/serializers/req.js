function reqSerializer (val) {
  if (typeof val !== 'object' || !val) return

  const { originalUrl, url, method, query, headers, socket } = val
  const { remoteAddress, remotePort } = socket || {}
  const o = {
    method,
    url: originalUrl || url,
    query,
    headers,
    remoteAddress,
    remotePort
  }

  return o
}

module.exports = reqSerializer
