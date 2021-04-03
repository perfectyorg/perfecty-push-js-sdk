import { urlBase64ToUint8Array } from './utils'
import Logger from '../logger'
import Options from './options'

export default class ServiceWorker {
  static TYPE_NOTHING = 1
  static TYPE_CONFLICT = 2
  static TYPE_PERFECTY = 3

  #scope = '/'
  #workerContainer
  #workerValue

  constructor () {
    this.#workerContainer = navigator.serviceWorker
  }

  async removeConflicts () {
    const installedType = await this.getInstalledType()
    Logger.debug('installedType', installedType)

    if (installedType === ServiceWorker.TYPE_CONFLICT) {
      const worker = await this.#getWorker()
      await worker.unregister()
      Logger.info('Worker unregistered', worker)
    }
  }

  async install () {
    Logger.info('Installing service worker')

    const fullPath = Options.path + '/service-worker-loader.js.php'
    await this.#workerContainer.register(fullPath, { scope: this.#scope })
    const registration = await this.#getWorker()
    const pushSubscription = await this.#getPushSubscription(registration)

    Logger.debug('Registration', registration)
    Logger.debug('Push subscription', pushSubscription)
    return pushSubscription
  }

  async getInstalledType () {
    const worker = await this.#getWorker()
    if (typeof worker === 'undefined' || worker.active === null || worker.active.scriptURL === '') {
      return ServiceWorker.TYPE_NOTHING
    } else if (/perfecty/i.test(worker.active.scriptURL)) {
      return ServiceWorker.TYPE_PERFECTY
    } else {
      return ServiceWorker.TYPE_CONFLICT
    }
  }

  async #getPushSubscription (registration) {
    const subscription = await registration.pushManager.getSubscription()
    if (subscription !== null) {
      return subscription
    }

    return await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(Options.vapidPublicKey)
    })
  }

  async #getWorker () {
    if (!this.#workerValue) {
      this.#workerValue = await this.#workerContainer.getRegistration(this.#scope)
    }
    return this.#workerValue
  }
}
