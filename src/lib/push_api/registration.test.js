import 'regenerator-runtime/runtime'
import Registration from './registration'
import Options from './options'
import Storage from './storage'
import ServiceWorker from './service_worker'
import ApiClient from './api_client'
import SettingsControl from '../../controls/settings'

jest.mock('./storage')
jest.mock('./service_worker')
const mockApiClientRegister = jest.fn().mockReturnValueOnce(Promise.resolve({ uuid: 'mocked-uuid' }))
jest.mock('./api_client', () => {
  return jest.fn().mockImplementation(() => {
    return { register: mockApiClientRegister }
  })
})
jest.mock('../../controls/settings')

beforeEach(() => {
  Storage.mockClear()
  ServiceWorker.mockClear()
  ApiClient.mockClear()
  mockApiClientRegister.mockClear()
  SettingsControl.mockClear()
})

describe('when assuring the registration', () => {
  it('removes existing service workers that conflict', () => {
    Options.unregisterConflicts = true
    const registration = new Registration()
    registration.assureRegistration()

    const serviceWorkerInstance = ServiceWorker.mock.instances[0]
    expect(serviceWorkerInstance.removeConflicts).toHaveBeenCalledTimes(1)
    Options.unregisterConflicts = false
  })

  it('register if our service worker is missing', async () => {
    const mockInstall = jest.fn()
    ServiceWorker.mockImplementationOnce(() => {
      return {
        getInstalledType: () => { return Promise.resolve(ServiceWorker.TYPE_NOTHING) },
        install: mockInstall
      }
    })

    const registration = new Registration()
    await registration.assureRegistration()

    expect(mockInstall).toHaveBeenCalledTimes(1)
  })

  it('doesn\'t register if our service worker is present', async () => {
    const mockInstall = jest.fn()
    ServiceWorker.mockImplementationOnce(() => {
      return {
        getInstalledType: () => { return Promise.resolve(ServiceWorker.TYPE_PERFECTY) },
        install: mockInstall
      }
    })

    const registration = new Registration()
    await registration.assureRegistration()

    expect(mockInstall).toHaveBeenCalledTimes(0)
  })
})

describe('when registering the service', () => {
  it('installs the service and calls the api', async () => {
    const registration = new Registration()
    await registration.register()

    const serviceWorkerInstance = ServiceWorker.mock.instances[0]

    expect(serviceWorkerInstance.install).toHaveBeenCalledTimes(1)
    expect(mockApiClientRegister).toHaveBeenCalledTimes(1)
  })
})
