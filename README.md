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
  },
  age: Number,
  email: {
    type: String,
    test: value => value.indexOf('@') > -1 ? null : 'Invalid e-mail address'
  },
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

const errors = validate(schema, config)
```
