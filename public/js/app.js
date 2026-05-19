const API_BASE = '';

function formatCurrency(amount) {
  if (typeof amount !== 'number') amount = parseFloat(amount) || 0;
  const rupees = amount > 100 ? amount / 100 : amount;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(rupees);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function normalizePhone(input) {
  let digits = String(input || '').replace(/[^\d]/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 10) digits = `91${digits}`;
  if (digits.length < 10 || digits.length > 15) return null;
  return digits;
}

function createSplitCard(split) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-xl shadow-md p-4 mb-4 hover:shadow-lg transition-shadow';
  card.innerHTML = `<div class="flex justify-between items-start mb-3"><div><h3 class="font-semibold text-gray-800 text-lg">${escapeHtml(split.description || 'Untitled Split')}</h3><p class="text-gray-500 text-sm">${formatDate(split.created_at)}</p></div></div><div class="flex justify-between items-center"><div class="text-2xl font-bold text-[#25D366]">${formatCurrency(split.total_amount)}</div><a href="/split/${split.id}" class="text-[#25D366] hover:text-[#128C7E] font-medium text-sm">View Details →</a></div>`;
  return card;
}

function addParticipantRow(defaults = { name: '', phone: '', amount: '' }) {
  const container = document.getElementById('participants-fields');
  if (!container) return;
  const row = document.createElement('div');
  row.className = 'grid md:grid-cols-4 gap-2';
  row.innerHTML = `<input type="text" class="participant-name border rounded-lg px-3 py-2" placeholder="Name" value="${escapeHtml(defaults.name)}" required><input type="text" class="participant-phone border rounded-lg px-3 py-2" placeholder="Phone Number" value="${escapeHtml(defaults.phone)}" required><input type="number" step="0.01" min="0" class="participant-amount border rounded-lg px-3 py-2" placeholder="Amount (₹)" value="${escapeHtml(defaults.amount)}" required><button type="button" class="remove-participant border rounded-lg px-3 py-2 text-sm">Remove</button>`;
  row.querySelector('.remove-participant').addEventListener('click', () => row.remove());
  container.appendChild(row);
}

function collectParticipants() {
  const names = [...document.querySelectorAll('.participant-name')];
  const phones = [...document.querySelectorAll('.participant-phone')];
  const amounts = [...document.querySelectorAll('.participant-amount')];
  const participants = [];

  for (let i = 0; i < names.length; i++) {
    const name = names[i].value.trim();
    const amount = parseFloat(amounts[i].value);
    const phone = normalizePhone(phones[i].value.trim());
    if (!name || Number.isNaN(amount)) continue;
    if (!phone) throw new Error(`Invalid phone number for ${name}`);
    participants.push({ name, phone, amount });
  }

  return participants;
}

async function pickContacts() {
  const status = document.getElementById('create-split-status');
  if (!('contacts' in navigator) || !('ContactsManager' in window)) {
    status.textContent = 'Contact picker unavailable. Use manual participant entry.';
    return;
  }

  try {
    const props = ['name', 'tel'];
    const contacts = await navigator.contacts.select(props, { multiple: true });
    contacts.forEach((c) => {
      const name = Array.isArray(c.name) ? c.name[0] : (c.name || 'Unknown');
      const tel = Array.isArray(c.tel) ? c.tel[0] : c.tel;
      if (!tel) return;
      addParticipantRow({ name, phone: tel, amount: '' });
    });
    status.textContent = contacts.length ? `Imported ${contacts.length} contacts.` : 'No contacts selected.';
  } catch {
    status.textContent = 'Contact picker access denied. Use manual participant entry.';
  }
}

async function createSplit(event) {
  event.preventDefault();
  const status = document.getElementById('create-split-status');
  status.textContent = '';

  const description = document.getElementById('description')?.value.trim();
  const amount = parseFloat(document.getElementById('total-amount')?.value);

  let participants;
  try {
    participants = collectParticipants();
  } catch (error) {
    status.textContent = error.message;
    return;
  }

  if (!description || Number.isNaN(amount) || participants.length === 0) {
    status.textContent = 'Please fill required fields and add participants.';
    return;
  }

  const allocated = participants.reduce((sum, p) => sum + p.amount, 0);
  if (allocated - amount > 0.01) {
    status.textContent = 'Participant total cannot exceed split total.';
    return;
  }

  try {
    const response = await fetch('/api/splits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ description, amount, participants }) });
    const data = await response.json();
    if (!response.ok) return void (status.textContent = data.error || 'Failed to create split.');
    window.location.href = `/split/${data.id}`;
  } catch {
    status.textContent = 'Failed to create split.';
  }
}

async function loadSplits() {
  const container = document.getElementById('splits-container');
  const emptyState = document.getElementById('empty-state');
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE}/api/splits`);
    const data = await response.json();
    container.innerHTML = '';
    const splits = Array.isArray(data) ? data : (data.splits || []);
    if (!splits.length) {
      container.classList.add('hidden');
      emptyState?.classList.remove('hidden');
      return;
    }
    emptyState?.classList.add('hidden');
    splits.forEach((split) => container.appendChild(createSplitCard(split)));
  } catch {
    container.innerHTML = '<div class="text-center py-8 text-red-500"><p>Failed to load splits.</p></div>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const createForm = document.getElementById('create-split-form');
  const addParticipantBtn = document.getElementById('add-participant-btn');
  const pickContactsBtn = document.getElementById('pick-contacts-btn');

  if (createForm) {
    addParticipantRow();
    createForm.addEventListener('submit', createSplit);
  }
  addParticipantBtn?.addEventListener('click', () => addParticipantRow());
  pickContactsBtn?.addEventListener('click', pickContacts);

  if (!('contacts' in navigator) || !('ContactsManager' in window)) {
    const hint = document.getElementById('contact-picker-hint');
    if (hint) hint.textContent = 'Contact picker not supported in this browser. Manual entry is active.';
  }

  if (document.getElementById('splits-container')) loadSplits();
});
