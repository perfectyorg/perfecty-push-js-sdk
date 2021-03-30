import ServiceWorker from './service_worker'
import ApiClient from './api_client'
import Logger from '../logger'

/**
 * Registration Register the Service Worker
 */
export default class Registration {
  #options
  #serviceWorker
  #apiClient

  constructor (options) {
    this.#options = options
    this.#serviceWorker = new ServiceWorker(this.#options)
    this.#apiClient = new ApiClient(this.#options)
  }

  async assureRegistration () {
    await this.#removeConflicts()
    return await this.#registerIfMissing()
  }

  async register () {
    const pushSubscription = await this.#serviceWorker.install()
    return await this.#apiClient.register(pushSubscription)
  }

  async #removeConflicts () {
    if (this.#options.unregisterConflicts === true) {
      Logger.info('Removing conflicts')
      await this.#serviceWorker.removeConflicts()
    }
  }

  async #registerIfMissing () {
    const installedType = await this.#serviceWorker.getInstalledType()
    if (installedType === ServiceWorker.TYPE_NOTHING) {
      return await this.register()
    }
    return false
  }
}
