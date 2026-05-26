/**
 * Google Apps Script — RSVP / Ucapan → Spreadsheet
 *
 * Cara deploy (gunakan project yang URL-nya sudah di index-1.htm):
 * 1. Buka https://script.google.com → project web app yang sudah ada
 * 2. Tempel / ganti isi dengan file ini
 * 3. Deploy → Manage deployments → Edit → New version → Deploy
 * 4. Pastikan "Execute as: Me" dan "Who has access: Anyone"
 *
 * Spreadsheet: buat sheet dengan header baris 1:
 *   Waktu | Nama | Ucapan | Kehadiran | Jumlah Tamu
 */

var SHEET_NAME = 'Ucapan';

function doGet(e) {
  e = e || { parameter: {} };
  var action = String(e.parameter.action || 'submit').toLowerCase();

  if (action === 'list') {
    return json_(getList_());
  }

  var nama = trim_(e.parameter.nama);
  var ucapan = trim_(e.parameter.ucapan);
  var kehadiran = trim_(e.parameter.kehadiran);
  var jumlah = trim_(e.parameter.jumlah_tamu) || '1';

  if (nama.length < 2 || ucapan.length < 2) {
    return json_({ status: 'error', message: 'Nama dan ucapan wajib diisi' });
  }

  appendRow_(nama, ucapan, kehadiran, jumlah);
  return json_({ status: 'ok' });
}

function doPost(e) {
  e = e || { parameter: {} };
  var p = e.parameter || {};
  if (e.postData && e.postData.contents) {
    try {
      var body = JSON.parse(e.postData.contents);
      for (var k in body) {
        if (body.hasOwnProperty(k)) p[k] = body[k];
      }
    } catch (err) {}
  }
  return doGet({ parameter: p });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Waktu', 'Nama', 'Ucapan', 'Kehadiran', 'Jumlah Tamu']);
  } else if (sheet.getLastRow() === 1 && !sheet.getRange(1, 1).getValue()) {
    sheet.getRange(1, 1, 1, 5).setValues([['Waktu', 'Nama', 'Ucapan', 'Kehadiran', 'Jumlah Tamu']]);
  }
  return sheet;
}

function appendRow_(nama, ucapan, kehadiran, jumlah) {
  getSheet_().appendRow([new Date(), nama, ucapan, kehadiran, jumlah]);
}

function getList_() {
  var sheet = getSheet_();
  var last = sheet.getLastRow();
  if (last < 2) {
    return { status: 'ok', data: [] };
  }

  var rows = sheet.getRange(2, 1, last - 1, 5).getValues();
  var data = [];
  for (var i = rows.length - 1; i >= 0; i--) {
    var row = rows[i];
    var waktu = row[0];
    var ts = waktu instanceof Date ? waktu.getTime() : new Date(waktu).getTime();
    if (isNaN(ts)) ts = Date.now();
    data.push({
      waktu: ts,
      nama: String(row[1] || ''),
      ucapan: String(row[2] || ''),
      kehadiran: String(row[3] || ''),
      jumlah: String(row[4] || '1')
    });
  }
  return { status: 'ok', data: data };
}

function trim_(s) {
  return String(s || '').replace(/^\s+|\s+$/g, '');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
