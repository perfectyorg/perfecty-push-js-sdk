import 'regenerator-runtime/runtime'

let navigatorSpy

let ServiceInstaller

beforeEach(() => {
  navigatorSpy = jest.spyOn(global, 'navigator', 'get')
  jest.resetModules()
})
afterEach(() => {
  navigatorSpy.mockRestore()
})

describe('when removing conflicts', () => {
  it('is unregistered on conflicts', async () => {
    const mockUnregister = jest.fn().mockReturnValue(Promise.resolve(true))
    const serviceWorkerRegistration = {
      active: {
        scriptURL: 'http://mytest.com'
      },
      unregister: mockUnregister
    }
    const mockGetRegistration = jest.fn().mockReturnValue(Promise.resolve(serviceWorkerRegistration))
    navigatorSpy.mockImplementationOnce(() => ({
      serviceWorker: {
        getRegistration: mockGetRegistration
      }
    }))
    ServiceInstaller = require('./service_installer').default

    await ServiceInstaller.removeConflicts()

    expect(mockGetRegistration).toHaveBeenCalledTimes(2)
    expect(mockUnregister).toHaveBeenCalledTimes(1)
  })

  it('is not unregistered if there\'s no conflict', async () => {
    const mockUnregister = jest.fn().mockReturnValue(Promise.resolve(true))
    const serviceWorkerRegistration = {
      active: {
        scriptURL: 'http://mytest.com/perfecty/'
      },
      unregister: mockUnregister
    }
    const mockGetRegistration = jest.fn().mockReturnValue(Promise.resolve(serviceWorkerRegistration))
    navigatorSpy.mockImplementationOnce(() => ({
      serviceWorker: {
        getRegistration: mockGetRegistration
      }
    }))
    ServiceInstaller = require('./service_installer').default

    await ServiceInstaller.removeConflicts()

    expect(mockGetRegistration).toHaveBeenCalledTimes(1)
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
    navigatorSpy.mockImplementationOnce(() => ({
      serviceWorker: {
        register: mockRegister,
        getRegistration: mockGetRegistration
      }
    }))
    ServiceInstaller = require('./service_installer').default

    const result = await ServiceInstaller.installIfMissing()

    expect(result).toEqual({
      active: { scriptURL: 'http://mytest.com/perfecty-push-sdk.js' }
    })
    expect(mockRegister).toHaveBeenCalledTimes(1)
  })

  it('doesn\'t perform the registration when already installed', async () => {
    const serviceWorkerRegistration = {
      active: { scriptURL: 'http://mytest.com/perfecty-push-sdk.js' }
    }
    const mockRegister = jest.fn().mockReturnValue(Promise.resolve())
    const mockGetRegistration = jest.fn().mockReturnValueOnce(Promise.resolve(serviceWorkerRegistration))
    navigatorSpy.mockImplementationOnce(() => ({
      serviceWorker: {
        register: mockRegister,
        getRegistration: mockGetRegistration
      }
    }))
    ServiceInstaller = require('./service_installer').default

    const result = await ServiceInstaller.installIfMissing()

    expect(result).toEqual(false)
    expect(mockRegister).toHaveBeenCalledTimes(0)
  })
})

describe('when getting the installation type', () => {
  it('detects if there\'s no installation', async () => {
    const mockUnregister = jest.fn().mockReturnValue(Promise.resolve(true))
    const serviceWorkerRegistration = {
      active: {
        scriptURL: ''
      },
      unregister: mockUnregister
    }
    const mockGetRegistration = jest.fn().mockReturnValue(Promise.resolve(serviceWorkerRegistration))
    navigatorSpy.mockImplementation(() => ({
      serviceWorker: {
        getRegistration: mockGetRegistration
      }
    }))
    ServiceInstaller = require('./service_installer').default

    const result = await ServiceInstaller.getInstallationType()

    expect(result).toEqual(ServiceInstaller.TYPE_NOTHING)
    expect(mockGetRegistration).toHaveBeenCalledTimes(1)
  })

  it('detects if perfecty is installed', async () => {
    const mockUnregister = jest.fn().mockReturnValue(Promise.resolve(true))
    const serviceWorkerRegistration = {
      active: {
        scriptURL: 'http://mytest.com/perfecty-push-sdk.js'
      },
      unregister: mockUnregister
    }
    const mockGetRegistration = jest.fn().mockReturnValue(Promise.resolve(serviceWorkerRegistration))
    navigatorSpy.mockImplementation(() => ({
      serviceWorker: {
        getRegistration: mockGetRegistration
      }
    }))
    ServiceInstaller = require('./service_installer').default

    const result = await ServiceInstaller.getInstallationType()

    expect(result).toEqual(ServiceInstaller.TYPE_PERFECTY)
    expect(mockGetRegistration).toHaveBeenCalledTimes(1)
  })

  it('detects if a conflicting worker is installed', async () => {
    const mockUnregister = jest.fn().mockReturnValue(Promise.resolve(true))
    const serviceWorkerRegistration = {
      active: {
        scriptURL: 'http://mytest.com/any-other-push-service-sdk.js'
      },
      unregister: mockUnregister
    }
    const mockGetRegistration = jest.fn().mockReturnValue(Promise.resolve(serviceWorkerRegistration))
    navigatorSpy.mockImplementation(() => ({
      serviceWorker: {
        getRegistration: mockGetRegistration
      }
    }))
    ServiceInstaller = require('./service_installer').default

    const result = await ServiceInstaller.getInstallationType()

    expect(result).toEqual(ServiceInstaller.TYPE_CONFLICT)
    expect(mockGetRegistration).toHaveBeenCalledTimes(1)
  })
})
