export const ua = (() => {
  if (typeof globalThis.navigator !== 'undefined') {
    const ua = navigator.userAgent
    return /firefox/i.test(ua) ? 'firefox' : 'chrome'
  }
})()

// console.log(ua)
