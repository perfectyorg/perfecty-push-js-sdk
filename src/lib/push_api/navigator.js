const Navigator = (() => {
  const serviceWorker = () => {
    return navigator.serviceWorker
  }
  return {
    serviceWorker
  }
})()

export default Navigator
