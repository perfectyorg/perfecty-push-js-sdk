import Logger from '../logger'

const Permission = (() => {
  const askIfNotDenied = async () => {
    let permission = window.Notification.permission
    if (permission !== 'denied') {
      Logger.info('Requesting Notification permission')
      permission = await window.Notification.requestPermission()
    }

    Logger.info('Notification permission', permission)
    return permission
  }

  const isGranted = () => {
    return Notification.permission === 'granted'
  }

  const isDenied = () => {
    return Notification.permission === 'denied'
  }

  const hasNeverAsked = () => {
    return Notification.permission === 'default'
  }

  const askedAlready = () => !hasNeverAsked()

  return {
    askIfNotDenied,
    isGranted,
    isDenied,
    hasNeverAsked,
    askedAlready
  }
})()

export default Permission
