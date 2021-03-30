export default class Permission {
  async askIfNotDenied () {
    let permission = window.Notification.permission
    if (permission !== 'denied') {
      permission = await window.Notification.requestPermission()
    }
    return permission
  }

  isGranted () {
    return Notification.permission === 'granted'
  }

  isDenied () {
    return Notification.permission === 'denied'
  }

  hasNeverAsked () {
    return Notification.permission === 'default'
  }
}
