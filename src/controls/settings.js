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
        '  <button id="perfecty-push-settings-open">' +
        '    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bell" class="svg-inline--fa fa-bell fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z"></path></svg>' +
        '  </button>' +
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
