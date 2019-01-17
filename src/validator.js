import { normalizeTypeName, getTypeFromValue, isObject } from './util'

export default function validate (schema, obj) {
  const state = { all: obj, errors: [] }
  validateObject(schema, obj, state)
  return state.errors
}

export function validateObject (schema, obj, state, prefix = '') {
  // Combine aliases in schema
  const combinedSchema = {}
  const schemaKeys = []
  Object.keys(schema).forEach((key) => {
    schemaKeys.push(key)
    combinedSchema[key] = schema[key]
    if (schema[key].alias) {
      schemaKeys.push(schema[key].alias)
      combinedSchema[schema[key].alias] = schema[key]
    }
  })

  const keys = schemaKeys.concat(Object.keys(obj))
  const set = new Set(keys)

  set.forEach((key) => {
    const schemaVal = combinedSchema[key]
    const objVal = obj[key]
    const keyPath = `${prefix}${prefix && '.'}${key}`

    // Unknown property
    if (!schemaVal) {
      state.errors.push({
        severity: 'warning',
        key: keyPath,
        value: objVal,
        message: `Unknown key at \`${keyPath}\``,
      })
      return
    }

    // Required but missing - only run for non-alias key and check if a value
    // is provided for the alias instead
    const isAlias = schemaVal.alias === key
    if (schemaVal.required && !objVal && !isAlias && !obj[schemaVal.alias]) {
      state.errors.push({
        severity: 'error',
        key: keyPath,
        value: objVal,
        message: `Missing required key \`${keyPath}\``,
      })
      return
    }

    validateType(schemaVal, objVal, state, keyPath, obj, key)
  })
}

export function validateType (schema, value, state, keyPath = '', obj) {
  // Non-required and missing
  if (!schema.required && !schema.testEmpty && !value) {
    return
  }

  // Check type is valid
  // TODO: we need to find a better way to do this!
  const type = !schema.type ? schema : schema.type
  const typeName = normalizeTypeName(type)
  if (value && typeName !== getTypeFromValue(value)) {
    state.errors.push({
      severity: 'error',
      keyPath,
      value,
      message: `Invalid type for \`${keyPath}\` expected type <${typeName}> but received value <${getTypeFromValue(value)}> ${value.toString()}`,
    })
    return
  }

  // Check for oneOf
  if (value && schema.oneOf && schema.oneOf.indexOf(value) === -1) {
    state.errors.push({
      severity: 'error',
      keyPath,
      value,
      schema,
      message: `Invalid option selected for \`${keyPath}\` must be one of ${schema.oneOf.join(', ')}`,
    })
  }

  // If test
  if (schema.test) {
    const test = schema.test(value, state.all, obj, keyPath)
    if (test) {
      const merge = isObject(test) ? test : { message: test }
      state.errors.push({
        severity: 'error',
        keyPath,
        value,
        schema,
        ...merge,
      })
    }
  }

  // Array subtype must have value at index 0
  if (Array.isArray(type) && type.length === 1 && !!type[0]) {
    const arrSchema = type[0]
    value.forEach((val, i) => {
      validateType(arrSchema, val, state, `${keyPath}.${i}`, i)
    })
    return
  }

  // Object subtype must have props and be under schema.type
  // (to prevent conflicts with validating a schema with type field)
  if (schema.type && isObject(schema.type) && Object.keys(schema.type).length > 0) {
    validateObject(schema.type, value, state, `${keyPath}`)
  }
}
