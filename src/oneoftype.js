export class OneOfType {
  constructor (types) {
    this.types = types
  }
}

export default (...types) => {
  return new OneOfType(types)
}
