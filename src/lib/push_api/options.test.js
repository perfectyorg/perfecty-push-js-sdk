import Logger from '../logger'

const defaultOptions = {
  path: '',
  dialogTitle: 'Do you want to receive notifications?',
  dialogSubmit: 'Continue',
  dialogCancel: 'Not now',
  settingsTitle: 'Notifications preferences',
  settingsOptIn: 'I want to receive notifications',
  siteUrl: '',
  serverUrl: '',
  vapidPublicKey: '',
  tokenHeader: 'Bearer',
  token: '',
  enabled: true,
  unregisterConflicts: false,
  serviceWorkerScope: '/perfecty/push',
  loggerLevel: Logger.ERROR,
  loggerVerbose: false
}

describe('options', () => {
  let Options

  beforeEach(() => {
    Options = require('./options').default
    jest.resetModules()
  })

  it('create', () => {
    expect(areEqual(Options, defaultOptions)).toEqual(true)
  })

  it('create with custom args', () => {
    const custom = {
      dialogTitle: 'Test title'
    }
    Options.init(custom)

    const expected = { ...defaultOptions, dialogTitle: 'Test title' }
    expect(areEqual(Options, expected)).toEqual(true)
  })

  it('create with custom args, ignore unknown', () => {
    const custom = {
      dialogTitle: 'Test title',
      unknownProperty: 'Unknown'
    }
    Options.init(custom)

    const expected = { ...defaultOptions, dialogTitle: 'Test title' }
    expect(areEqual(Options, expected)).toEqual(true)
  })

  function areEqual (value, expected) {
    expect(value.path).toEqual(expected.path)
    expect(value.dialogTitle).toEqual(expected.dialogTitle)
    expect(value.dialogSubmit).toEqual(expected.dialogSubmit)
    expect(value.dialogCancel).toEqual(expected.dialogCancel)
    expect(value.settingsTitle).toEqual(expected.settingsTitle)
    expect(value.settingsOptIn).toEqual(expected.settingsOptIn)
    expect(value.siteUrl).toEqual(expected.siteUrl)
    expect(value.serverUrl).toEqual(expected.serverUrl)
    expect(value.vapidPublicKey).toEqual(expected.vapidPublicKey)
    expect(value.tokenHeader).toEqual(expected.tokenHeader)
    expect(value.token).toEqual(expected.token)
    expect(value.enabled).toEqual(expected.enabled)
    expect(value.unregisterConflicts).toEqual(expected.unregisterConflicts)
    expect(value.serviceWorkerScope).toEqual(expected.serviceWorkerScope)
    expect(value.loggerLevel).toEqual(expected.loggerLevel)
    expect(value.loggerVerbose).toEqual(expected.loggerVerbose)
    return true
  }
})
