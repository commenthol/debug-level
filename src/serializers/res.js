function resSerializer (val) {
  if (typeof val !== 'object' || !val) return

  const o = {
    statusCode: val.statusCode,
    headers: val.getHeaders ? val.getHeaders() : val._headers
  }

  return o
}

module.exports = resSerializer
