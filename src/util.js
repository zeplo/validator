import { OneOfType } from './oneoftype'

export function getSchemaType (schema) {
  return !schema.type ? schema : schema.type
}

export function getSchemaFromValue (schema, value) {
  const type = getSchemaType(schema)
  if (type instanceof OneOfType) {
    const valueType = getTypeFromValue(value)
    const selectedSchema = type.types
      .filter(s => normalizeTypeName(getSchemaType(s)) === valueType).shift()
    return selectedSchema
  }
  return schema
}

export function valueIsValidType (schema, value) {
  const type = getSchemaType(schema)
  const valueType = getTypeFromValue(value)
  if (type instanceof OneOfType) {
    return !!type.types.filter(s => normalizeTypeName(getSchemaType(s)) === valueType).length
  }
  return normalizeTypeName(type) === valueType
}

export function normalizeTypeName (type) {
  if (type instanceof OneOfType) return type.types.map(t => normalizeTypeName(t)).join('|')

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

export function isFilledObject (value) {
  return isObject(value) && Object.keys(value).length > 0
}

export function isSingleArray (value) {
  return Array.isArray(value) && value.length === 1 && !!value[0]
}
