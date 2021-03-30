import 'regenerator-runtime/runtime'
import ServiceWorker from './service_worker'
import Options from './options'

let navigatorSpy

beforeEach(() => {
  navigatorSpy = jest.spyOn(global, 'navigator', 'get')
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
    navigatorSpy.mockImplementation(() => ({
      serviceWorker: {
        getRegistration: mockGetRegistration
      }
    }))

    const options = new Options()
    const serviceWorker = new ServiceWorker(options)

    await serviceWorker.removeConflicts()

    expect(mockGetRegistration).toHaveBeenCalledTimes(1)
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
    navigatorSpy.mockImplementation(() => ({
      serviceWorker: {
        getRegistration: mockGetRegistration
      }
    }))

    const options = new Options()
    const serviceWorker = new ServiceWorker(options)

    await serviceWorker.removeConflicts()

    expect(mockGetRegistration).toHaveBeenCalledTimes(1)
    expect(mockUnregister).toHaveBeenCalledTimes(0)
  })
})

describe('when installing', () => {
  it('registers and returns a new push subscription', async () => {
    const pushManager = {
      getSubscription: () => { return Promise.resolve(null) },
      subscribe: () => { return Promise.resolve({ mockKey: 'value' }) }
    }
    const serviceWorkerRegistration = {
      active: {
        scriptURL: 'http://mytest.com/perfecty-push-sdk.js'
      },
      pushManager: pushManager
    }
    const mockRegister = jest.fn().mockReturnValueOnce(Promise.resolve(serviceWorkerRegistration))
    navigatorSpy.mockImplementation(() => ({
      serviceWorker: {
        register: mockRegister
      }
    }))

    const options = new Options()
    const serviceWorker = new ServiceWorker(options)
    const result = await serviceWorker.install()

    expect(result).toEqual({ mockKey: 'value' })
  })

  it('registers and returns an already existing push subscription', async () => {
    const mockSubscribe = jest.fn()
    const pushManager = {
      getSubscription: () => { return Promise.resolve({ mockExistingKey: 'existingValue' }) },
      subscribe: mockSubscribe
    }
    const serviceWorkerRegistration = {
      active: {
        scriptURL: 'http://mytest.com/perfecty-push-sdk.js'
      },
      pushManager: pushManager
    }
    const mockRegister = jest.fn().mockReturnValueOnce(Promise.resolve(serviceWorkerRegistration))
    navigatorSpy.mockImplementation(() => ({
      serviceWorker: {
        register: mockRegister
      }
    }))

    const options = new Options()
    const serviceWorker = new ServiceWorker(options)
    const result = await serviceWorker.install()

    expect(result).toEqual({ mockExistingKey: 'existingValue' })
    expect(mockSubscribe).toHaveBeenCalledTimes(0)
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

    const options = new Options()
    const serviceWorker = new ServiceWorker(options)
    const result = await serviceWorker.getInstalledType()

    expect(result).toEqual(ServiceWorker.TYPE_NOTHING)
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

    const options = new Options()
    const serviceWorker = new ServiceWorker(options)
    const result = await serviceWorker.getInstalledType()

    expect(result).toEqual(ServiceWorker.TYPE_PERFECTY)
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

    const options = new Options()
    const serviceWorker = new ServiceWorker(options)
    const result = await serviceWorker.getInstalledType()

    expect(result).toEqual(ServiceWorker.TYPE_CONFLICT)
    expect(mockGetRegistration).toHaveBeenCalledTimes(1)
  })
})
