import { urlBase64ToUint8Array } from './utils'
import Logger from '../logger'
import Options from './options'
import Storage from './storage'
import ApiClient from './api_client'
import Navigator from './navigator'

const ServiceInstaller = (() => {
  const TYPE_NOTHING = 1
  const TYPE_CONFLICT = 2
  const TYPE_PERFECTY = 3
  const TYPE_OLD_SCOPE = 4

  const removeOldSubscription = async () => {
    const userId = Storage.userId()
    if (userId !== null) {
      const user = await ApiClient.getUser(userId)
      if (user === null) {
        Logger.info('Removing old subscription')
        const registration = await getPerfectyRegistration()
        await registration.unregister()
        Storage.setUserId(null)
      }
    }
  }

  const removeConflicts = async () => {
    Logger.info('Checking the installed service workers')

    // we go through all the already installed service workers
    const registrations = await Navigator.serviceWorker().getRegistrations()
    for (const registration of registrations) {
      const installedType = await getInstallationType(registration)
      Logger.debug('installedType', installedType)

      if (installedType === TYPE_CONFLICT && Options.unregisterConflicts) {
        await registration.unregister()
        Logger.info('Conflicting service worker unregistered', registration)
      } else if (installedType === TYPE_OLD_SCOPE) {
        await registration.unregister()
        Storage.setShouldRegisterUser(true)
        Logger.info('Old scoped service worker unregistered', registration)
      }
    }
  }

  const installIfMissing = async () => {
    const perfectyRegistration = await getPerfectyRegistration()
    const installedType = await getInstallationType(perfectyRegistration)
    if (installedType === TYPE_NOTHING) {
      Logger.info('The Service Worker was not found, installing')
      return await install()
    }
    Logger.info('Service Worker found')
    return false
  }

  const install = async () => {
    Logger.info('Installing Service Worker')

    const fullPath = Options.path + '/service-worker-loader.js.php'
    await Navigator.serviceWorker().register(fullPath, { scope: Options.serviceWorkerScope })
    const perfectyRegistration = await getPerfectyRegistration()

    Logger.info('Service Worker was installed')
    Logger.debug('Registration', perfectyRegistration)

    return perfectyRegistration
  }

  const getInstallationType = async (registration) => {
    const fullScope = window.location.origin + Options.serviceWorkerScope
    const isPerfecty = typeof registration !== 'undefined' &&
      registration.active !== null &&
      /perfecty/i.test(registration.active.scriptURL)

    if (typeof registration === 'undefined' || registration.active === null || registration.active.scriptURL === '') {
      return TYPE_NOTHING
    } else if (isPerfecty && registration.scope !== fullScope) {
      return TYPE_OLD_SCOPE
    } else if (isPerfecty) {
      return TYPE_PERFECTY
    } else {
      return TYPE_CONFLICT
    }
  }

  const getPerfectyRegistration = async () => {
    return await Navigator.serviceWorker().getRegistration(Options.serviceWorkerScope)
  }

  const subscribeToPush = async () => {
    Logger.info('Subscribing to Push Notifications')
    const perfectyRegistration = await getPerfectyRegistration()
    if (perfectyRegistration === null) {
      return null
    }

    const activated = await waitActive(perfectyRegistration)
    if (!activated) {
      Logger.error('The service worker was not activated')
      return null
    }

    const subscription = await perfectyRegistration.pushManager.getSubscription()
    if (subscription !== null) {
      Logger.info('Subscription already found, skipping')
      return subscription
    }

    return await perfectyRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(Options.vapidPublicKey)
    })
  }

  const waitActive = (registration) => {
    const sw = registration.installing ?? registration.waiting ?? registration.active
    if (!sw) {
      return Promise.resolve(false)
    }

    if (sw.state === 'activated') {
      return Promise.resolve(true)
    } else {
      return new Promise((resolve) => {
        sw.addEventListener('statechange', (e) => {
          if (e.target.state === 'activated') {
            Logger.debug('Activation detected on statechange')
            resolve(true)
          }
        })
      })
    }
  }

  return {
    TYPE_NOTHING,
    TYPE_CONFLICT,
    TYPE_PERFECTY,
    TYPE_OLD_SCOPE,
    removeOldSubscription,
    removeConflicts,
    subscribeToPush,
    getInstallationType,
    installIfMissing
  }
})()

export default ServiceInstaller
