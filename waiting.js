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