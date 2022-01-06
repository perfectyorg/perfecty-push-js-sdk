import Logger from '../logger'
import Options from './options'

const ApiClient = (() => {
  const register = async (userId, pushSubscription, firstTime) => {
    Logger.info('Registering user in the server')
    if (typeof firstTime === 'undefined') {
      firstTime = false
    }

    const path = `${Options.serverUrl}/v1/webpush/${Options.siteId}/subscribers`
    const bodyContent = JSON.stringify({
      user: pushSubscription,
      user_id: userId,
      first_time: firstTime
    })

    const body = await fetch(path, {
      method: 'post',
      headers: getHeaders(),
      body: bodyContent
    })
    const response = await body.json()
    Logger.debug('response', response)

    if (response && typeof response.uuid !== 'undefined') {
      Logger.info('The user was registered successfully')
      return response
    } else {
      Logger.error('The user could not be registered')
      return false
    }
  }

  const getUser = async (userId) => {
    Logger.info('Getting the registration status from the server')

    const path = `${Options.serverUrl}/v1/webpush/${Options.siteId}/subscribers/${userId}`

    const body = await fetch(path, {
      method: 'get',
      headers: getHeaders()
    })
    if (body.ok) {
      const user = await body.json()
      Logger.debug('response', user)

      if (user && typeof user.uuid !== 'undefined') {
        Logger.info('The user was found')
        return user
      } else {
        Logger.info('The user was not found')
        return null
      }
    } else {
      Logger.debug('response', body)
      throw new Error('Could not communicate with the server')
    }
  }

  const unregister = async (userId) => {
    Logger.info('Unregistering user in the server')
    Logger.debug(`User: ${userId}`)

    const path = `${Options.serverUrl}/v1/webpush/${Options.siteId}/subscribers/${userId}/unregister`

    let success = false
    try {
      const body = await fetch(path, {
        method: 'post',
        headers: getHeaders()
      })
      success = body.ok
    } catch (e) {
      Logger.error('Could not execute the fetch operation', e)
      return false
    }

    if (success) {
      Logger.info('The user was unregistered')
      return true
    } else {
      Logger.info('The user could not be unregistered')
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
    unregister,
    getUser
  }
})()

export default ApiClient
