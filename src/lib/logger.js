/**
 * Logger lib
 */

// levels
const DEBUG = 0
const INFO = 1
const WARN = 3
const ERROR = 4

// options
let verboseValue = true
let levelValue = INFO

/**
 * Change the logger options
 * @param verbose boolean
 * @param level DEBUG/INFO/WARN/ERROR
 */
function setup ({ verbose, level }) {
  if (typeof verbose !== 'undefined') verboseValue = verbose
  if (typeof level !== 'undefined') levelValue = level
}

/**
 * Log a debug message
 * @param msg
 * @param data
 */
function debug (msg, data) {
  if (verboseValue && levelValue === DEBUG) {
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
function info (msg, data) {
  if (verboseValue && levelValue <= INFO) {
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
function warn (msg, data) {
  if (verboseValue && levelValue <= WARN) {
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
function error (msg, data) {
  if (verboseValue && levelValue <= ERROR) {
    console.error(msg)
    if (typeof data !== 'undefined') {
      console.error(data)
    }
  }
}

export default {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  setup,
  debug,
  info,
  warn,
  error
}
