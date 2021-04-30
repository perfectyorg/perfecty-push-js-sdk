import 'regenerator-runtime/runtime'
import Permission from '../lib/push_api/permission'
import Storage from '../lib/push_api/storage'
import ApiClient from '../lib/push_api/api_client'
import SettingsControl from './settings'
import DialogControl from './dialog'
import Options from '../lib/push_api/options'

jest.mock('../lib/push_api/permission', () => ({
  hasNeverAsked: jest.fn().mockImplementation(() => true),
  isDenied: jest.fn().mockImplementation(() => false),
  isGranted: jest.fn().mockImplementation(() => true)
}))
jest.mock('../lib/push_api/api_client', () => ({
  updatePreferences: jest.fn(() => true)
}))
jest.mock('../lib/push_api/storage', () => ({
  isUserActive: jest.fn(() => true),
  hasAskedNotifications: () => false,
  userId: () => 'mocked-uuid',
  setIsUserActive: jest.fn(() => true)
}))
jest.mock('../lib/push_api/registration')
jest.mock('./dialog')

let hideBellAfterSubscribeSpy

beforeEach(() => {
  Permission.hasNeverAsked.mockClear()
  Permission.isDenied.mockClear()
  Permission.isGranted.mockClear()
  Storage.setIsUserActive.mockClear()
  ApiClient.updatePreferences.mockClear()
  hideBellAfterSubscribeSpy = jest.spyOn(Options, 'hideBellAfterSubscribe', 'get')
  hideBellAfterSubscribeSpy.mockImplementation(() => false)
  DialogControl.show.mockClear()
  document.body.innerHTML = ''
})

describe('when the control is created', () => {
  it('is drawn and the form is hidden', () => {
    SettingsControl.draw()

    const expectedHTML = '<div class="perfecty-push-settings-container" style="display: block;">  <div id="perfecty-push-settings-form" style="display: none;">    <div>Notifications preferences</div>    <input type="checkbox" id="perfecty-push-settings-subscribed" checked="checked">    <label for="perfecty-push-settings-subscribed">I want to receive notifications</label>    <div id="perfecty-push-settings-notification"></div>  </div>    <div id="perfecty-push-settings-open">    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" aria-hidden="true" focusable="false"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path></svg>  </div></div>'
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
    const expectedHTML = '<div class="perfecty-push-settings-container">  <div id="perfecty-push-settings-form">    <div>Notifications preferences</div>    <input type="checkbox" id="perfecty-push-settings-subscribed" checked="checked">    <label for="perfecty-push-settings-subscribed">I want to receive notifications</label>    <div id="perfecty-push-settings-notification"></div>  </div>    <div id="perfecty-push-settings-open">    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" aria-hidden="true" focusable="false"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path></svg>  </div></div>'
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
  it('is unchecked, user is set as inactive', async () => {
    Permission.hasNeverAsked.mockImplementationOnce(() => false)

    SettingsControl.draw()

    await simulateChangeOnSubscribed(false)
    const notificationControl = document.getElementById('perfecty-push-settings-notification')
    expect(Storage.setIsUserActive).toHaveBeenCalledTimes(1)
    expect(notificationControl.textContent).toEqual('')
  })

  it('is unchecked and there\'s an error, show message', async () => {
    ApiClient.updatePreferences.mockImplementationOnce(() => false)
    Permission.hasNeverAsked.mockImplementationOnce(() => false)

    SettingsControl.draw()

    await simulateChangeOnSubscribed(false)
    const notificationControl = document.getElementById('perfecty-push-settings-notification')
    expect(Storage.setIsUserActive).toHaveBeenCalledTimes(0)
    expect(notificationControl.textContent).toEqual('Could not change the preference, please try again')
  })

  it('is checked and permissions are granted, sets the user active', async () => {
    Permission.hasNeverAsked.mockImplementationOnce(() => false)

    SettingsControl.draw()

    await simulateChangeOnSubscribed(true)
    const notificationControl = document.getElementById('perfecty-push-settings-notification')
    expect(Storage.setIsUserActive).toHaveBeenCalledTimes(1)
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
