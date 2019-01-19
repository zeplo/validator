import { getSchemaType, getSchemaFromValue, isFilledObject, isSingleArray } from './util'

export default function normalize (schema, obj) {
  // Combine aliases in schema
  const aliasMap = {}
  Object.keys(schema).forEach((key) => {
    if (schema[key].alias) {
      aliasMap[schema[key].alias] = key
    }
  })

  const keys = Object.keys(obj)
  const out = {}

  // Loop through all keys
  keys.forEach((key) => {
    const modKey = aliasMap[key] ? aliasMap[key] : key

    let value = obj[key]
    const schemaVal = schema[modKey]

    // Key does not exist, so filter it out
    if (schemaVal) {
      const schemaFromVal = getSchemaFromValue(schemaVal, value)
      const type = getSchemaType(schemaFromVal)


      // Array subtype with object sub-doc
      if (isSingleArray(type) && value[0]) {
        const arrSchema = getSchemaFromValue(type[0], value[0])
        if (arrSchema && arrSchema.type && isFilledObject(arrSchema.type)) {
          value = value.map(val => normalize(arrSchema.type, val))
        }
      }

      // Object subtype
      if (schemaFromVal.type && isFilledObject(schemaFromVal.type)) {
        value = normalize(schemaFromVal.type, value)
      }
    }

    out[modKey] = value
  })

  return out
}
