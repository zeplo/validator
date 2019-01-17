export function normalizeTypeName (type) {
  if (type === Number || type === 'number') return 'number'

  if (type === Boolean || type === 'boolean') return 'boolean'

  if (type === Array || type === 'array' || Array.isArray(type)) return 'array'

  if (type === Date || type === 'date') return 'date'

  if (type === Function || type === 'function') return 'function'

  if (type === Object || type === 'object' || isObject(type)) return 'object'

  if (type === String || type === 'string') return 'string'

  throw new Error(`Invalid type ${type}`)
}

export function getTypeFromValue (value) {
  const type = typeof value
  if (type !== 'object') return type

  if (isDate(value)) return 'date'

  if (Array.isArray(value)) return 'array'

  if (isDate(value)) return 'date'

  if (value instanceof Function) return 'function'

  if (value instanceof String) return 'string'

  return type
}

export function isDate (value) {
  return value instanceof Date
}

export function isObject (value) {
  return value !== null && typeof value === 'object' && !(value instanceof Array)
}
