import 'regenerator-runtime/runtime'
import Permission from './lib/push_api/permission'
import Features from './lib/push_api/features'
import Registration from './lib/push_api/registration'
import Storage from './lib/push_api/storage'
import DialogControl from './controls/dialog'
import SettingsControl from './controls/settings'
import PerfectyPush from './app'
import Options from './lib/push_api/options'

jest.mock('./lib/push_api/permission', () => ({
  __esModule: true,
  default: {
    isGranted: jest.fn(() => true)
  }
}))

jest.mock('./lib/push_api/features', () => ({
  isSupported: jest.fn(() => true)
}))
jest.mock('./lib/push_api/registration', () => ({
  assureRegistration: jest.fn(() => Promise.resolve({ uuid: 'mocked-uuid' }))
}))
jest.mock('./lib/push_api/storage')
jest.mock('./controls/dialog')
jest.mock('./controls/settings')

describe('when the app is started', () => {
  beforeEach(() => {
    Permission.isGranted.mockClear()
    Features.isSupported.mockClear()
    Registration.assureRegistration.mockClear()
    Storage.mockClear()
    DialogControl.mockClear()
    SettingsControl.mockClear()
    Options.enabled = true
  })

  it('works with supported features and enabled', async () => {
    const app = new PerfectyPush()
    const result = await app.start()
    expect(result).toEqual(true)
  })

  it('doesn\'t start if disabled', async () => {
    const app = new PerfectyPush({ enabled: false })
    const result = await app.start()
    expect(result).toEqual(false)
  })

  it('doesn\'t start if unsupported features', async () => {
    Features.isSupported.mockImplementationOnce(() => false)

    const app = new PerfectyPush()
    const result = await app.start()
    expect(result).toEqual(false)
    expect(Features.isSupported).toHaveBeenCalledTimes(1)
  })

  it('draws the controls', async () => {
    const app = new PerfectyPush()
    const result = await app.start()

    const dialogInstance = DialogControl.mock.instances[0]
    const settingsInstance = SettingsControl.mock.instances[0]

    expect(result).toEqual(true)
    expect(dialogInstance.draw).toHaveBeenCalledTimes(1)
    expect(settingsInstance.draw).toHaveBeenCalledTimes(1)
  })

  it('register service if permission granted', async () => {
    const app = new PerfectyPush()
    const result = await app.start()

    const storageInstance = Storage.mock.instances[0]
    const settingsControlInstance = SettingsControl.mock.instances[0]
    expect(result).toEqual(true)
    expect(Registration.assureRegistration).toHaveBeenCalledTimes(1)
    expect(storageInstance.setUserId).toHaveBeenCalledTimes(1)
    expect(settingsControlInstance.setCheckboxActive).toHaveBeenCalledTimes(1)
  })

  it('register service if permission granted but unsuccessful', async () => {
    Registration.assureRegistration.mockImplementationOnce(() => Promise.resolve(false))

    const app = new PerfectyPush()
    const result = await app.start()

    const storageInstance = Storage.mock.instances[0]
    const settingsControlInstance = SettingsControl.mock.instances[0]
    expect(result).toEqual(true)
    expect(storageInstance.setUserId).toHaveBeenCalledTimes(0)
    expect(settingsControlInstance.setActive).toHaveBeenCalledTimes(0)
    expect(Registration.assureRegistration).toHaveBeenCalledTimes(1)
  })

  it('doesn\'t register service if permission is not granted', async () => {
    Permission.isGranted.mockImplementationOnce(() => false)

    const app = new PerfectyPush()
    const result = await app.start()

    expect(result).toEqual(true)
    expect(Registration.assureRegistration).toHaveBeenCalledTimes(0)
  })
})
