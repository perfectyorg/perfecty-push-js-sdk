import ServiceWorker from './service_worker'
import ApiClient from './api_client'
import Logger from '../logger'
import Options from './options'
import Storage from './storage'

/**
 * Registration Register the Service Worker
 */
const Registration = (() => {
  const assureRegistration = async () => {
    Logger.info('Ensuring registration')

    await removeConflicts()
    return await registerIfMissing()
  }

  const register = async () => {
    Logger.info('Registering user')

    const pushSubscription = await ServiceWorker.install()
    const response = await ApiClient.register(pushSubscription)
    if (response !== false) {
      Storage.setUserId(response.uuid)
    }
    return response
  }

  const removeConflicts = async () => {
    if (Options.unregisterConflicts === true) {
      Logger.info('Removing conflicts')
      await ServiceWorker.removeConflicts()
    }
  }

  const registerIfMissing = async () => {
    Logger.info('Checking if the service worker is installed')
    const installedType = await ServiceWorker.getInstalledType()
    if (installedType === ServiceWorker.TYPE_NOTHING) {
      Logger.info('The service worker was not found, registering')
      return await register()
    }
    Logger.info('Service worker found')
    return false
  }

  return {
    assureRegistration,
    register
  }
})()

export default Registration
