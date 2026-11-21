/**
 * ─── Customer reviews: Google Sheets backend ───────────────────────────────
 *
 * Paste this whole file into Extensions → Apps Script of your reviews Google
 * Sheet. Setup steps are in SETUP.md ("Customer reviews").
 *
 * Each review becomes a row in the "Reviews" tab. Photos go into a Google
 * Drive folder called "Website review photos". A review only appears on the
 * website once you tick its "Approved" box.
 *
 * Only the website's server (Vercel) talks to this script, using a secret
 * key, so people can't add or read reviews by going around the website.
 */

var SHEET_NAME  = 'Reviews';
var FOLDER_NAME = 'Website review photos';
var HEADERS     = ['Submitted', 'Product ID', 'Product', 'Name', 'Rating', 'Review', 'Photos', 'Approved'];
var COL = { submitted: 0, productId: 1, product: 2, name: 3, rating: 4, text: 5, photos: 6, approved: 7 };

/** Run this once from the Apps Script editor (select "setup" → Run). */
function setup() {
  getSheet_();
  getFolder_();
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('SECRET')) props.setProperty('SECRET', Utilities.getUuid());
  Logger.log('Copy this into Vercel as REVIEWS_SECRET:  ' + props.getProperty('SECRET'));
}

/** GET: returns approved reviews (newest first). */
function doGet(e) {
  if (!checkSecret_(e.parameter.secret)) return json_({ error: 'unauthorised' });

  var rows = getSheet_().getDataRange().getValues().slice(1);
  var reviews = rows
    .filter(function (r) { return r[COL.approved] === true && r[COL.productId]; })
    .map(function (r) {
      return {
        productId: String(r[COL.productId]),
        name:      String(r[COL.name]),
        rating:    Number(r[COL.rating]),
        text:      String(r[COL.text]),
        photos:    String(r[COL.photos] || '').split(/\s+/).filter(Boolean),
        date:      r[COL.submitted] instanceof Date ? r[COL.submitted].toISOString() : String(r[COL.submitted])
      };
    })
    .reverse();

  return json_({ reviews: reviews });
}

/** POST: adds a new review (unapproved) and saves its photos. */
function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ error: 'bad request' }); }
  if (!checkSecret_(body.secret)) return json_({ error: 'unauthorised' });

  var folder = getFolder_();
  var photoUrls = (body.photos || []).slice(0, 3).map(function (p, i) {
    var blob = Utilities.newBlob(Utilities.base64Decode(p.data), p.type,
      'review-' + body.productId + '-' + Date.now() + '-' + (i + 1) + '.jpg');
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1200';
  });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    getSheet_().appendRow([
      new Date(),
      safe_(body.productId),
      safe_(body.productName),
      safe_(body.name),
      Number(body.rating),
      safe_(body.text),
      photoUrls.join('\n'),
      false
    ]);
  } finally {
    lock.releaseLock();
  }

  return json_({ ok: true });
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#FBEAE6');
    sheet.getRange('H2:H1000').insertCheckboxes();
    sheet.setColumnWidth(COL.text + 1, 400);
  }
  return sheet;
}

function getFolder_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('FOLDER_ID');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (err) { /* deleted — make a new one */ }
  }
  var folder = DriveApp.createFolder(FOLDER_NAME);
  props.setProperty('FOLDER_ID', folder.getId());
  return folder;
}

function checkSecret_(given) {
  var secret = PropertiesService.getScriptProperties().getProperty('SECRET');
  return !!secret && given === secret;
}

// Stop text like "=HYPERLINK(...)" being treated as a spreadsheet formula.
function safe_(value) {
  var s = String(value == null ? '' : value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
