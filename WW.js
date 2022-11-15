// const json = require('./upsData/ups503WW')
// const json = require('./upsData/json/json130WW')
// const json = require('./upsData/json/json528WW')
const json = require('./upsData/json/json554WW')
// const json = require('./upsData/json/json22WW')
// const json = require('./upsData/json/quick')
const upsId = 528
const alarmDict = require('./utils/upsMibObj')

const alarmsDB = []

function insertUpsDataEntryWW(upsId, json) {
  let upsStatus = 'UNKNOWN'
  let msg = 'TEST FAIL: UNKNOWN'
  let upsTimestamp = 0

  let upsAlarms
  let upsWellKnownAlarmsActive
  let upsAlarmTable

  // iterate over json.basic array
  for (let i = 0; i < json.basic.length; i++) {
    // check that upsData is NOT empty
    if (json.basic[i].upsData.length > 0) {
      // Get UPS status
      if (Math.round(Date.now() / 1000) - json.basic[i].upsTimestamp < 86400) {
        upsStatus = 'READINGOK'
        msg = 'TEST OK'
      } else {
        msg =
          'TEST FAIL : UPS-417 [UEC=OK, MySQL=OK, UPS=OldDATA-' +
          Math.round(
            ((Math.round(Date.now() / 1000) - json.basic[i].upsTimestamp) /
              60 /
              60 /
              24) *
              10
          ) /
            10 +
          'days]'
      }

      // set the lastest timestamp
      if (json.basic[i].upsTimestamp > upsTimestamp) {
        upsTimestamp = json.basic[i].upsTimestamp
      }

      // iterate over upsData for json.basic[i]
      upsAlarms = []
      upsWellKnownAlarmsActive = []
      upsAlarmTable = {}
      for (let q = 0; q < json.basic[i].upsData.length; q++) {} // end iteration of json.basic[i].upsData

      // --------------------
      // PROCESS ALARM DATA
      // --------------------

      const allAlarms = json.basic[i].upsData.filter(upsDataEntry => {
        return upsDataEntry[0].slice(0, 18) === '1.3.6.1.2.1.33.1.6'
      })

      const prevAlarms = alarmsDB.slice()

      const alarmTableEntries = allAlarms.filter(elem => {
        return elem[0].slice(0, 22) === '1.3.6.1.2.1.33.1.6.2.1'
      })

      // process alarmTableEntries and create upsAlarmTable object
      alarmTableEntries.forEach(entry => {
        let oidParent = entry[0].split('.').slice(0, -1).join('.')
        let oidChild = entry[0].split('.').slice(-1)

        // create entry for alarmId, if not exists
        if (!upsAlarmTable[oidChild]) upsAlarmTable[oidChild] = {}

        // get alarm descriptions
        if (oidParent === '1.3.6.1.2.1.33.1.6.2.1.2') {
          if (entry[1].slice(0, 19) === 'OBJECT IDENTIFIER: ') {
            let alarmType = alarmDict[entry[1].slice(19)]?.name

            // update alarm table object and upsWellKnownAlarmsActive array in `insight-battery`
            upsAlarmTable[oidChild].alarmOID = entry[1].slice(19)
            if (alarmType) {
              upsAlarmTable[oidChild].alarmDesc = alarmType
              if (!upsWellKnownAlarmsActive.includes(alarmType)) {
                upsWellKnownAlarmsActive.push(alarmType)
              }
            } else {
              upsAlarmTable[oidChild].alarmDesc = entry[1]
            }
          } else if (entry[1].slice(0,9).toUpperCase() === 'INTEGER: ') {
            let alarmOID = "1.3.6.1.2.1.33.1.6.3." + entry[1].split(' ')[1]
            let alarmType = alarmDict[alarmOID]?.name ? alarmDict[alarmOID].name : 'Unknown Alarm'
          
            upsAlarmTable[oidChild].alarmOID = alarmOID
            upsAlarmTable[oidChild].alarmDesc = alarmType
          } else {
            upsAlarmTable[oidChild].alarmDesc = entry[1]
          }
        }

        // get alarm timestamps
        if (oidParent === '1.3.6.1.2.1.33.1.6.2.1.3') {
          upsAlarmTable[oidChild].alarmTime = entry[1].toString()
        }

        // get alarm ids
        if (oidParent === '1.3.6.1.2.1.33.1.6.2.1.1') {
          if (entry[1].slice(0, 7).toUpperCase() === 'GAUGE: ') {
            upsAlarmTable[oidChild].alarmId = parseInt(entry[1].slice(7), 10)
          }
          if (entry[1].slice(0, 9).toUpperCase() === 'INTEGER: ') {
            upsAlarmTable[oidChild].alarmId = parseInt(entry[1].slice(9), 10)
          }
        }
      }) // end alarmTable processing
      console.log('\n************** START *******************')
      console.log('table: ', upsAlarmTable)

      // Process alarmTable object and insert new alarms into alarmsDB
      const alarmTableKeys = Object.keys(upsAlarmTable)
      // iterate over alarmTable Object
      for (key of alarmTableKeys) {
        let alarmType = null
        const prevAlarmIndex = prevAlarms.findIndex(
          alarm => alarm.alarmOID === upsAlarmTable[key].alarmOID
        )

        if (upsAlarmTable[key].alarmOID !== '0.0.0.0.0.0.0.0.0.0.0') {
          alarmType = upsAlarmTable[key].alarmDesc ?? 'undefined alarm'
        }

        if (alarmType === 'undefined alarm') {
          console.log("======================")
          console.log(upsAlarmTable[key])
          console.log("======================")
        }

        // alarmType = upsAlarmTable[key].alarmDesc

        // if alarm table entry is not found in previous alarms, INSERT new alarm to DB
        if (prevAlarmIndex === -1 && alarmType !== null) {
          const fields = {
            upsId: upsId,
            alarmType:
              alarmType.slice(0, 19) === 'OBJECT IDENTIFIER: '
                ? 'Unknown Alarm'
                : alarmType,
            alarmDescription:
              alarmType.slice(0, 19) === 'OBJECT IDENTIFIER: '
                ? alarmType
                : alarmDict[upsAlarmTable[key].alarmOID]?.description, // <-- this line caused error without '?'
            alarmOnTimestamp: upsTimestamp,
            alarmOffTimestamp: null,
            alarmOID: upsAlarmTable[key].alarmOID,
            alarmStatus: 'ACTIVE'
          }
          alarmsDB.push(fields)
        }
      } // end iteration over alarmTable object

      // check whether previous alarms have been restored
      console.log(`${upsTimestamp} previous alarms: `, prevAlarms.length)
      for (alarm of prevAlarms) {
        let alarmFound = false
        for (key in upsAlarmTable) {
          if (upsAlarmTable[key].alarmOID === alarm.alarmOID) {
            alarmFound = true
          }
        }
        // If previous alarm condition no longer in alarmTable Object, then restore previous alarm
        if (!alarmFound) {
          const alarmIndex = prevAlarms.indexOf(alarm)
          prevAlarms[alarmIndex].alarmOffTimestamp = upsTimestamp
          prevAlarms[alarmIndex].alarmStatus = 'RESTORED'
        }
      }
    } // end if check
  } // end iteration over json.basic array
  console.log(alarmsDB)
  console.log('********* END ********************\n')
}

insertUpsDataEntryWW(upsId, json)
// console.log(json.basic.length)
