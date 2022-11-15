const upsAlarmMap = require('../utils/upsAlarmMiBMap')

const json = require('../upsData/json/quick')

const data = json.basic[0].upsData

// console.log('ww :', data)

const alarmArr = []
let alarmCount = 0
for (let q = 0; q < data.length; q++) {
 
  if (Object.keys(upsAlarmMap).includes(data[q][0])) {
    const alarmData = data[q]
    console.log(alarmData[1].slice(-1))
    if (alarmData[1].slice(-1) === '1') {
      alarmData.unshift(upsAlarmMap[data[q][0]])
      alarmArr.push(alarmData)
      alarmCount++
    }


    // console.log(alarmData) 
    // console.log('alarm count: ', alarmCount) 
  } 
}
console.log('array: ', alarmArr)

// console.log(Object.keys(upsAlarms))

// if (Object.keys(upsAlarms).includes(data[0])) {
//   const alarm = { data }
//   alarm.type = upsAlarms[data[0]]
//   console.log('data is alarm: ', alarm)
//   alarmArr.push(alarm)
//   console.log(alarmArr)
//   const text = JSON.stringify(alarmArr)
//   console.log(typeof text)
// } else {
//   console.log('data is NOT alarm: ', data)
// }

