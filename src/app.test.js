import 'regenerator-runtime/runtime'
import Permission from './lib/push_api/permission'
import Features from './lib/push_api/features'
import Registration from './lib/push_api/registration'
import ServiceInstaller from './lib/push_api/service_installer'
import DialogControl from './controls/dialog'
import SettingsControl from './controls/settings'
import PerfectyPush from './app'
import Options from './lib/push_api/options'

jest.mock('./lib/push_api/permission', () => ({
  __esModule: true,
  default: {
    isGranted: jest.fn(() => true),
    askedAlready: jest.fn(() => false),
    askIfNotDenied: jest.fn(() => true)
  }
}))

jest.mock('./lib/push_api/features', () => ({
  isSupported: jest.fn(() => true)
}))
jest.mock('./lib/push_api/registration', () => ({
  check: jest.fn(() => Promise.resolve({ uuid: 'mocked-uuid' })),
  register: jest.fn(() => true)
}))
jest.mock('./lib/push_api/service_installer')
jest.mock('./controls/dialog')
jest.mock('./controls/settings')

let askPermissionsDirectlySpy
let visitsToDisplayPromptSpy
describe('when the app is started', () => {
  beforeEach(() => {
    Permission.isGranted.mockClear()
    Permission.askedAlready.mockClear()
    Permission.askIfNotDenied.mockClear()
    Features.isSupported.mockClear()
    Registration.check.mockClear()
    Registration.register.mockClear()
    ServiceInstaller.removeConflicts.mockClear()
    ServiceInstaller.installIfMissing.mockClear()
    DialogControl.draw.mockClear()
    SettingsControl.draw.mockClear()
    SettingsControl.setCheckboxOptIn.mockClear()
    SettingsControl.changeOptIn.mockClear()
    Options.enabled = true
    askPermissionsDirectlySpy = jest.spyOn(Options, 'askPermissionsDirectly', 'get')
    askPermissionsDirectlySpy.mockImplementation(() => false)
    visitsToDisplayPromptSpy = jest.spyOn(Options, 'visitsToDisplayPrompt', 'get')
    visitsToDisplayPromptSpy.mockImplementation(() => 0)
  })

  it('works with supported features and enabled', async () => {
    const result = await PerfectyPush.start()
    expect(result).toEqual(true)
  })

  it('doesn\'t start if disabled', async () => {
    const result = await PerfectyPush.start({ enabled: false })
    expect(result).toEqual(false)
  })

  it('doesn\'t start if unsupported features', async () => {
    Features.isSupported.mockImplementationOnce(() => false)

    const result = await PerfectyPush.start()
    expect(result).toEqual(false)
    expect(Features.isSupported).toHaveBeenCalledTimes(1)
  })

  it('skips if visitsToDisplayPrompt not reached', async () => {
    visitsToDisplayPromptSpy.mockImplementationOnce(() => 100)
    const result = await PerfectyPush.start()

    expect(result).toEqual(true)
    expect(Permission.askIfNotDenied).toHaveBeenCalledTimes(0)
    expect(DialogControl.draw).toHaveBeenCalledTimes(0)
    expect(SettingsControl.draw).toHaveBeenCalledTimes(0)
  })

  it('draws the controls', async () => {
    const result = await PerfectyPush.start()

    expect(result).toEqual(true)
    expect(DialogControl.draw).toHaveBeenCalledTimes(1)
    expect(SettingsControl.draw).toHaveBeenCalledTimes(1)
  })

  it('ask direct permissions', async () => {
    askPermissionsDirectlySpy.mockImplementationOnce(() => true)
    const result = await PerfectyPush.start()

    expect(result).toEqual(true)
    expect(DialogControl.draw).toHaveBeenCalledTimes(0)
    expect(SettingsControl.draw).toHaveBeenCalledTimes(0)
  })

  it('skips asking if permissions already granted', async () => {
    askPermissionsDirectlySpy.mockImplementationOnce(() => true)
    // the first one is for the shouldDisplayPrompt check, the second for the permission granted
    Permission.askedAlready.mockImplementationOnce(() => true)
    Permission.askedAlready.mockImplementationOnce(() => true)
    const result = await PerfectyPush.start()

    expect(result).toEqual(true)
    expect(Permission.askIfNotDenied).toHaveBeenCalledTimes(0)
    expect(DialogControl.draw).toHaveBeenCalledTimes(0)
    expect(SettingsControl.draw).toHaveBeenCalledTimes(0)
  })

  it('skips registration if permissions is denied', async () => {
    askPermissionsDirectlySpy.mockImplementationOnce(() => true)
    Permission.isGranted.mockImplementationOnce(() => false)
    const result = await PerfectyPush.start()

    expect(result).toEqual(true)
    expect(Registration.register).toHaveBeenCalledTimes(0)
    expect(DialogControl.draw).toHaveBeenCalledTimes(0)
    expect(SettingsControl.draw).toHaveBeenCalledTimes(0)
  })

  it('register and install service if permission granted', async () => {
    const result = await PerfectyPush.start()

    expect(result).toEqual(true)
    expect(Registration.check).toHaveBeenCalledTimes(1)
    expect(ServiceInstaller.installIfMissing).toHaveBeenCalledTimes(1)
  })

  it('register service if permission granted but unsuccessful', async () => {
    Registration.check.mockImplementationOnce(() => Promise.resolve(false))

    const result = await PerfectyPush.start()

    expect(result).toEqual(true)
    expect(SettingsControl.changeOptIn).toHaveBeenCalledTimes(0)
    expect(Registration.check).toHaveBeenCalledTimes(1)
  })

  it('doesn\'t register service if permission is not granted', async () => {
    Permission.isGranted.mockImplementationOnce(() => false)

    const result = await PerfectyPush.start()

    expect(result).toEqual(true)
    expect(Registration.check).toHaveBeenCalledTimes(0)
  })
})
