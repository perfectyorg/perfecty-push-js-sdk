import 'regenerator-runtime/runtime'
import Options from './options'
import ApiClient from './api_client'
import Storage from './storage'
import Navigator from './navigator'
import ServiceInstaller from './service_installer'

jest.mock('./api_client', () => ({
  getUser: jest.fn(() => Promise.resolve({ uuid: 'user-uuid' }))
}))
jest.mock('./storage')
jest.mock('./navigator')

let unregisterConflictsSpy
let unregisterConflictsExpressionSpy

beforeEach(() => {
  ApiClient.getUser.mockClear()
  Navigator.serviceWorker.mockClear()
  unregisterConflictsSpy = jest.spyOn(Options, 'unregisterConflicts', 'get')
  unregisterConflictsExpressionSpy = jest.spyOn(Options, 'unregisterConflictsExpression', 'get')
  unregisterConflictsSpy.mockImplementation(() => false)
  unregisterConflictsExpressionSpy.mockImplementation(() => '')
})

describe('when removing installations', () => {
  it('is unregistered for old user subscriptions', async () => {
    const mockUnregister = jest.fn().mockReturnValue(Promise.resolve(true))
    const serviceWorkerRegistration = {
      active: {
        scriptURL: 'http://mytest.com'
      },
      unregister: mockUnregister
    }
    const mockGetRegistration = jest.fn().mockReturnValueOnce(Promise.resolve(serviceWorkerRegistration))
    Navigator.serviceWorker.mockImplementationOnce(() => ({
      getRegistration: mockGetRegistration
    }))
    Storage.userId.mockImplementationOnce(() => 'existing-user-uuid')
    ApiClient.getUser.mockImplementationOnce(() => Promise.resolve(null))

    await ServiceInstaller.removeOldSubscription()

    expect(mockGetRegistration).toHaveBeenCalledTimes(1)
    expect(mockUnregister).toHaveBeenCalledTimes(1)
  })

  it('throws exception in old subscriptions error', async () => {
    Storage.userId.mockImplementationOnce(() => 'existing-user-uuid')
    ApiClient.getUser.mockImplementationOnce(() => { throw new Error('Error!') })

    const t = async () => {
      await ServiceInstaller.removeOldSubscription()
    }

    await expect(t).rejects.toThrow(new Error('Error!'))
  })

  it('is not unregistered for valid user subscriptions', async () => {
    const mockGetRegistration = jest.fn()
    Navigator.serviceWorker.mockImplementationOnce(() => ({
      getRegistration: mockGetRegistration
    }))

    Storage.setUserId('user-uuid')
    await ServiceInstaller.removeOldSubscription()
    Storage.setUserId(null)

    expect(mockGetRegistration).toHaveBeenCalledTimes(0)
    Navigator.serviceWorker.mockReset()
  })

  it('is unregistered on conflicts', async () => {
    const mockUnregister = jest.fn().mockReturnValue(Promise.resolve(true))
    const serviceWorkerRegistration = {
      active: {
        scriptURL: 'http://mytest.com/OneSignal'
      },
      unregister: mockUnregister
    }
    const mockGetRegistrations = jest.fn().mockReturnValueOnce(Promise.resolve([serviceWorkerRegistration]))
    Navigator.serviceWorker.mockImplementationOnce(() => ({
      getRegistrations: mockGetRegistrations
    }))
    unregisterConflictsSpy.mockImplementationOnce(() => true)
    unregisterConflictsExpressionSpy.mockImplementationOnce(() => 'OneSignal')

    await ServiceInstaller.removeConflicts()

    expect(mockGetRegistrations).toHaveBeenCalledTimes(1)
    expect(mockUnregister).toHaveBeenCalledTimes(1)
  })

  it('is unregistered on old scope installations', async () => {
    const mockUnregister = jest.fn().mockReturnValue(Promise.resolve(true))
    const serviceWorkerRegistration = {
      active: {
        scriptURL: 'http://mytest.com/perfecty/'
      },
      scope: 'http://localhost/perfecty/push/old/scope',
      unregister: mockUnregister
    }
    const mockGetRegistrations = jest.fn().mockReturnValue(Promise.resolve([serviceWorkerRegistration]))
    Navigator.serviceWorker.mockImplementationOnce(() => ({
      getRegistrations: mockGetRegistrations
    }))

    await ServiceInstaller.removeConflicts()

    expect(mockGetRegistrations).toHaveBeenCalledTimes(1)
    expect(mockUnregister).toHaveBeenCalledTimes(1)
  })

  it('is not unregistered if there\'s no conflict', async () => {
    const mockUnregister = jest.fn().mockReturnValue(Promise.resolve(true))
    const serviceWorkerRegistration = {
      active: {
        scriptURL: 'http://mytest.com/perfecty/'
      },
      scope: 'http://localhost/perfecty/push',
      unregister: mockUnregister
    }
    const mockGetRegistrations = jest.fn().mockReturnValue(Promise.resolve([serviceWorkerRegistration]))
    Navigator.serviceWorker.mockImplementationOnce(() => ({
      getRegistrations: mockGetRegistrations
    }))

    await ServiceInstaller.removeConflicts()

    expect(mockGetRegistrations).toHaveBeenCalledTimes(1)
    expect(mockUnregister).toHaveBeenCalledTimes(0)
  })
})

describe('when installing', () => {
  it('registers and returns the service worker registration', async () => {
    const serviceWorkerRegistration = {
      active: {
        scriptURL: 'http://mytest.com/perfecty-push-sdk.js'
      }
    }
    const mockRegister = jest.fn().mockReturnValue(Promise.resolve())
    const mockGetRegistration = jest.fn()
      .mockReturnValueOnce(Promise.resolve({ active: null }))
      .mockReturnValueOnce(Promise.resolve(serviceWorkerRegistration))
    Navigator.serviceWorker.mockImplementation(() => ({
      register: mockRegister,
      getRegistration: mockGetRegistration
    }))

    const result = await ServiceInstaller.installIfMissing()

    expect(result).toEqual({
      active: { scriptURL: 'http://mytest.com/perfecty-push-sdk.js' }
    })
    expect(mockRegister).toHaveBeenCalledTimes(1)
  })

  it('doesn\'t perform the registration when already installed', async () => {
    const serviceWorkerRegistration = {
      active: { scriptURL: 'http://mytest.com/perfecty-push-sdk.js' },
      scope: 'http://localhost/perfecty/push'
    }
    const mockRegister = jest.fn().mockReturnValue(Promise.resolve())
    const mockGetRegistration = jest.fn().mockReturnValueOnce(Promise.resolve(serviceWorkerRegistration))
    Navigator.serviceWorker.mockImplementationOnce(() => ({
      register: mockRegister,
      getRegistration: mockGetRegistration
    }))

    const result = await ServiceInstaller.installIfMissing()

    expect(result).toBe(false)
    expect(mockRegister).toHaveBeenCalledTimes(0)
    Navigator.serviceWorker.mockReset()
  })
})

describe('when getting the installation type', () => {
  it('detects if there\'s no installation', async () => {
    const serviceWorkerRegistration = {
      active: {
        scriptURL: ''
      }
    }

    const result = await ServiceInstaller.getInstallationType(serviceWorkerRegistration)

    expect(result).toEqual(ServiceInstaller.TYPE_NOTHING)
  })

  it('detects if perfecty is installed', async () => {
    const serviceWorkerRegistration = {
      active: {
        scriptURL: 'http://mytest.com/perfecty-push-sdk.js'
      },
      scope: 'http://localhost/perfecty/push'
    }

    const result = await ServiceInstaller.getInstallationType(serviceWorkerRegistration)

    expect(result).toEqual(ServiceInstaller.TYPE_PERFECTY)
  })

  it('detects if perfecty is installed with an old scope', async () => {
    const serviceWorkerRegistration = {
      active: {
        scriptURL: 'http://mytest.com/perfecty-push-sdk.js'
      },
      scope: 'http://localhost/perfecty/push/old/scope'
    }

    const result = await ServiceInstaller.getInstallationType(serviceWorkerRegistration)

    expect(result).toEqual(ServiceInstaller.TYPE_OLD_SCOPE)
  })

  it('detects if a conflicting worker is installed', async () => {
    const serviceWorkerRegistration = {
      active: {
        scriptURL: 'http://mytest.com/any-other-push-service-sdk.js'
      }
    }

    const result = await ServiceInstaller.getInstallationType(serviceWorkerRegistration)

    expect(result).toEqual(ServiceInstaller.TYPE_CONFLICT)
  })
})
