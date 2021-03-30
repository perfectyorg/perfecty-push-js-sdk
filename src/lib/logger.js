/**
 * Logger lib
 */
export default class Logger {
  // levels
  static DEBUG = 0
  static INFO = 1
  static WARN = 3
  static ERROR = 4

  // options
  static #verbose = true
  static #level = Logger.INFO

  /**
   * Change the logger options
   * @param verbose boolean
   * @param level DEBUG/INFO/WARN/ERROR
   */
  static setup ({ verbose, level }) {
    if (typeof verbose !== 'undefined') Logger.#verbose = verbose
    if (typeof level !== 'undefined') Logger.#level = level
  }

  /**
   * Log a debug message
   * @param msg
   * @param data
   */
  static debug (msg, data) {
    if (Logger.#verbose && Logger.#level === Logger.DEBUG) {
      console.debug(msg)
      if (typeof data !== 'undefined') {
        console.debug(data)
      }
    }
  }

  /**
   * Log an info message
   * @param msg
   * @param data
   */
  static info (msg, data) {
    if (Logger.#verbose && Logger.#level <= Logger.INFO) {
      console.info(msg)
      if (typeof data !== 'undefined') {
        console.info(data)
      }
    }
  }

  /**
   * Log a warning message
   * @param msg
   * @param data
   */
  static warn (msg, data) {
    if (Logger.#verbose && Logger.#level <= Logger.WARN) {
      console.warn(msg)
      if (typeof data !== 'undefined') {
        console.warn(data)
      }
    }
  }

  /**
   * Log an error message
   * @param msg
   * @param data
   */
  static error (msg, data) {
    if (Logger.#verbose && Logger.#level <= Logger.ERROR) {
      console.error(msg)
      if (typeof data !== 'undefined') {
        console.error(data)
      }
    }
  }
}
