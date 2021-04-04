import Permission from '../lib/push_api/permission'
import Storage from '../lib/push_api/storage'
import ApiClient from '../lib/push_api/api_client'
import DialogControl from './dialog'
import Options from '../lib/push_api/options'

export default class SettingsControl {
  #storage
  #dialogControl

  constructor () {
    this.#storage = new Storage()
    this.#dialogControl = new DialogControl()
  }

  draw () {
    this.#insertHTML()
    this.#subscribeToEvents()
  }

  #insertHTML () {
    const svg = 'data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhcyIgZGF0YS1pY29uPSJiZWxsIiBjbGFzcz0ic3ZnLWlubGluZS0tZmEgZmEtYmVsbCBmYS13LTE0IiByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQ0OCA1MTIiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTIyNCA1MTJjMzUuMzIgMCA2My45Ny0yOC42NSA2My45Ny02NEgxNjAuMDNjMCAzNS4zNSAyOC42NSA2NCA2My45NyA2NHptMjE1LjM5LTE0OS43MWMtMTkuMzItMjAuNzYtNTUuNDctNTEuOTktNTUuNDctMTU0LjI5IDAtNzcuNy01NC40OC0xMzkuOS0xMjcuOTQtMTU1LjE2VjMyYzAtMTcuNjctMTQuMzItMzItMzEuOTgtMzJzLTMxLjk4IDE0LjMzLTMxLjk4IDMydjIwLjg0QzExOC41NiA2OC4xIDY0LjA4IDEzMC4zIDY0LjA4IDIwOGMwIDEwMi4zLTM2LjE1IDEzMy41My01NS40NyAxNTQuMjktNiA2LjQ1LTguNjYgMTQuMTYtOC42MSAyMS43MS4xMSAxNi40IDEyLjk4IDMyIDMyLjEgMzJoMzgzLjhjMTkuMTIgMCAzMi0xNS42IDMyLjEtMzIgLjA1LTcuNTUtMi42MS0xNS4yNy04LjYxLTIxLjcxeiI+PC9wYXRoPjwvc3ZnPg=='
    const isSubscribed = this.#storage.isUserActive() ? 'checked="checked"' : ''
    const html =
        '<div class="perfecty-push-settings-container">' +
        '  <div id="perfecty-push-settings-form">' +
        '    <div>' + Options.settingsTitle + '</div>' +
        '    <input type="checkbox" id="perfecty-push-settings-subscribed" ' + isSubscribed + '/>' +
        '    <label for="perfecty-push-settings-subscribed">' + Options.settingsOptIn + '</label>' +
        '    <div id="perfecty-push-settings-notification"></div>' +
        '  </div>' +
        '    <div id="perfecty-push-settings-open">' +
        '    <img src="' + svg + '" alt="Settings" width="30"/>' +
        '  </div>' +
        '</div>'
    document.body.insertAdjacentHTML('beforeend', html)
    this.#toggleForm()
  }

  #subscribeToEvents () {
    document.getElementById('perfecty-push-settings-open').onclick = (e) => {
      e.stopPropagation()
      this.#toggleForm()
    }

    document.getElementById('perfecty-push-settings-subscribed').onchange = async (e) => {
      const checked = e.target.checked

      if (Permission.hasNeverAsked()) {
        this.#dialogControl.show()
      } else if (Permission.isDenied()) {
        this.#showMessage('You need to allow notifications')
      } else if (Permission.isGranted()) {
        await this.setActive(checked)
      }
    }
  }

  setCheckboxActive (isActive) {
    const subscribedControl = document.getElementById('perfecty-push-settings-subscribed')
    subscribedControl.checked = isActive
  }

  async setActive (isActive) {
    const userId = this.#storage.userId()
    const success = await ApiClient.updatePreferences(userId, isActive)
    if (success === true) {
      this.setCheckboxActive(isActive)
      this.#storage.setIsUserActive(isActive)
      this.#showMessage('')
    } else {
      this.#showMessage('Could not change the preference, please try again')
    }
  }

  #toggleForm () {
    const formControl = document.getElementById('perfecty-push-settings-form')
    const isDisplayed = formControl.style.display !== 'none'

    formControl.style.display = isDisplayed ? 'none' : 'block'
    if (formControl.style.display === 'block') {
      this.#listenToOutsideClick(formControl)
    }
  }

  #listenToOutsideClick (formControl) {
    // jquery: https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
    const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)

    const clickListener = (e) => {
      if (!formControl.contains(e.target) && isVisible(formControl)) {
        this.#toggleForm()
        removeListener()
      }
    }
    const removeListener = () => {
      document.removeEventListener('click', clickListener)
    }

    document.addEventListener('click', clickListener)
  }

  #showMessage (message) {
    const notificationControl = document.getElementById('perfecty-push-settings-notification')
    notificationControl.textContent = message
  }
}
