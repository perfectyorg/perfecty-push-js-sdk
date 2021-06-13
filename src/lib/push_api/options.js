import Logger from '../logger'

const Options = (() => {
  let pathValue = ''
  let dialogTitleValue = 'Do you want to receive notifications?'
  let dialogSubmitValue = 'Continue'
  let dialogCancelValue = 'Not now'
  let settingsTitleValue = 'Notifications preferences'
  let settingsOptInValue = 'I want to receive notifications'
  let settingsUpdateError = 'Could not change the preference, please try again'
  let serverUrlValue = ''
  let vapidPublicKeyValue = ''
  let tokenHeaderValue = 'Bearer'
  let tokenValue = ''
  let enabledValue = true
  let unregisterConflictsValue = false
  let serviceWorkerScope = '/perfecty/push'
  let loggerLevel = Logger.ERROR
  let loggerVerbose = false
  let hideBellAfterSubscribe = false
  let askPermissionsDirectly = false

  const init = (custom) => {
    custom = typeof custom === 'undefined' ? {} : custom

    Options.path = custom.path
    Options.dialogTitle = custom.dialogTitle
    Options.dialogSubmit = custom.dialogSubmit
    Options.dialogCancel = custom.dialogCancel
    Options.settingsTitle = custom.settingsTitle
    Options.settingsOptIn = custom.settingsOptIn
    Options.settingsUpdateError = custom.settingsUpdateError
    Options.serverUrl = custom.serverUrl
    Options.vapidPublicKey = custom.vapidPublicKey
    Options.tokenHeader = custom.tokenHeader
    Options.token = custom.token
    Options.enabled = custom.enabled
    Options.unregisterConflicts = custom.unregisterConflicts
    Options.serviceWorkerScope = custom.serviceWorkerScope
    Options.loggerLevel = custom.loggerLevel
    Options.loggerVerbose = custom.loggerVerbose
    Options.hideBellAfterSubscribe = custom.hideBellAfterSubscribe
    Options.askPermissionsDirectly = custom.askPermissionsDirectly
  }

  function getValue (customValue, defaultValue) {
    return typeof customValue !== 'undefined' && customValue !== null ? customValue : defaultValue
  }

  return {
    init,
    get path () { return pathValue },
    set path (v) { pathValue = getValue(v, pathValue) },
    get dialogTitle () { return dialogTitleValue },
    set dialogTitle (v) {
      dialogTitleValue = getValue(v, dialogTitleValue)
    },
    get dialogSubmit () { return dialogSubmitValue },
    set dialogSubmit (v) { dialogSubmitValue = getValue(v, dialogSubmitValue) },
    get dialogCancel () { return dialogCancelValue },
    set dialogCancel (v) { dialogCancelValue = getValue(v, dialogCancelValue) },
    get settingsTitle () { return settingsTitleValue },
    set settingsTitle (v) { settingsTitleValue = getValue(v, settingsTitleValue) },
    get settingsOptIn () { return settingsOptInValue },
    set settingsOptIn (v) { settingsOptInValue = getValue(v, settingsOptInValue) },
    get settingsUpdateError () { return settingsUpdateError },
    set settingsUpdateError (v) { settingsUpdateError = getValue(v, settingsUpdateError) },
    get serverUrl () { return serverUrlValue },
    set serverUrl (v) { serverUrlValue = getValue(v, serverUrlValue) },
    get vapidPublicKey () { return vapidPublicKeyValue },
    set vapidPublicKey (v) { vapidPublicKeyValue = getValue(v, vapidPublicKeyValue) },
    get tokenHeader () { return tokenHeaderValue },
    set tokenHeader (v) { tokenHeaderValue = getValue(v, tokenHeaderValue) },
    get token () { return tokenValue },
    set token (v) { tokenValue = getValue(v, tokenValue) },
    get enabled () { return enabledValue },
    set enabled (v) { enabledValue = getValue(v, enabledValue) },
    get unregisterConflicts () { return unregisterConflictsValue },
    set unregisterConflicts (v) { unregisterConflictsValue = getValue(v, unregisterConflictsValue) },
    get serviceWorkerScope () { return serviceWorkerScope },
    set serviceWorkerScope (v) { serviceWorkerScope = getValue(v, serviceWorkerScope) },
    get loggerLevel () { return loggerLevel },
    set loggerLevel (v) {
      v = (typeof v !== 'undefined' && v !== null) ? v : ''

      switch (v.toLowerCase()) {
        case 'debug': loggerLevel = Logger.DEBUG; break
        case 'info': loggerLevel = Logger.INFO; break
        case 'warn': loggerLevel = Logger.WARN; break
        case 'error': loggerLevel = Logger.ERROR; break
      }
    },
    get loggerVerbose () { return loggerVerbose },
    set loggerVerbose (v) { loggerVerbose = getValue(v, loggerVerbose) },
    get hideBellAfterSubscribe () { return hideBellAfterSubscribe },
    set hideBellAfterSubscribe (v) { hideBellAfterSubscribe = getValue(v, hideBellAfterSubscribe) },
    get askPermissionsDirectly () { return askPermissionsDirectly },
    set askPermissionsDirectly (v) { askPermissionsDirectly = getValue(v, askPermissionsDirectly) }
  }
})()

export default Options
