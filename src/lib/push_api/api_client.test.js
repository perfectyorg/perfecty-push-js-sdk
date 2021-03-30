import 'regenerator-runtime/runtime'
import Options from './options'
import ApiClient from './api_client'

global.fetch = jest.fn()

beforeEach(() => {
  fetch.mockClear()
})

const pushSubscription = { mockedKey1: 'mockedValue2', mockedKey2: 'mockedValue2' }

describe('when registering a user', () => {
  it('returns the parsed response on success', async () => {
    const response = { success: true, body: { key1: 'value1' } }
    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        json: () => Promise.resolve(response)
      })
    })
    const options = new Options()
    const apiClient = new ApiClient(options)
    const result = await apiClient.register(pushSubscription)
    expect(result).toEqual(response)
  })

  it('returns false on failures', async () => {
    const response = { error: 'mocked reason' }
    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        json: () => Promise.resolve(response)
      })
    })
    const options = new Options()
    const apiClient = new ApiClient(options)
    const result = await apiClient.register(pushSubscription)
    expect(result).toEqual(false)
  })
})

describe('when updating the preferences', () => {
  it('returns true on success', async () => {
    const response = { success: true }
    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        json: () => Promise.resolve(response)
      })
    })
    const options = new Options()
    const apiClient = new ApiClient(options)
    const result = await apiClient.updatePreferences(pushSubscription)
    expect(result).toEqual(true)
  })

  it('returns false on failures', async () => {
    const response = { error: 'mocked reason' }
    fetch.mockImplementationOnce(() => {
      return Promise.resolve({
        json: () => Promise.resolve(response)
      })
    })
    const options = new Options()
    const apiClient = new ApiClient(options)
    const result = await apiClient.updatePreferences(pushSubscription)
    expect(result).toEqual(false)
  })
})
