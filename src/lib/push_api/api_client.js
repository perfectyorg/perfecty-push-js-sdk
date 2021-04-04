import Logger from '../logger'
import Options from './options'

const ApiClient = (() => {
  const register = async (pushSubscription) => {
    Logger.info('Registering user in the server')

    const path = `${Options.serverUrl}/v1/public/users`
    const bodyContent = JSON.stringify({
      user: pushSubscription
    })

    const body = await fetch(path, {
      method: 'post',
      headers: getHeaders(),
      body: bodyContent
    })
    const response = await body.json()
    Logger.debug('response', response)

    if (response && response.success && response.success === true) {
      Logger.info('The user was registered successfully')
      return response
    } else {
      Logger.error('The user could not be registered')
      return false
    }
  }

  const updatePreferences = async (userId, isActive) => {
    Logger.info('Updating user preferences')
    Logger.debug(`User: ${userId}, isActive: ${isActive}`)

    const path = `${Options.serverUrl}/v1/public/users/${userId}/preferences`
    const bodyContent = JSON.stringify({
      is_active: isActive
    })

    const body = await fetch(path, {
      method: 'post',
      headers: getHeaders(),
      body: bodyContent
    })
    const response = await body.json()
    Logger.debug('response', response)

    if (response && response.success && response.success === true) {
      Logger.info('The user preferences were changed')
      return true
    } else {
      Logger.info('The user preferences could not be changed')
      return false
    }
  }

  const getHeaders = () => {
    const headers = {
      'Content-Type': 'application/json'
    }
    headers[Options.tokenHeader] = Options.token
    return headers
  }

  return {
    register,
    updatePreferences
  }
})()

export default ApiClient
