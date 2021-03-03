const ua = (() => {
  if (typeof global.navigator !== 'undefined') {
    const ua = navigator.userAgent
    return /firefox/i.test(ua)
      ? 'firefox'
      : 'chrome'
  }
})()

// console.log(ua)

module.exports = ua
