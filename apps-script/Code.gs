/**
 * Shubhada birthday website -> Google Sheets reply collector.
 * Set Script Property API_SECRET to the same secret as Vercel's SHEETS_API_SECRET.
 */
const SPREADSHEET_ID = '1B63-nILpK253yTuLSbLKOIvX-_7GL9X0_ze36vL8fEQ';
const SHEET_NAME = 'Replies';

function doGet() {
  return json_({ ok: true, service: 'Shubhada birthday reply collector' });
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const expectedSecret = PropertiesService.getScriptProperties().getProperty('API_SECRET');
    if (!expectedSecret || !body.secret || body.secret !== expectedSecret) {
      return json_({ ok: false, error: 'Unauthorized' });
    }
    if (!['opened', 'hug', 'reply'].includes(body.type)) {
      return json_({ ok: false, error: 'Invalid event type' });
    }

    const name = String(body.name || 'Shubhada').slice(0, 80);
    const message = String(body.message || '').trim().slice(0, 1500);
    if (body.type === 'reply' && !message) {
      return json_({ ok: false, error: 'Empty reply' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      let sheet = spreadsheet.getSheetByName(SHEET_NAME);
      if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Timestamp', 'Event', 'Name', 'Message']);
        sheet.setFrozenRows(1);
      }
      const label = body.type === 'reply' ? 'Personal reply'
        : body.type === 'hug' ? 'Warm hug' : 'Website opened';
      sheet.appendRow([new Date(), label, name, message]);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'Server error' });
  }
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
