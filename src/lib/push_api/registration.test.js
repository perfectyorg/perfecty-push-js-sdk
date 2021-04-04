import 'regenerator-runtime/runtime'
import Registration from './registration'
import Options from './options'
import Storage from './storage'
import ServiceWorker from './service_worker'
import ApiClient from './api_client'
import SettingsControl from '../../controls/settings'

jest.mock('./storage')
jest.mock('./service_worker')
jest.mock('./api_client', () => ({
  register: jest.fn(() => Promise.resolve({ uuid: 'mocked-uuid' }))
}))
jest.mock('../../controls/settings')

beforeEach(() => {
  Storage.mockClear()
  ServiceWorker.removeConflicts.mockClear()
  ServiceWorker.install.mockClear()
  ApiClient.register.mockClear()
  SettingsControl.mockClear()
})

describe('when assuring the registration', () => {
  it('removes existing service workers that conflict', async () => {
    Options.unregisterConflicts = true
    await Registration.assureRegistration()

    expect(ServiceWorker.removeConflicts).toHaveBeenCalledTimes(1)
    Options.unregisterConflicts = false
  })

  it('register if our service worker is missing', async () => {
    ServiceWorker.getInstalledType.mockImplementationOnce(() => Promise.resolve(ServiceWorker.TYPE_NOTHING))

    await Registration.assureRegistration()

    expect(ServiceWorker.install).toHaveBeenCalledTimes(1)
  })

  it('doesn\'t register if our service worker is present', async () => {
    ServiceWorker.getInstalledType.mockImplementationOnce(() => Promise.resolve(ServiceWorker.TYPE_PERFECTY))

    await Registration.assureRegistration()

    expect(ServiceWorker.install).toHaveBeenCalledTimes(0)
  })
})

describe('when registering the service', () => {
  it('installs the service and calls the api', async () => {
    await Registration.register()

    expect(ServiceWorker.install).toHaveBeenCalledTimes(1)
    expect(ApiClient.register).toHaveBeenCalledTimes(1)
  })
})
