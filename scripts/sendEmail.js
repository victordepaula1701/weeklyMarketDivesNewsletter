function sendEmail(){
  const ss = SpreadsheetApp.openById('SPREADSHEET ID').getSheetByName('News Database');  
  const wsReceivers = SpreadsheetApp.openById('SPREADSHEET ID').getSheetByName('Receivers');
  
  //==============================
  //This newsletter is just for me, but I created in advance a spreadsheet named "Receivers" where 
  //I can put a mailing list and, If some of my colleges from work want to receive the email to, 
  //I just need to insert the email addresses on this sheet, because before sent the email 
  //I'm looping through this sheet to collect the addresses and send it to everyone that was there.
  //==============================

  const lr = ss.getLastRow();
  const lc = ss.getLastColumn();
  const newsValues = ss.getRange(2,1,lr,lc).getDisplayValues();

  const htmlTemplate = HtmlService.createTemplateFromFile('template');
  htmlTemplate.newsValues = newsValues; 

  const emailTemplate = htmlTemplate.evaluate().getContent(); 

  const lrReceivers = wsReceivers.getLastRow();

  for (var i=2; i<=lrReceivers; i++){
    const receivers = wsReceivers.getRange(i,1).getValue();

  MailApp.sendEmail({
    to: receivers,
    subject: "Weekly Market Dives",
    htmlBody: emailTemplate
  });
  }
}
