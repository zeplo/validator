# Zeplo Validator

Multi-depth schema validator, using JS types and custom validator functions. Outputs an array of all errors, so you can format them as you need.

Install with:

```
yarn add @zeplo/validator
```

### Usage

```js
const validator, { oneOfType } = require('@zeplo/validator')

const schema = {
  name: {
    type: String,
    alias: 'nickname',
    required: true,
  },
  email: {
    type: String,
    test: value => value.indexOf('@') > -1 ? null : 'Invalid e-mail address'
  },
  age: {
    type: Number,
    test: value => value > 200 ? ({
      message: 'You can\'t be the that old!',
      severity: 'warning',
      anyprop: 1,
    })
  },
  country: String,
  gender: {
    type: String,
    oneOf: ['male', 'female'],
  },
  pets: [String],
  address: {
    type: {
      postcode: oneOfType(String, Number),
      number: Number,
    }
  },
}

// errors = [{
//   severity: 'error',
//   keyPath: 'address.postcode',
//   message: 'Error message',
//   schema: { type: String },
// }]

const errors = validator(schema, config)
```
