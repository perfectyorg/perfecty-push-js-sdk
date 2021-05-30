import ServiceInstaller from './service_installer'
import ApiClient from './api_client'
import Logger from '../logger'
import Storage from './storage'
import SettingsControl from '../../controls/settings'

/**
 * Handle the User Registration
 */
const Registration = (() => {
  const check = async (userId) => {
    Logger.info('Checking user registration')
    if (userId === null || Storage.shouldRegisterUser()) {
      Logger.info('User was not found, registering')
      await register(userId)
    } else {
      Logger.info('User is already registered')
    }
  }

  const register = async (userId) => {
    Logger.info('Registering user')

    const pushSubscription = await ServiceInstaller.subscribeToPush()
    if (pushSubscription !== null) {
      Logger.info('Sending user registration')
      const response = await ApiClient.register(userId, pushSubscription)
      if (response !== false) {
        Storage.setUserId(response.uuid)
        Storage.setShouldRegisterUser(false)
        SettingsControl.userSubscribed()

        return response
      }
    } else {
      Logger.info('No Push Subscription was found')
    }
    return false
  }

  const unregister = async (userId) => {
    Logger.info('Unregistering user')

    const response = await ApiClient.unregister(userId)
    if (response !== false) {
      await ServiceInstaller.removeInstallation()
    }

    Logger.debug('Response: ', response)
    return response
  }

  return {
    check,
    register,
    unregister
  }
})()

export default Registration
