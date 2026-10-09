export const site = {
  name: 'Wander Soul',
  tagline: 'Travel with feeling.',
  phoneDisplay: '+91 97689 95995',
  phoneHref: 'tel:+919768995995',
  whatsappNumber: '919768995995',
  email: 'ops07.wandersoul@gmail.com',
  instagram: 'https://www.instagram.com/wanderr.soul_',
  instagramHandle: '@wanderr.soul_',
  mapsUrl: 'https://share.google/em3LaVmUvh8bKlhPe',
  city: 'Kalyan, Mumbai',
};

export const waLink = (text) =>
  `https://wa.me/${site.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

// The pre-filled WhatsApp message on every trip's "Get details" button.
export const tripMessage = (trip) =>
  `Hi Wander Soul, I'm interested in the ${trip.name} trip${trip.days ? ` (${trip.days} days)` : ''}. Could you share the details and price for my dates?`;

export const generalMessage = 'Hi Wander Soul, I would like help planning a trip.';

// Enquiries from the planner are kept on this device (for "Your enquiries") and, when
// VITE_LEAD_ENDPOINT is set, also sent to the team, so a visitor who opens WhatsApp but
// never presses send is still a lead. The endpoint is a Google Apps Script web app that
// adds a row to a Google Sheet: see scripts/lead-sheet.gs for the two-minute setup.
export const LEADS_KEY = 'ws_leads';
// (The build's own scripts read this file too, outside the browser build, where there is no import.meta.env.)
const LEAD_ENDPOINT = (import.meta.env && import.meta.env.VITE_LEAD_ENDPOINT) || '';

export const sendLead = (lead) => {
  if (!LEAD_ENDPOINT) return;
  // Plain text keeps this a "simple" request (no CORS preflight, which Apps Script can't
  // answer); keepalive lets it finish while WhatsApp opens.
  fetch(LEAD_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...lead, page: window.location.href }),
  }).catch(() => {});
};

export const readLeads = () => {
  try {
    const list = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

export const saveLead = (lead) => {
  try {
    const list = readLeads();
    list.push(lead);
    localStorage.setItem(LEADS_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable: the WhatsApp hand-off still works */
  }
};
