import ServiceInstaller from './service_installer'
import ApiClient from './api_client'
import Logger from '../logger'
import Storage from './storage'
import SettingsControl from '../../controls/settings'

/**
 * Handle the User Registration
 */
const Registration = (() => {
  const STATUS_NOT_FOUND = 0
  const STATUS_ACTIVE = 1

  const check = async () => {
    Logger.info('Checking user registration')
    const status = await getStatus(Storage.userId())
    if (status === STATUS_NOT_FOUND) {
      Logger.info('User was not found in the server, registering')
      await register()
    } else {
      Logger.info('User is already registered')
    }
  }

  const getStatus = async (userId) => {
    Logger.info('Checking the subscription status')

    let status = STATUS_NOT_FOUND
    const response = await ApiClient.status(userId)
    if (response !== false && response.status === 'active') {
      status = STATUS_ACTIVE
    }
    return status
  }

  const register = async () => {
    Logger.info('Registering user')

    const pushSubscription = await ServiceInstaller.getPushSubscription()
    if (pushSubscription !== null) {
      Logger.info('Sending user registration')
      const response = await ApiClient.register(Storage.userId(), pushSubscription)
      if (response !== false) {
        Storage.setIsUserActive(response.active)
        Storage.setUserId(response.uuid)
        SettingsControl.setCheckboxActive(response.active)
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
