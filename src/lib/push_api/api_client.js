export default class ApiClient {
  #options

  constructor (options) {
    this.#options = options
  }

  async register (pushSubscription) {
    const path = this.#options.siteUrl + '/v1/public/users'
    const bodyContent = JSON.stringify({
      user: pushSubscription
    })

    const body = await fetch(path, {
      method: 'put',
      headers: this.#getHeaders(),
      body: bodyContent
    })
    const response = await body.json()
    if (response && response.success && response.success === true) {
      return response
    } else {
      return false
    }
  }

  async updatePreferences (userId, isActive) {
    const path = `${this.#options.siteUrl}/public/users/${userId}/preferences`
    const bodyContent = JSON.stringify({
      user_id: userId,
      is_active: isActive
    })

    const body = await fetch(path, {
      method: 'put',
      headers: this.#getHeaders(),
      body: bodyContent
    })
    const response = await body.json()
    if (response && response.success && response.success === true) {
      return true
    } else {
      return false
    }
  }

  #getHeaders () {
    const headers = {
      'Content-type': 'application/json'
    }
    headers[this.#options.tokenHeader] = this.#options.token
    return headers
  }
}
