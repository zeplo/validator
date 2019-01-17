import { getSchemaType, isFilledObject, isSingleArray } from './util'

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

    const schemaVal = schema[modKey]
    let value = obj[key]

    // Key does not exist, so filter it out
    if (schemaVal) {
      const type = getSchemaType(schemaVal)

      // Array subtype with object sub-doc
      if (isSingleArray(type) && isFilledObject(getSchemaType(type[0]))) {
        const arrSchema = getSchemaType(type[0])
        value = value.map(val => normalize(arrSchema, val))
      }

      // Object subtype
      if (isFilledObject(type)) {
        value = normalize(type, value)
      }
    }

    out[modKey] = value
  })

  return out
}
