export default class Storage {
  #userIdKey = 'perfecty_user_id'
  #hasAskedNotificationsKey = 'perfecty_asked_notifications'
  #isUserActiveKey = 'perfecty_is_user_active'

  setUserId (id) {
    this.#setItem(this.#userIdKey, id)
  }

  userId () {
    return this.#getItem(this.#userIdKey)
  }

  setHasAskedNotifications (value) {
    value = value === true ? 'yes' : 'no'
    this.#setItem(this.#hasAskedNotificationsKey, value)
  }

  hasAskedNotifications () {
    const value = this.#getItem(this.#hasAskedNotificationsKey)
    return value === 'yes'
  }

  setIsUserActive (value) {
    value = value === true ? 'yes' : 'no'
    this.#setItem(this.#isUserActiveKey, value)
  }

  isUserActive () {
    const value = this.#getItem(this.#isUserActiveKey)
    return value === 'yes'
  }

  #getItem (key) {
    return localStorage.getItem(key)
  }

  #setItem (key, value) {
    localStorage.setItem(key, value)
  }
}
