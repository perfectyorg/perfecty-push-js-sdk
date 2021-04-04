import Permission from '../lib/push_api/permission'
import Storage from '../lib/push_api/storage'
import Registration from '../lib/push_api/registration'
import Logger from '../lib/logger'
import Options from '../lib/push_api/options'

export default class DialogControl {
  #storage

  constructor () {
    this.#storage = new Storage()
  }

  draw () {
    Logger.debug('Drawing dialog')

    this.#insertHTML()
    this.#subscribeToEvents()
    this.#showDialogToUnsubscribedUser()
  }

  #insertHTML () {
    const html =
        '<div class="site perfecty-push-dialog-container" id="perfecty-push-dialog-container">' +
        '  <div class="perfecty-push-dialog-box">' +
        '    <div class="perfecty-push-dialog-title">' + Options.dialogTitle + '</div>' +
        '    <div class="perfecty-push-dialog-buttons">' +
        '      <button id="perfecty-push-dialog-cancel" type="button" class="button secondary">' + Options.dialogCancel + '</button>' +
        '      <button id="perfecty-push-dialog-subscribe" type="button" class="button primary">' + Options.dialogSubmit + '</button> ' +
        '    </div>' +
        '  </div>' +
        '</div>'

    document.body.insertAdjacentHTML('beforeend', html)
    this.#hide()
  }

  #subscribeToEvents () {
    document.getElementById('perfecty-push-dialog-subscribe').onclick = async () => {
      Logger.info('User is accepting the subscription')
      this.#storage.setHasAskedNotifications(true)
      this.#hide()

      await Permission.askIfNotDenied()
      if (Permission.isGranted()) {
        Logger.info('User has granted permissions')

        await Registration.register()
      }
    }

    document.getElementById('perfecty-push-dialog-cancel').onclick = () => {
      this.#storage.setHasAskedNotifications(true)
      this.#hide()
    }
  }

  #showDialogToUnsubscribedUser () {
    if (Permission.hasNeverAsked() && !this.#storage.hasAskedNotifications()) {
      this.show()
    } else {
      Logger.debug('Dialog control not displayed: permissions already asked or already granted')
    }
  }

  show () {
    Logger.debug('Showing dialog')
    const control = document.getElementById('perfecty-push-dialog-container')
    control.style.display = 'block'
  }

  #hide () {
    Logger.debug('Hiding dialog')
    const control = document.getElementById('perfecty-push-dialog-container')
    control.style.display = 'none'
  }
}
