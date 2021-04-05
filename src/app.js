import Options from './lib/push_api/options'
import DialogControl from './controls/dialog'
import SettingsControl from './controls/settings'
import Registration from './lib/push_api/registration'
import Permission from './lib/push_api/permission'
import Features from './lib/push_api/features'
import Storage from './lib/push_api/storage'
import Logger from './lib/logger'

export default class PerfectyPush {
  /**
   * Constructor
   * @param customOptions object with all the custom options as properties
   */
  constructor (customOptions = {}) {
    Options.init(customOptions)

    Logger.setup({ verbose: Options.loggerVerbose, level: Options.loggerLevel })
  }

  /**
   * Start Perfecty Push if the requirements are fulfilled
   * @returns {boolean} true if successful, otherwise false
   */
  async start () {
    Logger.info('Starting Perfecty Push SDK')
    Logger.debug('SDK options', Options)

    if (!this.#isSupportedAndEnabled()) {
      Logger.info('Browser is not supported or the SDK is not enabled')
      return false
    }

    this.#drawHtmlControls()
    await this.#checkRegistration()

    Logger.info('Perfecty Push SDK was started')
    return true
  }

  /**
   * Check if the browser has the required features and if Perfecty is enabled
   * @returns {*|boolean} true if supported and enabled, otherwise false
   */
  #isSupportedAndEnabled () {
    return (Features.isSupported() && Options.enabled)
  }

  #drawHtmlControls () {
    Logger.info('Drawing controls')

    DialogControl.draw()
    SettingsControl.draw()
  }

  async #checkRegistration () {
    Logger.info('Checking user registration')
    if (Permission.isGranted()) {
      Logger.info('The site has permissions granted')

      const response = await Registration.assureRegistration()

      if (response !== false) {
        Storage.setUserId(response.uuid)
        await SettingsControl.setCheckboxActive(true)
      }
    } else {
      Logger.info('The site has not permissions granted')
    }
  }
}

window.onload = () => {
  const app = new PerfectyPush(window.PerfectyPushOptions)
  app.start()
}
