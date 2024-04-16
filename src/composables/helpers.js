import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js/max'

/**
 * Max length for strings, we typically mirror this to the DB's max length
 *
 * @returns {any}
 */
export const useGetGlobalStringMaxLength = () => import.meta.env.VITE_GLOBAL_STRING_MAX_LENGTH

/**
 * Hard delay for x seconds
 *
 * @param seconds
 * @returns {Promise<unknown>}
 */
export const useSleep = (seconds) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(true)
    }, seconds * 1000)
  })
}

/**
 * Check if a string is a valid phone number for a given country
 *
 * @param value
 * @param country
 * @returns {boolean}
 */
export const useIsValidMobileNumber = (value, country = 'PH') => {
  let phone

  // The library throws a NOT_A_NUMBER error if it can't parse
  // the value properly
  try {
    phone = parsePhoneNumber(value, country)
  } catch (err) {
    return false
  }

  if (!phone) return false

  return isValidPhoneNumber(value, country)
}

/**
 * Append or prepend a string (set upon the first func is initialized)
 * to the given value via lexical scoping
 *
 * @param affix
 * @param type
 * @returns {function(*): string}
 */
export const usePrependOrAppendOnce = (affix, type = 'append') => {
  if (!['append', 'prepend'].includes(type)) {
    throw new Error('Valid values are `prepend` and `append`')
  }
  return (value) => {
    return type === 'append' ? `${value}-${affix}` : `${affix}-${value}`
  }
}

/**
 * Converts a valid mobile number string without the styling
 * ex: +63 906 464 8269 => +639064648269 or 09064648269 => +639064648269
 *
 * @returns ?string
 */
export const useE164PhoneFormat = (value, country = 'PH') => {
  let phone

  // The library throws a NOT_A_NUMBER error if it can't parse
  // the value properly
  try {
    phone = parsePhoneNumber(value, country)
  } catch (err) {
    return null
  }

  if (!phone) return null

  return phone.format('E.164')
}

/**
 * Determine if an array contains one or more items from another
 *
 * @returns boolean
 */
export const useFindOneInArray = (arr1, arr2) => {
  return arr1.some((r) => arr2.includes(r))
}

/**
 * Cache a value to local storage
 *
 * @returns string
 */
export const useCacheToLocalStorage = (key, value) => {
  const stringValue = value instanceof Object ? JSON.stringify(value) : value
  localStorage.setItem(key, stringValue)
  return stringValue
}

/**
 * Retrieve a value from local storage cache
 *
 * @returns string
 */
export const useGetFromCacheLocalStorage = (key) => {
  return localStorage.getItem(key)
}

export const useSnakeCaseToTitleCase = (s) =>
  s.replace(/^_*(.)|_+(.)/g, (s, c, d) => (c ? c.toUpperCase() : ' ' + d.toUpperCase()))

/**
 * Format date time
 *
 * @param dateTime
 * @param formatWithTime
 * @returns {?string}
 */
export const useFormatDateTime = (dateTime, formatWithTime = true) => {
  if (!dateTime) return null

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  if (formatWithTime) {
    options.hour = 'numeric'
    options.minute = 'numeric'
  }

  return new Intl.DateTimeFormat('default', options).format(new Date(dateTime))
}

/**
 * Format to relative date time (e.g. 1 hour ago)
 *
 * @param dateTime
 */
export const useFormatRelativeTime = (dateTime) => {
  if (!dateTime) return null

  const options = {
    localeMatcher: 'best fit', // other values: "lookup"
    numeric: 'always', // other values: "auto"
    style: 'long', // other values: "short" or "narrow"
  }

  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerMonth = msPerDay * 30
  const msPerYear = msPerDay * 365
  const diff = new Date() - new Date(dateTime)

  if (diff < msPerMinute) {
    return new Intl.RelativeTimeFormat('default', options).format(Math.floor(-diff / 1000), 'seconds')
  }

  if (diff < msPerHour) {
    return new Intl.RelativeTimeFormat('default', options).format(Math.floor(-diff / msPerMinute), 'minutes')
  }

  if (diff < msPerDay) {
    return new Intl.RelativeTimeFormat('default', options).format(Math.floor(-diff / msPerHour), 'hours')
  }

  if (diff < msPerMonth) {
    return new Intl.RelativeTimeFormat('default', options).format(Math.floor(-diff / msPerDay), 'days')
  }

  if (diff < msPerYear) {
    return new Intl.RelativeTimeFormat('default', options).format(Math.floor(-diff / msPerMonth), 'months')
  }

  return new Intl.RelativeTimeFormat('default', options).format(Math.floor(-diff / msPerYear), 'years')
}
