module.exports = (obj, key) => {
  // return (obj !== null && obj !== undefined && Object.prototype.hasOwnProperty.call(obj, prop));
  const test = key.toString().split('.')
  console.log('test: ', test)
  const result = key
    .toString()
    .split('.')
    .reduce((o, x) => {
      console.log("o: ", o)
      console.log("x: ", x)
      console.log("type: ", typeof o)
      console.log(o[x])
      return typeof o === 'undefined' || o === null ? o : o[x]
    }, obj)
    console.log('result: ', result)
  return !(result === undefined || result === null)
}
