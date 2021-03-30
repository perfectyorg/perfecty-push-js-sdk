import Logger from '../logger'

export default class ApiClient {
  #options

  constructor (options) {
    this.#options = options
  }

  async register (pushSubscription) {
    Logger.info('Registering user in the server')

    const path = `${this.#options.serverUrl}/v1/public/users`
    const bodyContent = JSON.stringify({
      user: pushSubscription
    })

    const body = await fetch(path, {
      method: 'post',
      headers: this.#getHeaders(),
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

  async updatePreferences (userId, isActive) {
    Logger.info('Updating user preferences')
    Logger.debug(`User: ${userId}, isActive: ${isActive}`)

    const path = `${this.#options.serverUrl}/v1/public/users/${userId}/preferences`
    const bodyContent = JSON.stringify({
      user_id: userId,
      is_active: isActive
    })

    const body = await fetch(path, {
      method: 'post',
      headers: this.#getHeaders(),
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

  #getHeaders () {
    const headers = {
      'Content-Type': 'application/json'
    }
    headers[this.#options.tokenHeader] = this.#options.token
    return headers
  }
}
