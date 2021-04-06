import 'regenerator-runtime/runtime'
import Registration from './registration'
import ServiceInstaller from './service_installer'
import ApiClient from './api_client'
import Storage from './storage'

jest.mock('./service_installer', () => ({
  getPushSubscription: jest.fn(() => ({ mocked: 'test' }))
}))
jest.mock('./api_client', () => ({
  register: jest.fn(() => Promise.resolve({ uuid: 'mocked-uuid' })),
  status: jest.fn(() => Promise.resolve({ status: 'active' }))
}))
jest.mock('../../controls/settings')
jest.mock('./storage')

beforeEach(() => {
  ServiceInstaller.getPushSubscription.mockClear()
  ApiClient.register.mockClear()
  ApiClient.status.mockClear()
  Storage.setUserId.mockClear()
  Storage.setIsUserActive.mockClear()
})

describe('when checking the registration', () => {
  it('skips the registration if the user is found', async () => {
    await Registration.check()
    expect(ServiceInstaller.getPushSubscription).toHaveBeenCalledTimes(0)
  })
  it('register the user if it is not found', async () => {
    ApiClient.status.mockImplementationOnce(() => Promise.resolve(false))
    await Registration.check()
    expect(ServiceInstaller.getPushSubscription).toHaveBeenCalledTimes(1)
    expect(ApiClient.register).toHaveBeenCalledTimes(1)
  })
})

describe('when registering the user', () => {
  it('calls the api', async () => {
    await Registration.register()

    expect(ServiceInstaller.getPushSubscription).toHaveBeenCalledTimes(1)
    expect(ApiClient.register).toHaveBeenCalledTimes(1)
    expect(Storage.setIsUserActive).toHaveBeenCalledTimes(1)
    expect(Storage.setUserId).toHaveBeenCalledTimes(1)
  })
  it('calls the api but doesn\'t set the storage values if result = false', async () => {
    ApiClient.register.mockImplementationOnce(() => Promise.resolve(false))
    await Registration.register()

    expect(ServiceInstaller.getPushSubscription).toHaveBeenCalledTimes(1)
    expect(ApiClient.register).toHaveBeenCalledTimes(1)
    expect(Storage.setIsUserActive).toHaveBeenCalledTimes(0)
  })
  it('doesn\'t call the api if there\'s no push subscription', async () => {
    ServiceInstaller.getPushSubscription.mockImplementationOnce(() => null)
    await Registration.register()

    expect(ApiClient.register).toHaveBeenCalledTimes(0)
    expect(Storage.setIsUserActive).toHaveBeenCalledTimes(0)
  })
})
