import Logger from '../logger'

const Options = (() => {
  let path = ''
  let dialogTitle = 'Do you want to receive notifications?'
  let dialogSubmit = 'Continue'
  let dialogCancel = 'Not now'
  let settingsTitle = 'Notifications preferences'
  let settingsOptIn = 'I want to receive notifications'
  let settingsUpdateError = 'Could not change the preference, please try again'
  let serverUrl = ''
  let vapidPublicKey = ''
  let tokenHeader = 'Bearer'
  let token = ''
  let enabled = true
  let unregisterConflicts = false
  let unregisterConflictsExpression = ''
  let serviceWorkerScope = '/perfecty/push'
  let loggerLevel = Logger.ERROR
  let loggerVerbose = false
  let hideBellAfterSubscribe = false
  let askPermissionsDirectly = false
  let promptIconUrl = ''
  let visitsToDisplayPrompt = 0

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
    Options.unregisterConflictsExpression = custom.unregisterConflictsExpression
    Options.serviceWorkerScope = custom.serviceWorkerScope
    Options.loggerLevel = custom.loggerLevel
    Options.loggerVerbose = custom.loggerVerbose
    Options.hideBellAfterSubscribe = custom.hideBellAfterSubscribe
    Options.askPermissionsDirectly = custom.askPermissionsDirectly
    Options.promptIconUrl = custom.promptIconUrl
    Options.visitsToDisplayPrompt = custom.visitsToDisplayPrompt
  }

  function getValue (customValue, defaultValue) {
    return typeof customValue !== 'undefined' && customValue !== null ? customValue : defaultValue
  }

  return {
    init,
    get path () { return path },
    set path (v) { path = getValue(v, path) },
    get dialogTitle () { return dialogTitle },
    set dialogTitle (v) { dialogTitle = getValue(v, dialogTitle) },
    get dialogSubmit () { return dialogSubmit },
    set dialogSubmit (v) { dialogSubmit = getValue(v, dialogSubmit) },
    get dialogCancel () { return dialogCancel },
    set dialogCancel (v) { dialogCancel = getValue(v, dialogCancel) },
    get settingsTitle () { return settingsTitle },
    set settingsTitle (v) { settingsTitle = getValue(v, settingsTitle) },
    get settingsOptIn () { return settingsOptIn },
    set settingsOptIn (v) { settingsOptIn = getValue(v, settingsOptIn) },
    get settingsUpdateError () { return settingsUpdateError },
    set settingsUpdateError (v) { settingsUpdateError = getValue(v, settingsUpdateError) },
    get serverUrl () { return serverUrl },
    set serverUrl (v) { serverUrl = getValue(v, serverUrl) },
    get vapidPublicKey () { return vapidPublicKey },
    set vapidPublicKey (v) { vapidPublicKey = getValue(v, vapidPublicKey) },
    get tokenHeader () { return tokenHeader },
    set tokenHeader (v) { tokenHeader = getValue(v, tokenHeader) },
    get token () { return token },
    set token (v) { token = getValue(v, token) },
    get enabled () { return enabled },
    set enabled (v) { enabled = getValue(v, enabled) },
    get unregisterConflicts () { return unregisterConflicts },
    set unregisterConflicts (v) { unregisterConflicts = getValue(v, unregisterConflicts) },
    get unregisterConflictsExpression () { return unregisterConflictsExpression },
    set unregisterConflictsExpression (v) { unregisterConflictsExpression = getValue(v, unregisterConflictsExpression) },
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
    set askPermissionsDirectly (v) { askPermissionsDirectly = getValue(v, askPermissionsDirectly) },
    get promptIconUrl () { return promptIconUrl },
    set promptIconUrl (v) { promptIconUrl = getValue(v, promptIconUrl) },
    get visitsToDisplayPrompt () { return visitsToDisplayPrompt },
    set visitsToDisplayPrompt (v) { visitsToDisplayPrompt = getValue(v, visitsToDisplayPrompt) }
  }
})()

export default Options
