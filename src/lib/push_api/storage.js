const Storage = (() => {
  const userIdKey = 'perfecty_user_id'
  const hasAskedNotificationsKey = 'perfecty_asked_notifications'
  const shouldRegisterUserKey = 'perfecty_register_again'
  const optedOuKey = 'perfecty_opted_out'
  const totalVisitsKey = 'perfecty_total_visits'

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

  const setShouldRegisterUser = (value) => {
    value = value === true ? 'yes' : 'no'
    setItem(shouldRegisterUserKey, value)
  }

  const shouldRegisterUser = () => {
    const value = getItem(shouldRegisterUserKey)
    return value === 'yes'
  }

  const setOptedOut = (value) => {
    value = value === true ? 'yes' : 'no'
    setItem(optedOuKey, value)
  }

  const optedOut = () => {
    const value = getItem(optedOuKey)
    return value === 'yes'
  }

  const setTotalVisits = (visits) => {
    setItem(totalVisitsKey, visits.toString())
  }

  const totalVisits = () => {
    const value = getItem(totalVisitsKey)
    if (value === null) {
      return 0
    } else {
      return parseInt(value)
    }
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
    setShouldRegisterUser,
    shouldRegisterUser,
    setOptedOut,
    optedOut,
    setTotalVisits,
    totalVisits
  }
})()

export default Storage
