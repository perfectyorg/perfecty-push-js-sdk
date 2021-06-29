import Options from './lib/push_api/options'
import DialogControl from './controls/dialog'
import SettingsControl from './controls/settings'
import Registration from './lib/push_api/registration'
import Permission from './lib/push_api/permission'
import Features from './lib/push_api/features'
import Storage from './lib/push_api/storage'
import Logger from './lib/logger'
import ServiceInstaller from './lib/push_api/service_installer'

const PerfectyPush = (() => {
  /**
   * Start Perfecty Push if the requirements are fulfilled
   * @param customOptions object with all the custom options as properties
   * @returns {boolean} true if successful, otherwise false
   */
  const start = async (customOptions = {}) => {
    Options.init(customOptions)
    Logger.setup({ verbose: Options.loggerVerbose, level: Options.loggerLevel })

    Logger.info('Starting Perfecty Push SDK')
    Logger.debug('SDK options', Options)

    if (!isSupportedAndEnabled()) {
      Logger.info('Browser is not supported or the SDK is not enabled')
      return false
    }

    await ServiceInstaller.removeConflicts()

    if (!hasMinimumVisits()) {
      Logger.info('Do not show yet. Required visits to display the prompt: ' + Options.visitsToDisplayPrompt)
      return true
    }

    if (Options.askPermissionsDirectly) {
      await askPermissionsDirectly()
    } else {
      drawHtmlControls()
    }

    if (Permission.isGranted() && Storage.optedOut() === false) {
      Logger.info('The user is subscribed to Push Notifications')
      await checkInstallation()
      await checkRegistration()
    } else {
      Logger.info('The user is not subscribed to Push Notifications')
    }

    Logger.info('Perfecty Push SDK was started')
    return true
  }

  /**
   * Check if the browser has the required features and if Perfecty is enabled
   * @returns {*|boolean} true if supported and enabled, otherwise false
   */
  const isSupportedAndEnabled = () => {
    return (Features.isSupported() && Options.enabled)
  }

  /**
   * Returns if the minimum number of visits has been reached.
   * In case the permissions have already been asked, it will always be true,
   * otherwise it will track the number of visits in the Local Storage
   * @returns {boolean} true if the visitsToDisplayPrompt is reached
   */
  const hasMinimumVisits = () => {
    if (Permission.askedAlready()) {
      return true
    }

    const visits = Storage.totalVisits() + 1
    Storage.setTotalVisits(visits)

    return visits >= Options.visitsToDisplayPrompt
  }

  const drawHtmlControls = () => {
    Logger.info('Drawing controls')

    DialogControl.draw()
    SettingsControl.draw()
  }

  const askPermissionsDirectly = async () => {
    if (Permission.askedAlready()) {
      // if we already have asked for permissions, we don't ask again
      return true
    }

    await Permission.askIfNotDenied()
    if (Permission.isGranted()) {
      Logger.info('User has granted permissions')

      const userId = Storage.userId()
      await ServiceInstaller.installIfMissing()
      await Registration.register(userId, true)
    }
  }

  const checkInstallation = async () => {
    Logger.info('Checking Service Worker installation')

    await ServiceInstaller.removeOldSubscription()
    await ServiceInstaller.installIfMissing()
  }

  const checkRegistration = async () => {
    Logger.info('Checking registration')

    await Registration.check(Storage.userId(), Storage.optedOut())
  }

  return {
    start
  }
})()

export default PerfectyPush

window.onload = () => {
  PerfectyPush.start(window.PerfectyPushOptions)
}
