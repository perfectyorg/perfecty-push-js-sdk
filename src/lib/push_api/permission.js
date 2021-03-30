import Logger from '../logger'

export default class Permission {
  async askIfNotDenied () {
    let permission = window.Notification.permission
    if (permission !== 'denied') {
      Logger.info('Requesting Notification permission')
      permission = await window.Notification.requestPermission()
    }

    Logger.info('Notification permission', permission)
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
