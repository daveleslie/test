const oid = '1.3.6.1.2.1.33.1.6.2.1.3.62635'

let oidParent = oid.split('.').slice(0, -1).join('.')
let oidChild = oid.split('.').slice(-1)

console.log('oid: ', oid)
console.log('parent: ', oidParent)
console.log('child: ', oidChild)