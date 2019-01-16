import validate from '../validator'

describe('schema-validator.spec', () => {
  describe('No error for valid type by constructor', () => {
    test('validates String type', () => {
      const errors = validate({
        prop1: String,
      }, { prop1: 'Hello' })
      expect(errors).toHaveLength(0)
    })

    test('validates Boolean type', () => {
      const errors = validate({
        prop1: Boolean,
        prop2: Boolean,
      }, { prop1: false, prop2: true })
      expect(errors).toHaveLength(0)
    })

    test('validates Date type', () => {
      const errors = validate({
        prop1: Date,
      }, { prop1: new Date() })
      expect(errors).toHaveLength(0)
    })

    test('validates Number type', () => {
      const errors = validate({
        prop1: Number,
      }, { prop1: 10 })
      expect(errors).toHaveLength(0)
    })

    test('validates Object type', () => {
      const errors = validate({
        prop1: Object,
      }, { prop1: {} })
      expect(errors).toHaveLength(0)
    })

    test('validates Array type', () => {
      const errors = validate({
        prop1: Array,
      }, { prop1: [] })
      expect(errors).toHaveLength(0)
    })

    test('validates Function type', () => {
      const errors = validate({
        prop1: Function,
      }, { prop1: () => {} })
      expect(errors).toHaveLength(0)
    })
  })

  describe('Error for invalid type by constructor', () => {
    test('validates String type', () => {
      const errors = validate({
        prop1: String,
      }, { prop1: 22 })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Boolean type', () => {
      const errors = validate({
        prop1: Boolean,
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <boolean>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Date type', () => {
      const errors = validate({
        prop1: Date,
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <date>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Number type', () => {
      const errors = validate({
        prop1: Number,
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <number>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Object type', () => {
      const errors = validate({
        prop1: Object,
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <object>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Array type', () => {
      const errors = validate({
        prop1: Array,
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <array>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Function type', () => {
      const errors = validate({
        prop1: Function,
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <function>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('Invalid type', () => {
      const errors = () => validate({
        prop1: 'invalid',
      }, { prop1: () => {} })
      expect(errors).toThrowErrorMatchingSnapshot()
    })
  })

  describe('Error for invalid type by name', () => {
    test('validates String type', () => {
      const errors = validate({
        prop1: 'string',
      }, { prop1: 22 })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <string>')
      expect(errors[0].message).toMatch('received value <number>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Boolean type', () => {
      const errors = validate({
        prop1: 'boolean',
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <boolean>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Date type', () => {
      const errors = validate({
        prop1: 'date',
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <date>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Number type', () => {
      const errors = validate({
        prop1: 'number',
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <number>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Object type', () => {
      const errors = validate({
        prop1: 'object',
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <object>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Array type', () => {
      const errors = validate({
        prop1: 'array',
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <array>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Function type', () => {
      const errors = validate({
        prop1: 'function',
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <function>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })
  })

  describe('In-built validators', () => {
    test('validates property exists on schema', () => {
      const errors = validate({
        prop1: String,
      }, { unknown: 'D' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('Unknown key at `unknown`')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates required fields', () => {
      const errors = validate({
        prop1: {
          type: String,
          required: true,
        },
      }, { })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('Missing required key `prop1`')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates oneOf', () => {
      const errors = validate({
        prop1: {
          type: String,
          oneOf: ['A', 'B'],
        },
      }, { prop1: 'D' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('must be one of A, B')
      expect(errors[0]).toMatchSnapshot()
    })
  })

  describe('Error for invalid type by constructor in type prop', () => {
    test('validates String type', () => {
      const errors = validate({
        prop1: {
          type: String,
        },
      }, { prop1: 22 })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Boolean type', () => {
      const errors = validate({
        prop1: {
          type: Boolean,
        },
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <boolean>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Date type', () => {
      const errors = validate({
        prop1: {
          type: Date,
        },
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <date>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Number type', () => {
      const errors = validate({
        prop1: {
          type: Number,
        },
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <number>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Object type', () => {
      const errors = validate({
        prop1: {
          type: Object,
        },
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <object>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Array type', () => {
      const errors = validate({
        prop1: {
          type: Array,
        },
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <array>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })

    test('validates Function type', () => {
      const errors = validate({
        prop1: {
          type: Function,
        },
      }, { prop1: 'hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <function>')
      expect(errors[0].message).toMatch('received value <string>')
      expect(errors[0]).toMatchSnapshot()
    })
  })

  describe('Validates nested props', () => {
    test('Valid nested object with string and number types', () => {
      const errors = validate({
        prop1: {
          subprop1: String,
          subprop2: Number,
        },
      }, { prop1: { subprop1: 'hello', subprop2: 122 } })
      expect(errors).toHaveLength(0)
    })

    test('Invalid nested object with string and number types', () => {
      const errors = validate({
        prop1: {
          subprop1: String,
          subprop2: Number,
        },
      }, { prop1: { subprop1: 22, subprop2: 'Hello' } })
      expect(errors).toHaveLength(2)
      expect(errors[0].message).toMatch('expected type <string>')
      expect(errors[0].message).toMatch('received value <number>')
      expect(errors).toMatchSnapshot()
    })

    test('Valid nested array with string and number types', () => {
      const errors = validate({
        prop1: [{
          subprop1: String,
          subprop2: Number,
        }],
      }, { prop1: [{ subprop1: 'hello', subprop2: 122 }] })
      expect(errors).toHaveLength(0)
    })

    test('Invalid nested array with string and number types', () => {
      const errors = validate({
        prop1: [{
          subprop1: String,
          subprop2: Number,
        }],
      }, { prop1: [{ subprop1: 22, subprop2: 'Hello' }] })
      expect(errors).toHaveLength(2)
      expect(errors[0].message).toMatch('expected type <string>')
      expect(errors[0].message).toMatch('received value <number>')
      expect(errors).toMatchSnapshot()
    })

    test('Valid nested array with schema field named type', () => {
      const errors = validate({
        type: {
          subprop1: String,
          subprop2: Number,
        },
      }, { type: { subprop1: 'Hello', subprop2: 22 } })
      expect(errors).toHaveLength(0)
    })

    test('Invalid nested array with schema field named type', () => {
      const errors = validate({
        type: {
          subprop1: String,
          subprop2: Number,
        },
      }, { type: { subprop1: 22, subprop2: 'Hello' } })
      expect(errors).toHaveLength(2)
      expect(errors[0].message).toMatch('expected type <string>')
      expect(errors[0].message).toMatch('received value <number>')
      expect(errors).toMatchSnapshot()
    })

    test('Valid nested obj with deep field named type', () => {
      const errors = validate({
        prop1: {
          type: {
            type: String,
          },
        },
      }, { prop1: { type: 'Hello' } })
      expect(errors).toHaveLength(0)
    })

    test('Invalid nested obj with deep field named type', () => {
      const errors = validate({
        prop1: {
          type: {
            type: String,
          },
        },
      }, { prop1: { type: 22 } })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toMatch('expected type <string>')
      expect(errors[0].message).toMatch('received value <number>')
      expect(errors).toMatchSnapshot()
    })

    test('Valid nested array with deep field named type', () => {
      const errors = validate({
        prop1: [{
          type: String,
        }],
      }, { prop1: ['Hello'] })
      expect(errors).toHaveLength(0)
    })
  })

  describe('Test fn', () => {
    test('Test fn returns no error', () => {
      const errors = validate({
        prop1: {
          type: String,
          test: () => null,
        },
      }, { prop1: 'Hello' })
      expect(errors).toHaveLength(0)
    })

    test('Test fn returns an error', () => {
      const errors = validate({
        prop1: {
          type: String,
          test: () => 'I always return an error',
        },
      }, { prop1: 'Hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].severity).toEqual('error')
      expect(errors[0].message).toEqual('I always return an error')
    })

    test('Test fn is called with correct params', () => {
      const fn = jest.fn()
      const sub = { sub1: 'test1', sub2: 'test2' }
      const obj = { prop1: sub }
      validate({
        prop1: {
          sub1: {
            type: String,
            test: fn,
          },
          sub2: String,
        },
      }, obj)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('test1', obj, sub, 'prop1.sub1')
    })

    test('Test fn returns custom error', () => {
      const errors = validate({
        prop1: {
          type: String,
          test: () => ({ message: 'I\'m warning you', severity: 'warning' }),
        },
      }, { prop1: 'Hello' })
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toEqual('I\'m warning you')
    })
  })

  describe('Alias', () => {
    test('Alias is allowed', () => {
      const errors = validate({
        prop1: {
          alias: 'prop2',
          type: String,
        },
      }, { prop2: 'Hello' })
      expect(errors).toHaveLength(0)
    })
  })
})
