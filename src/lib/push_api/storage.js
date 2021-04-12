const Storage = (() => {
  const userIdKey = 'perfecty_user_id'
  const hasAskedNotificationsKey = 'perfecty_asked_notifications'
  const isUserActiveKey = 'perfecty_is_user_active'
  const shouldRegisterUserKey = 'perfecty_register_again'

  const setUserId = (id) => {
    setItem(userIdKey, id)
  }

  const userId = () => {
    return getItem(userIdKey)
  }

  const setHasAskedNotifications = (value) => {
    value = value === true ? 'yes' : 'no'
    setItem(hasAskedNotificationsKey, value)
  }

  const hasAskedNotifications = () => {
    const value = getItem(hasAskedNotificationsKey)
    return value === 'yes'
  }

  const setIsUserActive = (value) => {
    value = value === true ? 'yes' : 'no'
    setItem(isUserActiveKey, value)
  }

  const isUserActive = () => {
    const value = getItem(isUserActiveKey)
    return value === 'yes'
  }

  const setShouldRegisterUser = (value) => {
    value = value === true ? 'yes' : 'no'
    setItem(shouldRegisterUserKey, value)
  }

  const shouldRegisterUser = () => {
    const value = getItem(shouldRegisterUserKey)
    return value === 'yes'
  }

  const getItem = (key) => {
    return localStorage.getItem(key)
  }

  const setItem = (key, value) => {
    if (value === null) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, value)
    }
  }

  return {
    setUserId,
    userId,
    setHasAskedNotifications,
    hasAskedNotifications,
    setIsUserActive,
    isUserActive,
    setShouldRegisterUser,
    shouldRegisterUser
  }
})()

export default Storage
