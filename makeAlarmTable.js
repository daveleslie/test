const alarmMibMap = require('./utils/upsMibObj')
const mibMap = require('./utils/upsMibMap')

// const upsDataEntry = require('./upsData/ups652')
// const upsDataEntry = require('./upsData/ups652copy')
// const upsDataEntry = require('./upsData/ups629')
// const upsDataEntry = require('./upsData/ups686')


// const upsDataEntry = require('./upsData/ups125WW')
// const upsDataEntry = require('./upsData/ups125WWcopy')
// const upsDataEntry = require('./upsData/ups294WW')
// const upsDataEntry = require('./upsData/ups347WW')
// const upsDataEntry = require('./upsData/ups350WW')

// const upsDataEntry = require('./upsData/ups528WW')
// const upsDataEntry = require('./upsData/ups554WW')
// const upsDataEntry = require('./upsData/ups554WWcopy')
const upsDataEntry = require('./upsData/ups86WW')
// const upsDataEntry = require('./upsData/ups613WW')


const alarmOid = '1.3.6.1.2.1.33.1.6' // 18
const alarmTableEntry = '1.3.6.1.2.1.33.1.6.2.1' // 22
const wellKnownAlarms = '1.3.6.1.2.1.33.1.6.3' // length 20

// console.log(alarmOid.slice(0,18))

console.log(`



=========================================================
`)

let alarmsPresent = 0

// get all alarms
const alarms = upsDataEntry.filter(elem => {
  return elem[0].slice(0, 18) === alarmOid
})

// get number of alarms present
for (let a of alarms) {
  if (a[0] === '1.3.6.1.2.1.33.1.6.1.0' || a[0] === '1.3.6.1.2.1.33.1.6.1') {
    if (a[1].slice(0, 7).toUpperCase() === "GAUGE: ") {
      alarmsPresent = parseInt(a[1].slice(7), 10)
    }
    if (a[1].slice(0, 9) === "INTEGER: ") {
      alarmsPresent = parseInt(a[1].slice(9), 10)
    }
  }
}

// get wellKnownAlarms
const knownAlarms = alarms.filter(elem => {
  return elem[0].slice(0, 20) === wellKnownAlarms
})

let activeKnownAlarms = []

knownAlarms.forEach(alarm => {
  if (alarm[1].slice(0, 9) === "INTEGER: " && parseInt(alarm[1].slice(9), 10) === 1) {
    // console.log(alarmMibMap[alarm[0]])
    activeKnownAlarms.push(alarmMibMap[alarm[0]])
  }
})

const alarmTableEntries = alarms.filter(elem => {
  return elem[0].slice(0, 22) === alarmTableEntry
})

// console.log(alarmTableEntries)

const alarmTable = {}

alarmTableEntries.forEach(entry => {
  let oidParent = entry[0].split('.').slice(0, -1).join('.')
  let oidChild = entry[0].split('.').slice(-1)
  if (!alarmTable[oidChild]) alarmTable[oidChild] = {}
  
  // get alarm ids
  if (oidParent === '1.3.6.1.2.1.33.1.6.2.1.1') {
    alarmTable[oidChild].alarmId = entry[1].slice(-1)
  }

  // get all alarm descriptions
  if (oidParent === '1.3.6.1.2.1.33.1.6.2.1.2') {
    alarmTable[oidChild].alarmDesc = alarmMibMap[entry[1].slice(19)]?.name
    if (!activeKnownAlarms.includes(alarmTable[oidChild].alarmDesc)) {
      activeKnownAlarms.push(alarmMibMap[entry[1].slice(19)]?.name) 
    }
  }

  //get alarm timestamps
  if (oidParent === '1.3.6.1.2.1.33.1.6.2.1.3') {
    alarmTable[oidChild].alarmTime = entry[1].toString()
    // console.log('is alarm')
  }

})

// check alarm table for wellKnownAlarms
// Object.keys(alarmTable).forEach(key => {
//   if(alarmTable[key].alarmDesc)
// })

// alarmTableEntries.forEach(entry => {
//   let oid = entry[0]
//   if (entry[0].split('.').length === 13) oid = entry[0].split('.').slice(0, -1).join('.')
//   entry.unshift(alarmMibMap[oid].name)

//   if (entry[2].slice(0,19) === 'OBJECT IDENTIFIER: ') {
//     entry[2] = alarmMibMap[entry[2].slice(19)].name
//   }
// })

console.log('Alarms Present: ', alarmsPresent)

console.log('Alarm Table: ', alarmTable)
// console.log('Well Known Alarms', knownAlarms)
console.log('Active Known Alarms', activeKnownAlarms)

// console.log('alarmTableEntries', alarmTableEntries)

// alarms.forEach(elem => {
//   let oidName
//   const oid = elem[0]
//   console.log('raw elem', elem)
//   if (typeof alarmMibMap[oid] === 'undefined') {
//     oidSpec = alarmMibMap[oid.slice(0,-2)]
//   } else {
//     oidSpec = alarmMibMap[oid]
//   }

//   elem[0] = { name: oidSpec.name }
//   console.log('processed: ', elem)
//   console.log('-------------------')
// })

// console.log(alarms)

// upsDataEntry.forEach(elem => {
//   const oid = elem[0]
//   elem.unshift(alarmMibMap[oid])
// })
