import Permission from '../lib/push_api/permission'
import Storage from '../lib/push_api/storage'
import ApiClient from '../lib/push_api/api_client'
import DialogControl from './dialog'
import Options from '../lib/push_api/options'
import Logger from '../lib/logger'

const SettingsControl = (() => {
  const draw = () => {
    insertHTML()
    subscribeToEvents()
  }

  const setCheckboxActive = (isActive) => {
    const subscribedControl = document.getElementById('perfecty-push-settings-subscribed')
    subscribedControl.checked = isActive
  }

  const setActive = async (isActive) => {
    const userId = Storage.userId()
    const success = await ApiClient.updatePreferences(userId, isActive)
    if (success === true) {
      setCheckboxActive(isActive)
      Storage.setIsUserActive(isActive)
      showMessage('')
    } else {
      showMessage(Options.settingsUpdateError)
    }
  }

  const insertHTML = () => {
    const subscribedBoxChecked = Storage.isUserActive() ? 'checked="checked"' : ''
    const html =
        '<div class="perfecty-push-settings-container">' +
        '  <div id="perfecty-push-settings-form">' +
        '    <div>' + Options.settingsTitle + '</div>' +
        '    <input type="checkbox" id="perfecty-push-settings-subscribed" ' + subscribedBoxChecked + '/>' +
        '    <label for="perfecty-push-settings-subscribed">' + Options.settingsOptIn + '</label>' +
        '    <div id="perfecty-push-settings-notification"></div>' +
        '  </div>' +
        '    <div id="perfecty-push-settings-open">' +
        '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" aria-hidden="true" focusable="false"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path></svg>' +
        '  </div>' +
        '</div>'
    document.body.insertAdjacentHTML('beforeend', html)
    if (Options.hideBellAfterSubscribe === false || Storage.isUserActive() === false) {
      showContainer()
      toggleForm()
    }
  }

  const subscribeToEvents = () => {
    document.getElementById('perfecty-push-settings-open').onclick = (e) => {
      e.stopPropagation()
      if (Permission.hasNeverAsked() || Permission.isDenied()) {
        DialogControl.show()
      } else {
        toggleForm()
      }
    }

    document.getElementById('perfecty-push-settings-subscribed').onchange = async (e) => {
      const checked = e.target.checked

      if (Permission.isGranted()) {
        await setActive(checked)
      }
    }
  }

  const toggleForm = () => {
    const formControl = document.getElementById('perfecty-push-settings-form')
    const isDisplayed = formControl.style.display !== 'none'

    formControl.style.display = isDisplayed ? 'none' : 'block'
    if (formControl.style.display === 'block') {
      listenToOutsideClick(formControl)
    }
  }

  const showContainer = () => {
    const container = document.getElementsByClassName('perfecty-push-settings-container')[0]
    container.style.display = 'block'
    Logger.info('Showing the bell and settings controls')
  }

  const hideContainer = () => {
    const container = document.getElementsByClassName('perfecty-push-settings-container')[0]
    container.style.display = 'none'
    Logger.info('Hiding the bell and settings controls')
  }

  const listenToOutsideClick = (formControl) => {
    // jquery: https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
    const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)

    const clickListener = (e) => {
      if (!formControl.contains(e.target) && isVisible(formControl)) {
        toggleForm()
        removeListener()
      }
    }
    const removeListener = () => {
      document.removeEventListener('click', clickListener)
    }

    document.addEventListener('click', clickListener)
  }

  const showMessage = (message) => {
    const notificationControl = document.getElementById('perfecty-push-settings-notification')
    notificationControl.textContent = message
  }

  const userHasSubscribed = (isActive) => {
    setCheckboxActive(isActive)
    if (Options.hideBellAfterSubscribe === true && isActive === true) {
      hideContainer()
    }
  }

  return {
    draw,
    setCheckboxActive,
    setActive,
    userHasSubscribed
  }
})()

export default SettingsControl
