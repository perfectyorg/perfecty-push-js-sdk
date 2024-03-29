import Permission from '../lib/push_api/permission'
import Storage from '../lib/push_api/storage'
import Registration from '../lib/push_api/registration'
import Logger from '../lib/logger'
import Options from '../lib/push_api/options'
import ServiceInstaller from '../lib/push_api/service_installer'

const DialogControl = (() => {
  const draw = () => {
    Logger.debug('Drawing dialog')

    insertHTML()
    subscribeToEvents()
    showDialogToUnsubscribedUser()
  }

  const show = () => {
    Logger.debug('Showing dialog')
    const control = document.getElementById('perfecty-push-dialog-container')
    control.style.display = 'block'
  }

  const insertHTML = () => {
    const promptIcon = Options.promptIconUrl ? '<img src="' + Options.promptIconUrl + '" alt="Perfecty" class="perfecty-push-dialog-icon"/>' : ''
    const html =
        '<div class="site perfecty-push-dialog-container" id="perfecty-push-dialog-container">' +
        '  <div class="perfecty-push-dialog-box">' + promptIcon +
        '    <div class="perfecty-push-dialog-form">' +
        '      <div class="perfecty-push-dialog-title">' + Options.dialogTitle + '</div>' +
        '      <div class="perfecty-push-dialog-buttons">' +
        '        <button id="perfecty-push-dialog-cancel" type="button" class="button secondary">' + Options.dialogCancel + '</button>' +
        '        <button id="perfecty-push-dialog-subscribe" type="button" class="button primary">' + Options.dialogSubmit + '</button> ' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'

    document.body.insertAdjacentHTML('beforeend', html)
    hide()
  }

  const subscribeToEvents = () => {
    document.getElementById('perfecty-push-dialog-subscribe').onclick = async () => {
      Logger.info('User is accepting the subscription')
      Storage.setHasAskedNotifications(true)
      hide()

      await Permission.askIfNotDenied()
      if (Permission.isGranted()) {
        Logger.info('User has granted permissions')

        const userId = Storage.userId()
        await ServiceInstaller.installIfMissing()
        await Registration.register(userId, true)
      }
    }

    document.getElementById('perfecty-push-dialog-cancel').onclick = () => {
      Storage.setHasAskedNotifications(true)
      hide()
    }
  }

  const showDialogToUnsubscribedUser = () => {
    if (Permission.hasNeverAsked() && !Storage.hasAskedNotifications()) {
      show()
    } else {
      Logger.debug('Dialog control not displayed: permissions already asked or already granted')
    }
  }

  const hide = () => {
    Logger.debug('Hiding dialog')
    const control = document.getElementById('perfecty-push-dialog-container')
    control.style.display = 'none'
  }

  return {
    draw,
    show
  }
})()

export default DialogControl
