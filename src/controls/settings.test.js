import 'regenerator-runtime/runtime'
import Permission from '../lib/push_api/permission'
import Storage from '../lib/push_api/storage'
import ApiClient from '../lib/push_api/api_client'
import SettingsControl from './settings'
import DialogControl from './dialog'

jest.mock('../lib/push_api/permission', () => ({
  hasNeverAsked: jest.fn().mockImplementation(() => true),
  isDenied: jest.fn().mockImplementation(() => false),
  isGranted: jest.fn().mockImplementation(() => true)
}))
jest.mock('../lib/push_api/api_client', () => ({
  updatePreferences: jest.fn(() => true)
}))
jest.mock('../lib/push_api/storage', () => ({
  isUserActive: () => true,
  hasAskedNotifications: () => false,
  userId: () => 'mocked-uuid',
  setIsUserActive: jest.fn(() => true)
}))
jest.mock('../lib/push_api/registration')
jest.mock('./dialog')

beforeEach(() => {
  Permission.hasNeverAsked.mockClear()
  Permission.isDenied.mockClear()
  Permission.isGranted.mockClear()
  Storage.setIsUserActive.mockClear()
  ApiClient.updatePreferences.mockClear()
  DialogControl.mockClear()
  document.body.innerHTML = ''
})

describe('when the control is created', () => {
  it('is drawn and the form is hidden', () => {
    const dialog = new SettingsControl()
    dialog.draw()

    const expectedHTML = '<div class="perfecty-push-settings-container">  <div id="perfecty-push-settings-form" style="display: none;">    <div>Notifications preferences</div>    <input type="checkbox" id="perfecty-push-settings-subscribed" checked="checked">    <label for="perfecty-push-settings-subscribed">I want to receive notifications</label>    <div id="perfecty-push-settings-notification"></div>  </div>    <div id="perfecty-push-settings-open">    <img src="data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhcyIgZGF0YS1pY29uPSJiZWxsIiBjbGFzcz0ic3ZnLWlubGluZS0tZmEgZmEtYmVsbCBmYS13LTE0IiByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQ0OCA1MTIiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTIyNCA1MTJjMzUuMzIgMCA2My45Ny0yOC42NSA2My45Ny02NEgxNjAuMDNjMCAzNS4zNSAyOC42NSA2NCA2My45NyA2NHptMjE1LjM5LTE0OS43MWMtMTkuMzItMjAuNzYtNTUuNDctNTEuOTktNTUuNDctMTU0LjI5IDAtNzcuNy01NC40OC0xMzkuOS0xMjcuOTQtMTU1LjE2VjMyYzAtMTcuNjctMTQuMzItMzItMzEuOTgtMzJzLTMxLjk4IDE0LjMzLTMxLjk4IDMydjIwLjg0QzExOC41NiA2OC4xIDY0LjA4IDEzMC4zIDY0LjA4IDIwOGMwIDEwMi4zLTM2LjE1IDEzMy41My01NS40NyAxNTQuMjktNiA2LjQ1LTguNjYgMTQuMTYtOC42MSAyMS43MS4xMSAxNi40IDEyLjk4IDMyIDMyLjEgMzJoMzgzLjhjMTkuMTIgMCAzMi0xNS42IDMyLjEtMzIgLjA1LTcuNTUtMi42MS0xNS4yNy04LjYxLTIxLjcxeiI+PC9wYXRoPjwvc3ZnPg==" alt="Settings" width="30">  </div></div>'
    expect(document.body.innerHTML).toEqual(expectedHTML)
    expect(formIsShown()).toEqual(false)
  })

  it('the form can be opened', async () => {
    const dialog = new SettingsControl()
    dialog.draw()

    expect(formIsShown()).toEqual(false)
    await simulateClickOnOpen()
    expect(formIsShown()).toEqual(true)
  })
})

describe('when the subscribed check', () => {
  it('is unchecked, user is set as inactive', async () => {
    Permission.hasNeverAsked.mockImplementationOnce(() => false)

    const dialog = new SettingsControl()
    dialog.draw()

    await simulateChangeOnSubscribed(false)
    const notificationControl = document.getElementById('perfecty-push-settings-notification')
    expect(Storage.setIsUserActive).toHaveBeenCalledTimes(1)
    expect(notificationControl.textContent).toEqual('')
  })

  it('is unchecked and there\'s an error, show message', async () => {
    ApiClient.updatePreferences.mockImplementationOnce(() => false)
    Permission.hasNeverAsked.mockImplementationOnce(() => false)

    const dialog = new SettingsControl()
    dialog.draw()

    await simulateChangeOnSubscribed(false)
    const notificationControl = document.getElementById('perfecty-push-settings-notification')
    expect(Storage.setIsUserActive).toHaveBeenCalledTimes(0)
    expect(notificationControl.textContent).toEqual('Could not change the preference, please try again')
  })

  it('is checked and permissions are granted, sets the user active', async () => {
    Permission.hasNeverAsked.mockImplementationOnce(() => false)

    const dialog = new SettingsControl()
    dialog.draw()

    await simulateChangeOnSubscribed(true)
    const notificationControl = document.getElementById('perfecty-push-settings-notification')
    expect(Storage.setIsUserActive).toHaveBeenCalledTimes(1)
    expect(notificationControl.textContent).toEqual('')
  })

  it('is checked and no permissions asked yet, opens the dialog message', async () => {
    Permission.isGranted.mockImplementationOnce(() => false)

    const dialog = new SettingsControl()
    dialog.draw()

    const dialogControlInstance = DialogControl.mock.instances[0]

    await simulateChangeOnSubscribed(true)
    const notificationControl = document.getElementById('perfecty-push-settings-notification')
    expect(dialogControlInstance.show).toHaveBeenCalledTimes(1)
    expect(Storage.setIsUserActive).toHaveBeenCalledTimes(0)
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
