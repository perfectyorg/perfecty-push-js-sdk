import ServiceInstaller from './service_installer'
import ApiClient from './api_client'
import Logger from '../logger'
import Storage from './storage'
import SettingsControl from '../../controls/settings'

/**
 * Handle the User Registration
 */
const Registration = (() => {
  const check = async () => {
    Logger.info('Checking user registration')
    if (Storage.userId() === null || Storage.shouldRegisterUser()) {
      Logger.info('User was not found, registering')
      await register()
    } else {
      Logger.info('User is already registered')
    }
  }

  const register = async () => {
    Logger.info('Registering user')

    const pushSubscription = await ServiceInstaller.subscribeToPush()
    if (pushSubscription !== null) {
      Logger.info('Sending user registration')
      const response = await ApiClient.register(Storage.userId(), pushSubscription)
      if (response !== false) {
        Storage.setIsUserActive(response.is_active)
        Storage.setUserId(response.uuid)
        Storage.setShouldRegisterUser(false)
        SettingsControl.setCheckboxActive(response.is_active)
      }
    } else {
      Logger.info('No Push Subscription was found')
    }
  }

  return {
    check,
    register
  }
})()

export default Registration
