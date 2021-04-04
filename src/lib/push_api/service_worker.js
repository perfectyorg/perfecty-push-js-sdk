import { urlBase64ToUint8Array } from './utils'
import Logger from '../logger'
import Options from './options'

const ServiceWorker = (() => {
  const TYPE_NOTHING = 1
  const TYPE_CONFLICT = 2
  const TYPE_PERFECTY = 3

  const scope = '/'
  const workerContainer = navigator.serviceWorker
  let workerValue

  const removeConflicts = async () => {
    const installedType = await getInstalledType()
    Logger.debug('installedType', installedType)

    if (installedType === ServiceWorker.TYPE_CONFLICT) {
      const worker = await getWorker()
      await worker.unregister()
      Logger.info('Worker unregistered', worker)
    }
  }

  const install = async () => {
    Logger.info('Installing service worker')

    const fullPath = Options.path + '/service-worker-loader.js.php'
    await workerContainer.register(fullPath, { scope: scope })
    const registration = await getWorker()
    const pushSubscription = await getPushSubscription(registration)

    Logger.debug('Registration', registration)
    Logger.debug('Push subscription', pushSubscription)
    return pushSubscription
  }

  const getInstalledType = async () => {
    const worker = await getWorker()
    if (typeof worker === 'undefined' || worker.active === null || worker.active.scriptURL === '') {
      return ServiceWorker.TYPE_NOTHING
    } else if (/perfecty/i.test(worker.active.scriptURL)) {
      return ServiceWorker.TYPE_PERFECTY
    } else {
      return ServiceWorker.TYPE_CONFLICT
    }
  }

  const getPushSubscription = async (registration) => {
    const subscription = await registration.pushManager.getSubscription()
    if (subscription !== null) {
      return subscription
    }

    return await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(Options.vapidPublicKey)
    })
  }

  const getWorker = async () => {
    if (!workerValue) {
      workerValue = await workerContainer.getRegistration(scope)
    }
    return workerValue
  }

  return {
    TYPE_NOTHING,
    TYPE_CONFLICT,
    TYPE_PERFECTY,
    removeConflicts,
    install,
    getInstalledType
  }
})()

export default ServiceWorker
