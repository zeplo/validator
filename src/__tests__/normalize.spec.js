import oneOfType from '../oneoftype'
import normalize from '../normalize'

describe('normalize.spec', () => {
  describe('Normalize alias fields', () => {
    test('normalize string alias field', () => {
      const res = normalize({
        name: {
          type: String,
          alias: 'fname',
        },
        age: Number,
      }, { fname: 'John', age: 20 })

      expect(res).toEqual({
        name: 'John',
        age: 20,
      })
    })

    test('normalize string alias with optional field', () => {
      const res = normalize({
        name: {
          type: String,
          alias: 'fname',
        },
        age: {
          type: String,
        },
      }, { fname: 'John' })

      expect(res).toEqual({
        name: 'John',
      })
    })

    test('normalize array of strings alias field', () => {
      const res = normalize({
        animals: {
          type: [String],
          alias: 'nature',
        },
      }, { nature: ['rabbit', 'dog'] })

      expect(res).toEqual({
        animals: ['rabbit', 'dog'],
      })
    })

    test('normalize with unknown field', () => {
      const res = normalize({
        name: {
          type: String,
          alias: 'fname',
        },
      }, { fname: 'John', unknown: 1 })

      expect(res).toEqual({ name: 'John', unknown: 1 })
    })

    test('normalize object alias field', () => {
      const res = normalize({
        animals: {
          type: Object,
          alias: 'nature',
        },
      }, { nature: { dog: true, rabbit: false } })

      expect(res).toEqual({
        animals: { dog: true, rabbit: false },
      })
    })

    test('normalize object multi-depth alias', () => {
      const res = normalize({
        animals: {
          type: {
            fury: {
              type: Boolean,
              alias: 'fur',
            },
          },
        },
      }, { animals: { fur: true } })

      expect(res).toEqual({
        animals: { fury: true },
      })
    })

    test('normalize array multi-depth alias - short form', () => {
      const res = normalize({
        animals: [{
          type: {
            name: {
              type: String,
              alias: 'type',
            },
          },
        }],
      }, { animals: [{ type: 'dog' }] })

      expect(res).toEqual({
        animals: [{ name: 'dog' }],
      })
    })

    test('normalize array multi-depth alias - long form', () => {
      const res = normalize({
        animals: [{
          type: {
            name: {
              type: String,
              alias: 'type',
            },
          },
        }],
      }, { animals: [{ type: 'dog' }] })

      expect(res).toEqual({
        animals: [{ name: 'dog' }],
      })
    })
  })

  describe('Normalize oneOfType alias fields', () => {
    test('normalize string alias field', () => {
      const res = normalize({
        name: {
          type: oneOfType(String, Number),
          alias: 'fname',
        },
        age: Number,
      }, { fname: 'John', age: 20 })

      expect(res).toEqual({
        name: 'John',
        age: 20,
      })
    })

    test('normalize nested object alias field', () => {
      const res = normalize({
        animals: oneOfType(String, {
          type: {
            fury: {
              type: Boolean,
              alias: 'fur',
            },
          },
        }),
      }, { animals: { fur: true } })

      expect(res).toEqual({
        animals: { fury: true },
      })
    })

    test('normalize array multi-depth alias', () => {
      const res = normalize({
        animals: [oneOfType(String, {
          type: {
            name: {
              type: String,
              alias: 'type',
            },
          },
        })],
      }, { animals: [{ type: 'dog' }] })

      expect(res).toEqual({
        animals: [{ name: 'dog' }],
      })
    })
  })
})
