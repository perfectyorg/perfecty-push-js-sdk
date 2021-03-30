import { urlBase64ToUint8Array } from './utils'

it('base64 to Uint8Array', () => {
  const uint8Value = urlBase64ToUint8Array('SGVsbG89V29ybGQmQmFyPUZvbw==')
  const expected = new Uint8Array([72, 101, 108, 108, 111, 61, 87, 111, 114, 108, 100, 38, 66, 97, 114, 61, 70, 111, 111])

  expect(uint8Value).toEqual(expected)
})
