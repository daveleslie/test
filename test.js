// const existingAlarmsActive = [
//   {
//     alarmId: 1,
//     upsId: 3,
//     alarmType: 'upsAlarmOnBattery',
//     alarmDescription: 'Battery is on',
//     alarmOnTimestamp: 1666949369,
//     alarmOffTimestamp: null,
//     alarmStatus: 'ACTIVE'
//   },
//   {
//     alarmId: 2,
//     upsId: 3,
//     alarmType: 'upsAlarmInputBad',
//     alarmDescription: 'An input parameter is out of tolerance',
//     alarmOnTimestamp: 1666949370,
//     alarmOffTimestamp: null,
//     alarmStatus: 'ACTIVE'
//   },
//   {
//     alarmId: 3,
//     upsId: 3,
//     alarmType: 'upsAlarmOnBypass',
//     alarmDescription: 'Bypass Description',
//     alarmOnTimestamp: 1666949370,
//     alarmOffTimestamp: null,
//     alarmStatus: 'ACTIVE'
//   },
// ]
const existingAlarmsActive = []
const upsId = 3
const upsAlarm = [
  "upsAlarmTest", "1.3.6.1.2.1.33.1.6.3.2", "INTEGER: 1",
]

// 1. check if current alarm exists in alarmTable
const prevAlarmIndex = existingAlarmsActive.findIndex(alarm => alarm.alarmType === upsAlarm[0].trim())
console.log(prevAlarmIndex)
// if alarm exists and new alarm is OFF (i.e. 0), update the alarm to RESTORED
if (existingAlarmsActive[prevAlarmIndex] && upsAlarm[2].slice(-1) === "0") {
  existingAlarmsActive[prevAlarmIndex].alarmOffTimestamp = Math.ceil(Date.now() / 1000)
  existingAlarmsActive[prevAlarmIndex].alarmStatus = 'RESTORED'
}
// if alarm does not exist, and new alarm is ON, insert new alarm entry
else if (!existingAlarmsActive[prevAlarmIndex] && upsAlarm[2].slice(-1) === "1") {
  existingAlarmsActive.push({
    alarmId: existingAlarmsActive.length + 1,
    alarmType: upsAlarm[0].trim(),
    alarmDescription: 'Add a new alarm',
    alarmOnTimestamp: Math.ceil(Date.now() / 1000),
    alarmOffTimestamp: null,
    alarmStatus: 'ACTIVE' 

  })
} else {
  
}

console.log(existingAlarmsActive)