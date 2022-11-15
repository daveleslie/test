const oid = '1.3.6.1.2.1.33.1.6.2.1.2.62635'

const split = oid.split('.')

const final = oid.split('.').slice(0, -1).join('.') 

console.log('unprocessed: ', oid)
// console.log('split: ', split)
console.log('final: ', final)