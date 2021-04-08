import { urlBase64ToUint8Array } from './utils'
import Logger from '../logger'
import Options from './options'

const ServiceInstaller = (() => {
  const TYPE_NOTHING = 1
  const TYPE_CONFLICT = 2
  const TYPE_PERFECTY = 3

  const workerContainer = navigator.serviceWorker

  const removeConflicts = async () => {
    const installedType = await getInstallationType()
    Logger.debug('installedType', installedType)

    if (installedType === TYPE_CONFLICT) {
      const worker = await getRegistration()
      await worker.unregister()
      Logger.info('Worker unregistered', worker)
    }
  }

  const installIfMissing = async () => {
    const installedType = await getInstallationType()
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
    await workerContainer.register(fullPath, { scope: Options.serviceWorkerScope })
    const registration = await getRegistration()

    Logger.info('Service Worker was installed')
    Logger.debug('Registration', registration)

    return registration
  }

  const getInstallationType = async () => {
    const registration = await getRegistration()
    if (typeof registration === 'undefined' || registration.active === null || registration.active.scriptURL === '') {
      return TYPE_NOTHING
    } else if (/perfecty/i.test(registration.active.scriptURL)) {
      return TYPE_PERFECTY
    } else {
      return TYPE_CONFLICT
    }
  }

  const getRegistration = async () => {
    return await workerContainer.getRegistration(Options.serviceWorkerScope)
  }

  const getPushSubscription = async () => {
    const registration = await getRegistration()
    if (registration === null) {
      return null
    }

    const activated = await waitActive(registration)
    if (!activated) {
      Logger.error('The service worker was not activated')
      return null
    }

    const subscription = await registration.pushManager.getSubscription()
    if (subscription !== null) {
      return subscription
    }

    return await registration.pushManager.subscribe({
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
    removeConflicts,
    getPushSubscription,
    getInstallationType,
    installIfMissing
  }
})()

export default ServiceInstaller
