import 'regenerator-runtime/runtime'
import Registration from './registration'
import ServiceInstaller from './service_installer'
import ApiClient from './api_client'
import Storage from './storage'
import SettingsControl from '../../controls/settings'

jest.mock('./service_installer', () => ({
  getPushSubscription: jest.fn(() => ({ mocked: 'test' }))
}))
jest.mock('./api_client', () => ({
  register: jest.fn(() => Promise.resolve({ uuid: 'mocked-uuid', is_active: true })),
  getUser: jest.fn(() => Promise.resolve({ is_active: true }))
}))
jest.mock('../../controls/settings')
jest.mock('./storage')

beforeEach(() => {
  ServiceInstaller.getPushSubscription.mockClear()
  ApiClient.register.mockClear()
  ApiClient.getUser.mockClear()
  Storage.setUserId.mockClear()
  Storage.setIsUserActive.mockClear()
  SettingsControl.setCheckboxActive.mockClear()
})

describe('when checking the registration', () => {
  it('skips the registration if the user is found', async () => {
    await Registration.check()
    expect(ServiceInstaller.getPushSubscription).toHaveBeenCalledTimes(0)
    expect(ApiClient.register).toHaveBeenCalledTimes(0)
  })
  it('register the user if it is not found', async () => {
    ApiClient.getUser.mockImplementationOnce(() => Promise.resolve(null))
    await Registration.check()
    expect(ServiceInstaller.getPushSubscription).toHaveBeenCalledTimes(1)
    expect(ApiClient.register).toHaveBeenCalledTimes(1)
  })
  it('throws exception on unexpected error', async () => {
    ApiClient.getUser.mockImplementationOnce(() => { throw new Error('Error!') })
    const t = async () => {
      await Registration.check()
    }

    await expect(t).rejects.toThrow(new Error('Error!'))
    expect(ServiceInstaller.getPushSubscription).toHaveBeenCalledTimes(0)
    expect(ApiClient.register).toHaveBeenCalledTimes(0)
  })
})

describe('when registering the user', () => {
  it('calls the api and checks the opt in checkbox', async () => {
    await Registration.register()

    expect(ServiceInstaller.getPushSubscription).toHaveBeenCalledTimes(1)
    expect(ApiClient.register).toHaveBeenCalledTimes(1)
    expect(Storage.setIsUserActive).toHaveBeenNthCalledWith(1, true)
    expect(Storage.setUserId).toHaveBeenNthCalledWith(1, 'mocked-uuid')
    expect(SettingsControl.setCheckboxActive).toHaveBeenNthCalledWith(1, true)
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
