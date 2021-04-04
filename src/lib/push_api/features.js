const Features = (() => {
  const isSupported = () => {
    return ('PushManager' in window) && ('serviceWorker' in window.navigator)
  }

  return {
    isSupported
  }
})()

export default Features
