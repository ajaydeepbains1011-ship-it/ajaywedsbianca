/**
 * Bianca & Ajay — RSVP intake
 *
 * Deploy this as a Web App (Deploy > New deployment > Web app) with:
 *   - Execute as: Me
 *   - Who has access: Anyone
 * Then paste the resulting /exec URL into config.js as RSVP_ENDPOINT.
 *
 * See README.md for full step-by-step setup.
 */

const SHEET_NAME = "RSVPs";

const COLUMNS = [
  "Submitted At",
  "Full Name",
  "Email",
  "Phone",
  "Attending",
  "Party Size",
  "Events",
  "Dietary / Allergies",
  "Song Request",
  "Message",
];

function doPost(e) {
  try {
    const sheet = getOrCreateSheet_();
    const p = e.parameter;

    sheet.appendRow([
      formatTimestamp_(p.submittedAt),
      p.fullName || "",
      p.email || "",
      p.phone || "",
      p.attending || "",
      p.partySize || "",
      p.events || "",
      p.dietary || "",
      p.song || "",
      p.message || "",
    ]);

    return jsonResponse_({ status: "ok" });
  } catch (err) {
    return jsonResponse_({ status: "error", message: err.message });
  }
}

function doGet() {
  return ContentService
    .createTextOutput("RSVP endpoint is live. Submit via POST.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function formatTimestamp_(iso) {
  const d = iso ? new Date(iso) : new Date();
  return Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
