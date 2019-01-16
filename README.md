# Zeplo Validator

Validates a schema, using JS objects and validator functions. Also, allows for warnings.

Install with:

```
yarn add @zeplo/validator
```

### Usage

```js
const validator = require('@zeplo/validator')

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
    postcode: String,
    number: Number,
  },
}

// errors = [{
//   severity: 'error',
//   key: 'name',
//   message: 'Error message',
//   schema: { type: String, ... },
// }]

const errors = validate(schema, config)
```
