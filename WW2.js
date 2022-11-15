const json = require('./upsData/json/json554WW')
// const json = require('./upsData/json/json22WW')
const upsId = 554
const alarmDict = require('./utils/upsMibObj')

//initialize previous alarms array
const alarmsDB = []

function insertUpsDataEntryWW(upsId, json) {
  console.log("***** START *****")
  let upsTimestamp = 0
  //------ PROCESS ALARM DATA FOR NEXT UPSDATA TIMESTAMP------
  for (let dataEntry of json.basic) {
    console.log('\ntimestamp: ', dataEntry.upsTimestamp)
    const prevAlarms = alarmsDB.filter(alarm => alarm.alarmStatus === 'ACTIVE')
    console.log('show previous active alarms (DB): ', prevAlarms)
    const latestAlarms = []
    if (dataEntry.upsTimestamp > upsTimestamp) {
      upsTimestamp = dataEntry.upsTimestamp
    }

    // get all alarm description OIDs from latest ups update
    const alarmTableDescriptions = dataEntry.upsData.filter(oid => {
      return oid[0].slice(0, 24) === '1.3.6.1.2.1.33.1.6.2.1.2'
    })

    // ----- PROCESS LATEST ALARM DESCRIPTIONS -----
    if (alarmTableDescriptions.length > 0) {
      for (let alarm of alarmTableDescriptions) {
        let mibKey = alarm[0]
        let alarmDetails = alarm[1]

        // get alarmType
        let alarmDescription
        let alarmType
        let alarmOID
        if (
          alarmDetails.slice(0, 19) === 'OBJECT IDENTIFIER: ' &&
          alarmDetails.slice(19) !== '0.0.0.0.0.0.0.0.0.0.0'
        ) {
          alarmType =
            alarmDict[alarmDetails.slice(19)]?.name ?? 'Unknown Alarm Condition'
          alarmDescription =
            alarmDict[alarmDetails.slice(19)]?.description ?? alarmDetails
          alarmOID = alarmDetails.slice(19)
        }

        // get alarm description

        if (alarmType) {
          latestAlarms.push({ alarmType, alarmDescription, alarmOID })
        }
      }
    }

    // ----- CHECK LATEST ALARMS FOR NEW ALARMS TO BE ADDED TO DB
    if (latestAlarms.length > 0) {
      for (alarm of latestAlarms) {
        // get all previous alarms from db
        const prevAlarmsUpdated = alarmsDB.filter(alarm => alarm.alarmStatus === 'ACTIVE')

        const prevAlarmIndex = prevAlarmsUpdated.findIndex(
          prevAlarm => prevAlarm.alarmOID === alarm.alarmOID
        )

        if (prevAlarmIndex === -1) {
          const fields = {
            alarmId: Date.now() + Math.ceil(Math.random()*100),
            upsId: upsId,
            alarmType: alarm.alarmType,
            alarmDescription: alarm.alarmDescription,
            alarmOnTimestamp: upsTimestamp,
            alarmOffTimestamp: null,
            alarmOID: alarm.alarmOID,
            alarmStatus: 'ACTIVE'
          }
          alarmsDB.push(fields)
        }
      } // end iteration over latest alarms
    }

    // UPDATE PREVIOUS ALARMS WHICH NO LONGER EXIST IN LATEST ALARMS 
    if (prevAlarms.length > 0) {
      for (let alarm of prevAlarms) {
        let latestAlarmIndex = latestAlarms.findIndex(latestAlarm => latestAlarm.alarmOID === alarm.alarmOID)
        if (latestAlarmIndex === -1) {
          const prevAlarmIndex = prevAlarms.indexOf(alarm)
          prevAlarms[prevAlarmIndex].alarmOffTimestamp = upsTimestamp
          prevAlarms[prevAlarmIndex].alarmStatus = 'RESTORED'
        }
      }

    }

    console.log('Latest Alarms: ', latestAlarms)
    console.log('DB Alarm Count: ', alarmsDB.length)
    // console.log('DB Alarms: ', alarmsDB, '\n')
    // console.log('test Previous Alarms: ', prevAlarms, '\n')
    console.log("***** END *****\n")
  } // end iteration of json.basic[i].upsData (i.e. enf timestamped data)
}

insertUpsDataEntryWW(upsId, json)
