export default class Features {
  isSupported () {
    return ('PushManager' in window) && ('serviceWorker' in window.navigator)
  }
}
