const Storage = (() => {
  const userIdKey = 'perfecty_user_id'
  const hasAskedNotificationsKey = 'perfecty_asked_notifications'
  const isUserActiveKey = 'perfecty_is_user_active'

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

  const getItem = (key) => {
    return localStorage.getItem(key)
  }

  const setItem = (key, value) => {
    localStorage.setItem(key, value)
  }

  return {
    setUserId,
    userId,
    setHasAskedNotifications,
    hasAskedNotifications,
    setIsUserActive,
    isUserActive
  }
})()

export default Storage
