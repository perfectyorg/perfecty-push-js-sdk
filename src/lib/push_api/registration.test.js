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
  register: jest.fn(() => Promise.resolve({ uuid: 'mocked-uuid', is_active: true, disabled: false })),
  getUser: jest.fn(() => Promise.resolve({ is_active: true, disabled: false }))
}))
jest.mock('../../controls/settings')
jest.mock('./storage')

beforeEach(() => {
  ServiceInstaller.subscribeToPush.mockClear()
  ApiClient.register.mockClear()
  ApiClient.getUser.mockClear()
  Storage.setUserId.mockClear()
  Storage.setIsUserActive.mockClear()
  Storage.userId.mockClear()
  Storage.shouldRegisterUser.mockClear()
  SettingsControl.setCheckboxActive.mockClear()
})

describe('when checking the registration', () => {
  it('skips the registration if the user is found', async () => {
    Storage.userId.mockImplementationOnce(() => 'existing-uuid')
    await Registration.check()
    expect(ServiceInstaller.subscribeToPush).toHaveBeenCalledTimes(0)
    expect(ApiClient.register).toHaveBeenCalledTimes(0)
  })
  it('register the user if it is not found (null)', async () => {
    Storage.userId.mockImplementationOnce(() => null)
    await Registration.check()
    expect(ServiceInstaller.subscribeToPush).toHaveBeenCalledTimes(1)
    expect(ApiClient.register).toHaveBeenCalledTimes(1)
  })
  it('register the user if it is not found (shouldRegisterUser)', async () => {
    Storage.userId.mockImplementationOnce(() => 'existing-uuid')
    Storage.shouldRegisterUser.mockImplementationOnce(() => true)
    await Registration.check()
    expect(ServiceInstaller.subscribeToPush).toHaveBeenCalledTimes(1)
    expect(ApiClient.register).toHaveBeenCalledTimes(1)
  })
})

describe('when registering the user', () => {
  it('calls the api and checks the opt in checkbox', async () => {
    await Registration.register()

    expect(ServiceInstaller.subscribeToPush).toHaveBeenCalledTimes(1)
    expect(ApiClient.register).toHaveBeenCalledTimes(1)
    expect(Storage.setIsUserActive).toHaveBeenNthCalledWith(1, true)
    expect(Storage.setUserId).toHaveBeenNthCalledWith(1, 'mocked-uuid')
    expect(SettingsControl.setCheckboxActive).toHaveBeenNthCalledWith(1, true)
  })
  it('calls the api but doesn\'t set the storage values if result = false', async () => {
    ApiClient.register.mockImplementationOnce(() => Promise.resolve(false))
    await Registration.register()

    expect(ServiceInstaller.subscribeToPush).toHaveBeenCalledTimes(1)
    expect(ApiClient.register).toHaveBeenCalledTimes(1)
    expect(Storage.setIsUserActive).toHaveBeenCalledTimes(0)
  })
  it('doesn\'t call the api if there\'s no push subscription', async () => {
    ServiceInstaller.subscribeToPush.mockImplementationOnce(() => null)
    await Registration.register()

    expect(ApiClient.register).toHaveBeenCalledTimes(0)
    expect(Storage.setIsUserActive).toHaveBeenCalledTimes(0)
  })
})
