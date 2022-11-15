module.exports = {
  // UPS Alarm OBJECT IDENTIFIER ::= { upsObjects 6 }
  "1.3.6.1.2.1.33.1.6": {
    name: "UPS Alarm",
    description: "ups Object containing alarm data"
  },
  // Alarms Present ::= { upsAlarm 1 }
  "1.3.6.1.2.1.33.1.6.1.0": { 
    name: "upsAlarmsPresent",
    description: "The present number of active alarm conditions",
  },
  "1.3.6.1.2.1.33.1.6.1": {  
    name: "upsAlarmsPresent",
    description: "The present number of active alarm conditions",
  },
  // Alarms Table ::= { upsAlarm 2 }
  "1.3.6.1.2.1.33.1.6.2": { 
    name: "upsAlarmsTable",
    description: "A list of alarm table entries.",
  },
  // Alarm Table Entry ::= { upsAlarmTable 1 }
  "1.3.6.1.2.1.33.1.6.2.1": { 
    name: "upsAlarmEntry",
    description: "An entry containing information applicable to a particular alarm.",
  },

  // Alarm Table Entry Details
  /***************************/

  // Alarm Id ::= { upsAlarmEntry 1 }
  "1.3.6.1.2.1.33.1.6.2.1.1": {
    name: "upsAlarmId",
    description: "A unique identifier for an alarm condition. This value must remain constant.",
  },
  // "1.3.6.1.2.1.33.1.6.2.1.1.1": {
  //   name: "upsAlarmId",
  //   description: "A unique identifier for an alarm condition. This value must remain constant.",
  // },
  // Alarm description ::= { upsAlarmEntry 2 }
  "1.3.6.1.2.1.33.1.6.2.1.2": {
    name: "upsAlarmDescr",
    description: "A reference to an alarm description object. The object referenced should not be accessible, but rather be used to provide a unique description of the alarm condition",
  },
  // "1.3.6.1.2.1.33.1.6.2.1.2.1": {
  //   name: "upsAlarmDescr",
  //   description: "A reference to an alarm description object. The object referenced should not be accessible, but rather be used to provide a unique description of the alarm condition",
  // },
  // Alarm Time ::= { upsAlarmEntry 3 }
  "1.3.6.1.2.1.33.1.6.2.1.3": {
    name: "upsAlarmTime",
    description: "The value of sysUpTime when the alarm condition was detected.",
  },
  // "1.3.6.1.2.1.33.1.6.2.1.3.1": {
  //   name: "upsAlarmTime",
  //   description: "The value of sysUpTime when the alarm condition was detected.",
  // },

  // Well Known Alarms OBJECT IDENTIFIER ::= { upsAlarm 3 } 
  /****************************************************** */
  "1.3.6.1.2.1.33.1.6.3": {
    name: "upsWellKnownAlarms",
    description: "UPS Alarms Object"
  },
  // alarmBatteryBad OBJECT-IDENTITY ::= { upsWellKnownAlarms 1 }
  "1.3.6.1.2.1.33.1.6.3.1": {
    name: "upsAlarmBatteryBad",
    description: "One or more batteries have been determined to require replacement."
  },
  // alarmOnBattery OBJECT-IDENTITY ::= { upsWellKnownAlarms 2 }
  "1.3.6.1.2.1.33.1.6.3.2": {
    name: "upsAlarmOnBattery",
    description: "The UPS is drawing power from the batteries."
  },
  // alarmLowBattery OBJECT-IDENTITY ::= { upsWellKnownAlarms 3 }
  "1.3.6.1.2.1.33.1.6.3.3": {
    name: "upsAlarmLowBattery",
    description: "The remaining battery run-time is less than or equal to upsConfigLowBattTime.",
  },
  // upsAlarmDepletedBattery
  "1.3.6.1.2.1.33.1.6.3.4": {
    name: "upsAlarmDepletedBattery",
    description: "The UPS will be unable to sustain the present load when and if the utility power is lost.",
  },
  // upsAlarmTempBad
  "1.3.6.1.2.1.33.1.6.3.5": {
    name: "upsAlarmTempBad",
    description: "A temperature is out of tolerance.",
  },
  // upsAlarmInputBad
  "1.3.6.1.2.1.33.1.6.3.6": {
    name: "upsAlarmInputBad",
    description: "An input condition is out of tolerance.",
  },
  // upsAlarmOutputBad
  "1.3.6.1.2.1.33.1.6.3.7": {
    name: "upsAlarmOutputBad",
    description: "An output condition (other than OutputOverload) is out of tolerance.",
  },
  // upsAlarmOutputOverload
  "1.3.6.1.2.1.33.1.6.3.8": {
    name: "upsAlarmOutputOverload",
    description: "The output load exceeds the UPS output capacity.",
  },
  // upsAlarmOnBypass
  "1.3.6.1.2.1.33.1.6.3.9": {
    name: "upsAlarmOnBypass",
    description: "The Bypass is presently engaged on the UPS.",
  },
  // upsAlarmBypassBad
  "1.3.6.1.2.1.33.1.6.3.10": {
    name: "upsAlarmBypassBad",
    description: "The Bypass is out of tolerance.",
  },
  // upsAlarmOutputOffAsRequested
  "1.3.6.1.2.1.33.1.6.3.11": {
    name: "upsAlarmOutputOffAsRequested",
    description: "The UPS has shutdown as requested, i.e., the output is off.",
  },
  // upsAlarmUpsOffAsRequested
  "1.3.6.1.2.1.33.1.6.3.12": {
    name: "upsAlarmUpsOffAsRequested",
    description: "The entire UPS has shutdown as commanded.",
  },
  // upsAlarmChargerFailed
  "1.3.6.1.2.1.33.1.6.3.13": {
    name: "upsAlarmChargerFailed",
    description: "An uncorrected problem has been detected within the UPS charger subsystem.",
  },
  // upsAlarmUpsOutputOff
  "1.3.6.1.2.1.33.1.6.3.14": {
    name: "upsAlarmUpsOutputOff",
    description: "The output of the UPS is in the off state.",
  },
  // upsAlarmUpsSystemOff
  "1.3.6.1.2.1.33.1.6.3.15": {
    name: "upsAlarmUpsSystemOff",
    description: "The UPS system is in the off state.",
  },
  // upsAlarmFanFailure
  "1.3.6.1.2.1.33.1.6.3.16": {
    name: "upsAlarmFanFailure",
    description: "The failure of one or more fans in the UPS has been detected.",
  },
  // upsAlarmFuseFailure
  "1.3.6.1.2.1.33.1.6.3.17": {
    name: "upsAlarmFuseFailure",
    description: "The failure of one or more fuses has been detected.",
  },
  // upsAlarmGeneralFault
  "1.3.6.1.2.1.33.1.6.3.18": {
    name: "upsAlarmGeneralFault",
    description: "A general fault in the UPS has been detected.",
  },
  // upsAlarmDiagnosticTestFailed
  "1.3.6.1.2.1.33.1.6.3.19": {
    name: "upsAlarmDiagnosticTestFailed",
    description: "The result of the last diagnostic test indicates a failure.",
  },
  // upsAlarmCommunicationsLost
  "1.3.6.1.2.1.33.1.6.3.20": {
    name: "upsAlarmCommunicationsLost",
    description: "A problem has been encountered in the communications between the agent and the UPS.",
  },
  // upsAlarmAwaitingPower
  "1.3.6.1.2.1.33.1.6.3.21": {
    name: "upsAlarmAwaitingPower",
    description: "The UPS output is off and the UPS is awaiting the return of input power.",
  },
  // upsAlarmShutdownPending
  "1.3.6.1.2.1.33.1.6.3.22": {
    name: "upsAlarmShutdownPending",
    description: "A upsShutdownAfterDelay countdown is underway.",
  },
  // upsAlarmShutdownImminent
  "1.3.6.1.2.1.33.1.6.3.23": {
    name: "upsAlarmShutdownImminent",
    description: "The UPS will turn off power to the load in less than 5 seconds; this may be either a timed shutdown or a low battery shutdown.",
  },
  // upsAlarmTestInProgress
  "1.3.6.1.2.1.33.1.6.3.24": {
    name: "upsAlarmTestInProgress",
    description: "A test is in progress, as initiated and indicated by the Test Group.",
  },

  // Ups Test OBJECT IDENTIFIER ::= { upsObjects 7 }
  "1.3.6.1.2.1.33.1.7.1" : {
    name: "Ups Test",
    description: "The test is named by an OBJECT IDENTIFIER which allows a standard mechanism for the initiation of tests, including the well known tests identified in this document as well as those introduced by a particular implementation, i.e., as documented in the private enterprise MIB definition for the device.",  }


}