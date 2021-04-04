import Features from './features'

let windowSpy

beforeEach(() => {
  windowSpy = jest.spyOn(window, 'window', 'get')
})

afterEach(() => {
  windowSpy.mockRestore()
})

it('are present', () => {
  windowSpy.mockImplementation(() => ({
    PushManager: {},
    navigator: { serviceWorker: {} }
  }))

  const res = Features.isSupported()
  expect(res).toEqual(true)
})

it('some are not present', () => {
  windowSpy.mockImplementation(() => ({
    PushManager: {},
    navigator: {}
  }))

  const res = Features.isSupported()
  expect(res).toEqual(false)
})

it('none are present', () => {
  windowSpy.mockImplementation(() => ({
    navigator: {}
  }))

  const res = Features.isSupported()
  expect(res).toEqual(false)
})
