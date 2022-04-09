import ServiceInstaller from './service_installer'
import ApiClient from './api_client'
import Logger from '../logger'
import Storage from './storage'
import SettingsControl from '../../controls/settings'
import Options from './options'

/**
 * Handle the User Registration
 */
const Registration = (() => {
  const check = async (userId, optedOut) => {
    Logger.info('Checking user registration')
    if (Storage.shouldRegisterUser()) {
      Logger.info('User should be registered, registering')
      await register(userId)
    } else {
      Logger.info('User should not be registered again')
      Logger.debug('Values:', { userId: userId, optedOut: optedOut })
    }
  }

  const register = async (userId, firstTime) => {
    Logger.info('Registering user')

    const pushSubscription = await ServiceInstaller.subscribeToPush()
    if (pushSubscription !== null) {
      Logger.info('Sending user registration')
      const response = await ApiClient.register(userId, pushSubscription, firstTime)
      if (response !== false) {
        Storage.setUserId(response.id)
        Storage.setShouldRegisterUser(false)

        if (!Options.askPermissionsDirectly) {
          SettingsControl.userSubscribed()
        }

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
