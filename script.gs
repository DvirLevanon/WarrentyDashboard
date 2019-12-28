function init() {
  var todayFormated = new Date();
  todayFormated.setDate(todayFormated.getDate()-7);
  todayFormated = todayFormated.getTime();
  
  var files = DriveApp.getFolderById("YOURDIRECTORYID").getFiles();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  while (files.hasNext()) {
      var file = files.next();
      var fileName = file.getName();
      var fileDate = fileName.substring(0, 10);
      var isSendMail = "FALSE";
      var toggleSendMail = "C2";
      var tf = sheet.getRange("A2:A200").createTextFinder(fileName);
      var foundRecord = tf.findNext();

      if (foundRecord == null) {
        sheet.insertRowBefore(2);
        sheet.getRange("A2:C2").setValues([[fileName, fileDate, "FALSE"]]);
      } else {
        var rowFound = sheet.getRange("A"+foundRecord.getRow()+":C"+foundRecord.getRow()).getValues();
        toggleSendMail = "C"+foundRecord.getRow();
        isSendMail = rowFound[0][2];
      }
    
    var splitedFileDate = fileDate.split("_");
    var fileFormattedDate = new Date(splitedFileDate[0], splitedFileDate[1], splitedFileDate[2]).getTime();
    if (isSendMail.toString().toUpperCase() === "FALSE" && (todayFormated < fileFormattedDate)) {
          expiredWarrenty(fileName)
          sheet.getRange(toggleSendMail).setValue("TRUE");
    }
  }
}

function expiredWarrenty(fileName){
       MailApp.sendEmail({
        to: "YOURMAIL@gmail.com",
        subject: "Product warrenty is about to be expired " + fileName
      });
}
