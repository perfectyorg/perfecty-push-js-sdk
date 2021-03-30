import Logger from '../logger'

export default class Options {
  #pathValue = ''
  #dialogTitleValue = 'Do you want to receive notifications?'
  #dialogSubmitValue = 'Continue'
  #dialogCancelValue = 'Not now'
  #settingsTitleValue = 'Notifications preferences'
  #settingsOptInValue = 'I want to receive notifications'
  #siteUrlValue = ''
  #serverUrlValue = ''
  #vapidPublicKeyValue = ''
  #tokenHeaderValue = 'Bearer'
  #tokenValue = ''
  #enabledValue = true
  #unregisterConflictsValue = false
  #serviceWorkerScope = '/perfecty/push'
  #loggerLevel = 'error'
  #loggerVerbose = false

  get path () { return this.#pathValue }
  set path (v) { this.#pathValue = this.#getValue(v, this.#pathValue) }

  get dialogTitle () { return this.#dialogTitleValue }
  set dialogTitle (v) { this.#dialogTitleValue = this.#getValue(v, this.#dialogTitleValue) }

  get dialogSubmit () { return this.#dialogSubmitValue }
  set dialogSubmit (v) { this.#dialogSubmitValue = this.#getValue(v, this.#dialogSubmitValue) }

  get dialogCancel () { return this.#dialogCancelValue }
  set dialogCancel (v) { this.#dialogCancelValue = this.#getValue(v, this.#dialogCancelValue) }

  get settingsTitle () { return this.#settingsTitleValue }
  set settingsTitle (v) { this.#settingsTitleValue = this.#getValue(v, this.#settingsTitleValue) }

  get settingsOptIn () { return this.#settingsOptInValue }
  set settingsOptIn (v) { this.#settingsOptInValue = this.#getValue(v, this.#settingsOptInValue) }

  get siteUrl () { return this.#siteUrlValue }
  set siteUrl (v) { this.#siteUrlValue = this.#getValue(v, this.#siteUrlValue) }

  get serverUrl () { return this.#serverUrlValue }
  set serverUrl (v) { this.#serverUrlValue = this.#getValue(v, this.#serverUrlValue) }

  get vapidPublicKey () { return this.#vapidPublicKeyValue }
  set vapidPublicKey (v) { this.#vapidPublicKeyValue = this.#getValue(v, this.#vapidPublicKeyValue) }

  get tokenHeader () { return this.#tokenHeaderValue }
  set tokenHeader (v) { this.#tokenHeaderValue = this.#getValue(v, this.#tokenHeaderValue) }

  get token () { return this.#tokenValue }
  set token (v) { this.#tokenValue = this.#getValue(v, this.#tokenValue) }

  get enabled () { return this.#enabledValue }
  set enabled (v) { this.#enabledValue = this.#getValue(v, this.#enabledValue) }

  get unregisterConflicts () { return this.#unregisterConflictsValue }
  set unregisterConflicts (v) { this.#unregisterConflictsValue = this.#getValue(v, this.#unregisterConflictsValue) }

  get serviceWorkerScope () { return this.#serviceWorkerScope }
  set serviceWorkerScope (v) { this.#serviceWorkerScope = this.#getValue(v, this.#serviceWorkerScope) }

  get loggerLevel () { return this.#loggerLevel }
  set loggerLevel (v) {
    switch (this.#getValue(v, this.#loggerLevel).toLowerCase()) {
      case 'debug': this.#loggerLevel = Logger.DEBUG; break
      case 'info': this.#loggerLevel = Logger.INFO; break
      case 'warn': this.#loggerLevel = Logger.WARN; break
      case 'error': this.#loggerLevel = Logger.ERROR; break
      default: this.#loggerLevel = Logger.INFO
    }
  }

  get loggerVerbose () { return this.#loggerVerbose }
  set loggerVerbose (v) { this.#loggerVerbose = this.#getValue(v, this.#loggerVerbose) }

  constructor (custom) {
    custom = typeof custom === 'undefined' ? {} : custom

    this.path = custom.path
    this.dialogTitle = custom.dialogTitle
    this.dialogSubmit = custom.dialogSubmit
    this.dialogCancel = custom.dialogCancel
    this.settingsTitle = custom.settingsTitle
    this.settingsOptIn = custom.settingsOptIn
    this.siteUrl = custom.siteUrl
    this.serverUrl = custom.serverUrl
    this.vapidPublicKey = custom.vapidPublicKey
    this.tokenHeader = custom.tokenHeader
    this.token = custom.token
    this.enabled = custom.enabled
    this.unregisterConflicts = custom.unregisterConflicts
    this.serviceWorkerScope = custom.serviceWorkerScope
    this.loggerLevel = custom.loggerLevel
    this.loggerVerbose = custom.loggerVerbose
  }

  #getValue (customValue, defaultValue) {
    return typeof customValue !== 'undefined' && customValue !== null ? customValue : defaultValue
  }
}
