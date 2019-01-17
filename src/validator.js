import { getTypeFromSchema, getTypeFromValue, isObject } from './util'

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

export function validateType (schemaVal, objVal, state, prefix = '', obj) {
  const keyPath = prefix

  // Non-required and missing
  if (!schemaVal.required && !schemaVal.testEmpty && !objVal) {
    return
  }

  // Check type is valid
  const type = schemaVal.type && !schemaVal.type.type ? schemaVal.type : schemaVal
  if (objVal && !isValidByType(type, objVal)) {
    state.errors.push({
      severity: 'error',
      key: keyPath,
      value: objVal,
      message: `Invalid type for \`${keyPath}\` expected type <${getTypeFromSchema(type)}> but received value <${getTypeFromValue(objVal)}> ${objVal.toString()}`,
    })
    return
  }

  // Check for oneOf
  if (objVal && schemaVal.oneOf && schemaVal.oneOf.indexOf(objVal) === -1) {
    state.errors.push({
      severity: 'error',
      key: keyPath,
      value: objVal,
      schema: schemaVal,
      message: `Invalid option selected for \`${keyPath}\` must be one of ${schemaVal.oneOf.join(', ')}`,
    })
  }

  // If test
  if (schemaVal.test) {
    const test = schemaVal.test(objVal, state.all, obj, keyPath)
    if (test) {
      const merge = isObject(test) ? test : { message: test }
      state.errors.push({
        severity: 'error',
        key: keyPath,
        value: objVal,
        schema: schemaVal,
        ...merge,
      })
    }
  }

  // Check if array type
  if (Array.isArray(type)) {
    const arrSchema = type[0]
    objVal.forEach((val, i) => {
      validateType(arrSchema, val, state, `${keyPath}.${i}`, i)
    })
    return
  }

  // Check if object type
  if (isObject(type)) {
    const objSchema = type
    validateObject(objSchema, objVal, state, `${keyPath}`)
  }
}

function isValidByType (type, value) {
  return getTypeFromSchema(type) === getTypeFromValue(value)
}
