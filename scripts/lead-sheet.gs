/**
 * Wander Soul enquiries -> Google Sheet (+ an email for each new enquiry).
 *
 * Setup (about two minutes, free):
 *  1. Create a Google Sheet named "Wander Soul enquiries".
 *  2. Extensions > Apps Script. Replace everything with this file. Save.
 *  3. Deploy > New deployment > type "Web app".
 *     Execute as: Me.  Who has access: Anyone.  Deploy, and allow access.
 *  4. Copy the web app URL (ends in /exec).
 *  5. In Vercel: Project > Settings > Environment Variables, add
 *       VITE_LEAD_ENDPOINT = <that URL>
 *     then redeploy. (Locally: put the same line in wandersoul-react/.env.local.)
 *
 * Every planner enquiry then lands as a row, even when the visitor opens WhatsApp
 * and never presses send.
 */

const NOTIFY_EMAIL = 'ops07.wandersoul@gmail.com';
const COLUMNS = ['Received', 'Name', 'Phone', 'Country', 'Destination', 'Travellers', 'When', 'Budget', 'Status', 'Page'];

function doPost(e) {
  const lead = JSON.parse(e.postData.contents || '{}');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);

  // Strip anything that a spreadsheet would treat as a formula.
  const clean = (v) => String(v == null ? '' : v).replace(/^[=+\-@]/, "'$&").slice(0, 500);
  sheet.appendRow([
    new Date(),
    clean(lead.name),
    clean(lead.phone),
    clean(lead.country),
    clean(lead.destination),
    clean(lead.travellers),
    clean(lead.when),
    clean(lead.budget),
    clean(lead.status),
    clean(lead.page),
  ]);

  if (NOTIFY_EMAIL) {
    MailApp.sendEmail(
      NOTIFY_EMAIL,
      `New enquiry: ${clean(lead.destination)} (${clean(lead.name)})`,
      COLUMNS.slice(1)
        .map((c, i) => `${c}: ${clean([lead.name, lead.phone, lead.country, lead.destination, lead.travellers, lead.when, lead.budget, lead.status, lead.page][i])}`)
        .join('\n'),
    );
  }
  return ContentService.createTextOutput('ok');
}
