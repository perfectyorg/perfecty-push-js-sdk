import 'regenerator-runtime/runtime'
import Permission from '../lib/push_api/permission'
import Storage from '../lib/push_api/storage'
import ApiClient from '../lib/push_api/api_client'
import SettingsControl from './settings'
import DialogControl from './dialog'
import Options from '../lib/push_api/options'
import ServiceInstaller from '../lib/push_api/service_installer'

jest.mock('../lib/push_api/permission', () => ({
  hasNeverAsked: jest.fn().mockImplementation(() => true),
  isDenied: jest.fn().mockImplementation(() => false),
  isGranted: jest.fn().mockImplementation(() => true)
}))
jest.mock('../lib/push_api/api_client', () => ({
  register: jest.fn(() => true),
  unregister: jest.fn(() => true)
}))
jest.mock('../lib/push_api/storage', () => ({
  isUserActive: jest.fn(() => true),
  hasAskedNotifications: () => false,
  userId: () => 'mocked-uuid',
  setUserId: jest.fn(() => true),
  setShouldRegisterUser: jest.fn(() => true)
}))
jest.mock('./dialog')
jest.mock('../lib/push_api/service_installer')

let hideBellAfterSubscribeSpy

beforeEach(() => {
  Permission.hasNeverAsked.mockClear()
  Permission.isDenied.mockClear()
  Permission.isGranted.mockClear()
  ApiClient.unregister.mockClear()
  ServiceInstaller.removeInstallation.mockClear()
  ServiceInstaller.subscribeToPush.mockClear()
  hideBellAfterSubscribeSpy = jest.spyOn(Options, 'hideBellAfterSubscribe', 'get')
  hideBellAfterSubscribeSpy.mockImplementation(() => false)
  DialogControl.show.mockClear()
  document.body.innerHTML = ''
})

describe('when the control is created', () => {
  it('is drawn and the form is hidden', () => {
    SettingsControl.draw()

    console.log(document.body.innerHTML)
    const expectedHTML = '<div class="perfecty-push-settings-container" style="display: block;">  <div id="perfecty-push-settings-form" style="display: none;">    <div>Notifications preferences</div>    <input type="checkbox" id="perfecty-push-settings-subscribed" checked="checked">    <label for="perfecty-push-settings-subscribed">I want to receive notifications</label>    <div id="perfecty-push-settings-notification"></div>  </div>  <button id="perfecty-push-settings-open" title="Notifications preferences" aria-label="Notifications preferences">    <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z"></path></svg>  </button></div>'
    expect(document.body.innerHTML).toEqual(expectedHTML)
    expect(formIsShown()).toEqual(false)
  })

  it('is opened and no permissions asked yet, opens the dialog message', async () => {
    SettingsControl.draw()

    await simulateClickOnOpen()
    const notificationControl = document.getElementById('perfecty-push-settings-notification')
    expect(DialogControl.show).toHaveBeenCalledTimes(1)
    expect(notificationControl.textContent).toEqual('')
  })

  it('is hidden when hideBellAfterSubscribe is true and active=true', () => {
    hideBellAfterSubscribeSpy.mockImplementationOnce(() => true)
    SettingsControl.draw()

    // in the css, perfecty-push-settings-container display is hidden by default
    console.log(document.body.innerHTML)
    const expectedHTML = '<div class="perfecty-push-settings-container">  <div id="perfecty-push-settings-form">    <div>Notifications preferences</div>    <input type="checkbox" id="perfecty-push-settings-subscribed" checked="checked">    <label for="perfecty-push-settings-subscribed">I want to receive notifications</label>    <div id="perfecty-push-settings-notification"></div>  </div>  <button id="perfecty-push-settings-open" title="Notifications preferences" aria-label="Notifications preferences">    <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z"></path></svg>  </button></div>'
    expect(document.body.innerHTML).toEqual(expectedHTML)
  })

  it('the form can be opened', async () => {
    Permission.hasNeverAsked.mockImplementationOnce(() => false)
    SettingsControl.draw()

    expect(formIsShown()).toEqual(false)
    await simulateClickOnOpen()
    expect(formIsShown()).toEqual(true)
  })
})

describe('when the subscribed check', () => {
  it('is unchecked, user is unregistered', async () => {
    Permission.hasNeverAsked.mockImplementationOnce(() => false)
    ServiceInstaller.removeInstallation.mockImplementationOnce(() => true)

    SettingsControl.draw()

    await simulateChangeOnSubscribed(false)
    const notificationControl = document.getElementById('perfecty-push-settings-notification')
    expect(ApiClient.unregister).toHaveBeenCalledTimes(1)
    expect(ServiceInstaller.removeInstallation).toHaveBeenCalledTimes(1)
    expect(notificationControl.textContent).toEqual('')
  })

  it('is checked and there\'s an error, show message', async () => {
    ApiClient.register.mockImplementationOnce(() => false)
    ServiceInstaller.subscribeToPush.mockImplementationOnce(() => ({ test: 'test' }))
    Permission.hasNeverAsked.mockImplementationOnce(() => false)

    SettingsControl.draw()

    await simulateChangeOnSubscribed(true)
    const notificationControl = document.getElementById('perfecty-push-settings-notification')
    expect(ApiClient.register).toHaveBeenCalledTimes(1)
    expect(ServiceInstaller.subscribeToPush).toHaveBeenCalledTimes(1)
    expect(Storage.setUserId).toHaveBeenCalledTimes(0)
    expect(notificationControl.textContent).toEqual('Could not change the preference, please try again')
  })

  it('is unchecked and there\'s an error, show message', async () => {
    ApiClient.unregister.mockImplementationOnce(() => false)
    Permission.hasNeverAsked.mockImplementationOnce(() => false)

    SettingsControl.draw()

    await simulateChangeOnSubscribed(false)
    const notificationControl = document.getElementById('perfecty-push-settings-notification')
    expect(ApiClient.unregister).toHaveBeenCalledTimes(1)
    expect(ServiceInstaller.removeInstallation).toHaveBeenCalledTimes(0)
    expect(notificationControl.textContent).toEqual('Could not change the preference, please try again')
  })

  it('is checked and permissions are granted, register the user again', async () => {
    ApiClient.register.mockImplementationOnce(() => true)
    Permission.hasNeverAsked.mockImplementationOnce(() => false)
    ServiceInstaller.subscribeToPush.mockImplementationOnce(() => ({ test: 'test' }))

    SettingsControl.draw()

    await simulateChangeOnSubscribed(true)
    const notificationControl = document.getElementById('perfecty-push-settings-notification')
    expect(Storage.setUserId).toHaveBeenCalledTimes(1)
    expect(Storage.setShouldRegisterUser).toHaveBeenCalledTimes(1)
    expect(notificationControl.textContent).toEqual('')
  })
})

function formIsShown () {
  const control = document.getElementById('perfecty-push-settings-form')
  return control.style.display !== 'none'
}

function simulateClickOnOpen () {
  const control = document.getElementById('perfecty-push-settings-open')
  control.click()

  return tick()
}

function simulateChangeOnSubscribed (checked) {
  const control = document.getElementById('perfecty-push-settings-subscribed')
  control.checked = checked
  control.dispatchEvent(new CustomEvent('change'))

  return tick()
}

function tick () {
  // wait for the next macrotask
  // useful when we're waiting for the click event to be processed
  // https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context
  return new Promise(resolve => {
    setTimeout(resolve, 0)
  })
}
