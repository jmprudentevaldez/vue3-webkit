import { helpers } from '@vuelidate/validators'
import { usePublicStore } from '@/stores/public'
import { parsePhoneNumber } from 'libphonenumber-js/max'

// must have one lowercase & uppercase letter, one number
export const usePasswordRule = () => helpers.regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)

// validate a certain count of digits
export const useDigitCountRule = (numOfDigits) => (value) => {
  if (value === null || value === '' || value === undefined) return true

  const pattern = '^\\d{' + numOfDigits + '}$'
  const regex = new RegExp(pattern)
  return regex.test(value)
}

/**
 * Check if file is a certain mime type
 *
 * @param mimeTypes
 * @returns {function(*): *}
 */
export const useMimeTypeRule = (mimeTypes) => (value) => {
  if (!Array.isArray(mimeTypes)) throw new Error('mimeTypes param#2 must be an array')
  if (value && !(value instanceof File)) throw new Error('file param#1 must be a File')

  return mimeTypes.includes(value.type)
}

/**
 * Max file size rule
 * @param maxMb
 * @returns {function(*): boolean}
 */
export const useMaxFileSizeRule = (maxMb) => (value) => {
  if (value && !(value instanceof File)) throw new Error('file param#1 must be a File')

  return value.size <= maxMb * 1024 * 1024
}

export const useMobilePhoneRule = (value, country = 'PH') => {
  if (value === null || value === '' || value === undefined) return true

  let phone

  try {
    phone = parsePhoneNumber(value, country)
  } catch (err) {
    return false
  }

  if (!phone) return false

  return phone.isValid()
}

export const useDateFormatRule = (value) => {
  if (value === null || value === '' || value === undefined) return true

  // Validates yyyy-mm-dd format
  const regEx = /^\d{4}-\d{2}-\d{2}$/
  if (!value.match(regEx)) return false // Invalid format

  const d = new Date(value)
  const dNum = d.getTime()
  if (!dNum && dNum !== 0) return false // NaN value, Invalid date

  return d.toISOString().slice(0, 10) === value
}

const publicStore = usePublicStore()
export const useUniqueUserIdentifierRule =
  (key, excludedId = null) =>
  async (value) => {
    if (!['email', 'mobile_number'].includes(key)) {
      const errorMessage = 'Key must either be `mobile_number`, or `email`'
      throw new Error(errorMessage)
    }

    if (value === null || value === '' || value === undefined) return true

    const res = await publicStore.checkAvailability(key, value, excludedId)
    return res.data?.is_available
  }

export const useMaxDateTodayRule = (value) => {
  if (value === null || value === '' || value === undefined) return true

  const d = new Date(value)
  return Date.now() >= d
}
