import 'regenerator-runtime/runtime'
import ApiClient from './api_client'

global.fetch = jest.fn()

beforeEach(() => {
  fetch.mockClear()
})

const pushSubscription = { mockedKey1: 'mockedValue2', mockedKey2: 'mockedValue2' }

describe('when registering a user', () => {
  it('returns the parsed response on success', async () => {
    const response = { id: 'user-uuid-1', body: { key1: 'value1' } }
    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        json: () => Promise.resolve(response)
      })
    })
    const result = await ApiClient.register(pushSubscription)
    expect(result).toEqual(response)
  })

  it('returns false on failures', async () => {
    const response = { error: 'mocked reason' }
    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        json: () => Promise.resolve(response)
      })
    })
    const result = await ApiClient.register(pushSubscription)
    expect(result).toEqual(false)
  })
})

describe('when getting a user', () => {
  it('returns the user on success', async () => {
    const response = { id: 'user-uuid-1', body: { key1: 'value1' } }
    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(response)
      })
    })
    const result = await ApiClient.getUser('user-uuid-1')
    expect(result).toEqual(response)
  })

  it('returns null if not found', async () => {
    const response = {}
    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(response)
      })
    })
    const result = await ApiClient.getUser('user-uuid-1')
    expect(result).toBeNull()
  })

  it('throws exception if body not ok', async () => {
    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: false
      })
    })
    const t = async () => {
      await ApiClient.getUser('user-uuid-1')
    }

    await expect(t).rejects.toThrow(new Error('Could not communicate with the server'))
  })
})

describe('when unregistering the user', () => {
  it('returns true on success', async () => {
    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: () => true
      })
    })
    const result = await ApiClient.unregister('user-uuid-1')
    expect(result).toEqual(true)
  })

  it('returns false on failures', async () => {
    const response = { error: 'mocked reason' }
    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        json: () => Promise.resolve(response)
      })
    })
    const result = await ApiClient.unregister('user-uuid-1')
    expect(result).toEqual(false)
  })

  it('returns false on exception', async () => {
    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        json: () => { throw new Error('Sample exception') }
      })
    })
    const result = await ApiClient.unregister('user-uuid-1')
    expect(result).toEqual(false)
  })
})
