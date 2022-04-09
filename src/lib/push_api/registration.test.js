import 'regenerator-runtime/runtime'
import Registration from './registration'
import ServiceInstaller from './service_installer'
import ApiClient from './api_client'
import Storage from './storage'
import SettingsControl from '../../controls/settings'

jest.mock('./service_installer', () => ({
  subscribeToPush: jest.fn(() => ({ mocked: 'test' }))
}))
jest.mock('./api_client', () => ({
  register: jest.fn(() => Promise.resolve({ id: 'mocked-uuid' })),
  getUser: jest.fn(() => Promise.resolve({ id: 'mocked-uuid' }))
}))
jest.mock('../../controls/settings')
jest.mock('./storage')

beforeEach(() => {
  ServiceInstaller.subscribeToPush.mockClear()
  ApiClient.register.mockClear()
  ApiClient.getUser.mockClear()
  Storage.setUserId.mockClear()
  Storage.userId.mockClear()
  Storage.shouldRegisterUser.mockClear()
  SettingsControl.userSubscribed.mockClear()
})

describe('when checking the registration', () => {
  it('skips the registration if the user is found', async () => {
    await Registration.check('existing-uuid', false)
    expect(ServiceInstaller.subscribeToPush).toHaveBeenCalledTimes(0)
    expect(ApiClient.register).toHaveBeenCalledTimes(0)
  })
  it('skips the registration if the user is not found (null) but has optedOut', async () => {
    await Registration.check(null, true)
    expect(ServiceInstaller.subscribeToPush).toHaveBeenCalledTimes(0)
    expect(ApiClient.register).toHaveBeenCalledTimes(0)
  })
  it('register the user if it is not found (shouldRegisterUser)', async () => {
    Storage.shouldRegisterUser.mockImplementationOnce(() => true)
    await Registration.check('existing-uuid', false)
    expect(ServiceInstaller.subscribeToPush).toHaveBeenCalledTimes(1)
    expect(ApiClient.register).toHaveBeenCalledTimes(1)
  })
})

describe('when registering the user', () => {
  it('calls the api and checks the opt in checkbox', async () => {
    await Registration.register(null)

    expect(ServiceInstaller.subscribeToPush).toHaveBeenCalledTimes(1)
    expect(ApiClient.register).toHaveBeenCalledTimes(1)
    expect(Storage.setUserId).toHaveBeenNthCalledWith(1, 'mocked-uuid')
    expect(SettingsControl.userSubscribed).toHaveBeenNthCalledWith(1)
  })
  it('calls the api but doesn\'t set the storage values if result = false', async () => {
    ApiClient.register.mockImplementationOnce(() => Promise.resolve(false))
    await Registration.register(null)

    expect(ServiceInstaller.subscribeToPush).toHaveBeenCalledTimes(1)
    expect(ApiClient.register).toHaveBeenCalledTimes(1)
    expect(Storage.setUserId).toHaveBeenCalledTimes(0)
  })
  it('doesn\'t call the api if there\'s no push subscription', async () => {
    ServiceInstaller.subscribeToPush.mockImplementationOnce(() => null)
    await Registration.register(null)

    expect(ApiClient.register).toHaveBeenCalledTimes(0)
    expect(Storage.setUserId).toHaveBeenCalledTimes(0)
  })
})
