import ServiceWorker from './service_worker'
import ApiClient from './api_client'
import Logger from '../logger'
import Options from './options'

/**
 * Registration Register the Service Worker
 */
export default class Registration {
  #serviceWorker

  constructor () {
    this.#serviceWorker = new ServiceWorker()
  }

  async assureRegistration () {
    Logger.info('Ensuring registration')

    await this.#removeConflicts()
    return await this.#registerIfMissing()
  }

  async register () {
    Logger.info('Registering user')

    const pushSubscription = await this.#serviceWorker.install()
    return await ApiClient.register(pushSubscription)
  }

  async #removeConflicts () {
    if (Options.unregisterConflicts === true) {
      Logger.info('Removing conflicts')
      await this.#serviceWorker.removeConflicts()
    }
  }

  async #registerIfMissing () {
    Logger.info('Checking if the service worker is installed')
    const installedType = await this.#serviceWorker.getInstalledType()
    if (installedType === ServiceWorker.TYPE_NOTHING) {
      Logger.info('The service worker was not found, registering')
      return await this.register()
    }
    Logger.info('Service worker found')
    return false
  }
}
