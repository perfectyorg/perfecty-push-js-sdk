import Features from './features'

let windowSpy
let features

beforeEach(() => {
  windowSpy = jest.spyOn(window, 'window', 'get')
  features = new Features()
})

afterEach(() => {
  windowSpy.mockRestore()
})

it('are present', () => {
  windowSpy.mockImplementation(() => ({
    PushManager: {},
    navigator: { serviceWorker: {} }
  }))

  const res = features.isSupported()
  expect(res).toEqual(true)
})

it('some are not present', () => {
  windowSpy.mockImplementation(() => ({
    PushManager: {},
    navigator: {}
  }))

  const res = features.isSupported()
  expect(res).toEqual(false)
})

it('none are present', () => {
  windowSpy.mockImplementation(() => ({
    navigator: {}
  }))

  const res = features.isSupported()
  expect(res).toEqual(false)
})
