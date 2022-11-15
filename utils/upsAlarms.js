module.exports = {
  sayHello: function () {
    console.log('Hellow')
  },

  processAlarmTableDescriptions: function (alarmTableDescriptions, alarmDict) {
    const processedAlarms = []
    for (let alarm of alarmTableDescriptions) {
      let alarmDetails = alarm[1]

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
      if (alarmType) {
        processedAlarms.push({ alarmType, alarmDescription, alarmOID })
      }
    }
    return processedAlarms
  },

  insertNewAlarms: function (upsId, upsTimestamp, latestAlarms, alarmsDB) {
    for (let alarm of latestAlarms) {
      // get all previous alarms from db
      const prevAlarmsUpdated = alarmsDB.filter(
        alarm => alarm.alarmStatus === 'ACTIVE'
      )

      const prevAlarmIndex = prevAlarmsUpdated.findIndex(
        prevAlarm => prevAlarm.alarmOID === alarm.alarmOID
      )

      if (prevAlarmIndex === -1) {
        const fields = {
          alarmId: Date.now() + Math.ceil(Math.random() * 100),
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
  },

  updateRestoredAlarms: function (upsTimestamp, prevAlarms, latestAlarms) {
    for (let alarm of prevAlarms) {
      let latestAlarmIndex = latestAlarms.findIndex(latestAlarm => latestAlarm.alarmOID === alarm.alarmOID)
      if (latestAlarmIndex === -1) {
        const prevAlarmIndex = prevAlarms.indexOf(alarm)
        prevAlarms[prevAlarmIndex].alarmOffTimestamp = upsTimestamp
        prevAlarms[prevAlarmIndex].alarmStatus = 'RESTORED'
      }
    }
  },
  
}
