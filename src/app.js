import Options from './lib/push_api/options'
import DialogControl from './controls/dialog'
import SettingsControl from './controls/settings'
import Registration from './lib/push_api/registration'
import Permission from './lib/push_api/permission'
import Features from './lib/push_api/features'
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

    drawHtmlControls()

    if (Permission.isGranted()) {
      Logger.info('The site has permissions granted')
      await checkInstallation()
      await checkRegistration()
    } else {
      Logger.info('The site has not permissions granted')
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

  const drawHtmlControls = () => {
    Logger.info('Drawing controls')

    DialogControl.draw()
    SettingsControl.draw()
  }

  const checkInstallation = async () => {
    Logger.info('Checking Service Worker installation')

    await ServiceInstaller.removeOldSubscription()
    await ServiceInstaller.removeConflicts()
    await ServiceInstaller.installIfMissing()
  }

  const checkRegistration = async () => {
    Logger.info('Checking registration')

    await Registration.check()
  }

  return {
    start
  }
})()

export default PerfectyPush

window.onload = () => {
  PerfectyPush.start(window.PerfectyPushOptions)
}
