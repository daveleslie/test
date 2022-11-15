const { sayHello, processAlarmTableDescriptions, insertNewAlarms, updateRestoredAlarms } = require('./utils/upsAlarms')


const json = require('./upsData/json/json554WW')
// const json = require('./upsData/json/json22WW')
const upsId = 554
const alarmDict = require('./utils/upsMibObj')

//initialize previous alarms array
const alarmsDB = []

function insertUpsDataEntryWW(upsId, json) {
  console.log("***** START *****")
  let upsTimestamp = 0

  // OTTO CODE GOES HERE

  //------ PROCESS ALARM DATA FOR NEXT UPSDATA TIMESTAMP------
  for (let dataEntry of json.basic) {
    console.log('\ntimestamp: ', dataEntry.upsTimestamp)
    const prevAlarms = alarmsDB.filter(alarm => alarm.alarmStatus === 'ACTIVE')
    console.log('show previous active alarms (DB): ', prevAlarms)
    let latestAlarms = []
    if (dataEntry.upsTimestamp > upsTimestamp) {
      upsTimestamp = dataEntry.upsTimestamp
    }

    // get all alarm description OIDs from latest ups update
    const alarmTableDescriptions = dataEntry.upsData.filter(oid => {
      return oid[0].slice(0, 24) === '1.3.6.1.2.1.33.1.6.2.1.2'
    })

    // ----- PROCESS LATEST ALARM DESCRIPTIONS -----
    if (alarmTableDescriptions.length > 0) {
      latestAlarms = processAlarmTableDescriptions(alarmTableDescriptions, alarmDict)
    }

    // ----- CHECK LATEST ALARMS FOR NEW ALARMS TO BE ADDED TO DB
    if (latestAlarms.length > 0) {
      insertNewAlarms(upsId, upsTimestamp, latestAlarms, alarmsDB)
    }

    // UPDATE PREVIOUS ALARMS WHICH NO LONGER EXIST IN LATEST ALARMS 
    if (prevAlarms.length > 0) {
      updateRestoredAlarms(upsTimestamp, prevAlarms, latestAlarms)
    }

    console.log('Latest Alarms: ', latestAlarms)
    console.log('DB Alarm Count: ', alarmsDB.length)
    // console.log('DB Alarms: ', alarmsDB, '\n')
    // console.log('test Previous Alarms: ', prevAlarms, '\n')
    console.log("***** END *****\n")
  } // end iteration of json.basic[i].upsData (i.e. enf timestamped data)
  sayHello()
}

insertUpsDataEntryWW(upsId, json)
