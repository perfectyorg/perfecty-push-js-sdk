import Options from './options'
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

it('create', () => {
  const options = new Options()

  expect(areEqual(defaultOptions, options)).toEqual(true)
})

it('create with custom args', () => {
  const custom = {
    dialogTitle: 'Test title'
  }
  const options = new Options(custom)

  const expected = { ...defaultOptions, dialogTitle: 'Test title' }
  expect(areEqual(expected, options)).toEqual(true)
})

it('create with custom args, ignore unknown', () => {
  const custom = {
    dialogTitle: 'Test title',
    unknownProperty: 'Unknown'
  }
  const options = new Options(custom)

  const expected = { ...defaultOptions, dialogTitle: 'Test title' }
  expect(areEqual(expected, options)).toEqual(true)
})

function areEqual (expected, value) {
  expect(expected.path).toEqual(value.path)
  expect(expected.dialogTitle).toEqual(value.dialogTitle)
  expect(expected.dialogSubmit).toEqual(value.dialogSubmit)
  expect(expected.dialogCancel).toEqual(value.dialogCancel)
  expect(expected.settingsTitle).toEqual(value.settingsTitle)
  expect(expected.settingsOptIn).toEqual(value.settingsOptIn)
  expect(expected.siteUrl).toEqual(value.siteUrl)
  expect(expected.serverUrl).toEqual(value.serverUrl)
  expect(expected.vapidPublicKey).toEqual(value.vapidPublicKey)
  expect(expected.tokenHeader).toEqual(value.tokenHeader)
  expect(expected.token).toEqual(value.token)
  expect(expected.enabled).toEqual(value.enabled)
  expect(expected.unregisterConflicts).toEqual(value.unregisterConflicts)
  expect(expected.serviceWorkerScope).toEqual(value.serviceWorkerScope)
  expect(expected.loggerLevel).toEqual(value.loggerLevel)
  expect(expected.loggerVerbose).toEqual(value.loggerVerbose)
  return true
}
