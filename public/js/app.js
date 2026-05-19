const API_BASE = '';

let selectedParticipants = [];
let allContacts = {};
let dialogActiveCategory = 'friends';
let qrData = null;

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

function generateUpiUri(options) {
  const { pa, pn, am, tn, cu = 'INR' } = options;
  if (!pa) throw new Error('UPI ID is required');
  const params = new URLSearchParams();
  params.set('pa', pa);
  if (pn) params.set('pn', pn);
  if (am) params.set('am', String(am));
  if (tn) params.set('tn', tn);
  if (cu) params.set('cu', cu);
  return `upi://pay?${params.toString()}`;
}

function generateWhatsAppLink(phone, message) {
  const cleaned = phone.replace(/\D/g, '');
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

function createSplitCard(split) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-xl shadow-md p-4 mb-3 hover:shadow-lg transition-shadow';
  const amountDisplay = split.total_amount > 100 ? (split.total_amount / 100).toFixed(2) : split.total_amount;
  card.innerHTML = `
    <div class="flex justify-between items-start mb-2">
      <div>
        <h3 class="font-semibold text-gray-800">${escapeHtml(split.description || 'Untitled')}</h3>
        <p class="text-xs text-gray-500">${formatDate(split.created_at)}</p>
      </div>
      <span class="text-xs px-2 py-1 rounded ${split.payment_mode === 'merchant_direct' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}">${split.payment_mode === 'merchant_direct' ? 'Pay Merchant' : 'I Paid'}</span>
    </div>
    <div class="flex justify-between items-center">
      <div class="text-xl font-bold text-green-600">₹${amountDisplay}</div>
      <a href="/split/${split.id}" class="text-green-600 hover:text-green-700 font-medium text-sm">View →</a>
    </div>
  `;
  return card;
}

function createSelectedParticipantChip(contact) {
  const chip = document.createElement('div');
  chip.className = 'inline-flex items-center gap-1 bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm';
  chip.dataset.id = contact.id;
  chip.innerHTML = `
    <span>${escapeHtml(contact.name)}</span>
    <button type="button" class="remove-participant ml-1 text-green-600 hover:text-green-800">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  `;
  chip.querySelector('.remove-participant').addEventListener('click', () => {
    selectedParticipants = selectedParticipants.filter(p => p.id !== contact.id);
    chip.remove();
    updateSelectedCount();
    renderSelectedChips();
  });
  return chip;
}

function renderSelectedChips() {
  const container = document.getElementById('selected-participants');
  if (!container) return;
  container.innerHTML = '';
  if (selectedParticipants.length === 0) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-wrap gap-2';
  selectedParticipants.forEach(p => {
    wrapper.appendChild(createSelectedParticipantChip(p));
  });
  container.appendChild(wrapper);
}

function updateSelectedCount() {
  const el = document.getElementById('dialog-selected-count');
  if (el) el.textContent = `${selectedParticipants.length} selected`;
}

async function loadContacts() {
  try {
    const response = await fetch('/api/contacts');
    const data = await response.json();
    allContacts = data.contacts || {};
    return data;
  } catch {
    allContacts = {};
    return { categories: ['friends', 'family', 'co-workers'], contacts: {} };
  }
}

function renderDialogPanel(category) {
  const panel = document.querySelector(`.dialog-panel[data-category="${category}"]`);
  if (!panel) return;

  const contacts = allContacts[category] || [];
  if (contacts.length === 0) {
    panel.innerHTML = `<p class="text-gray-400 text-center py-8">No contacts. <a href="/contacts" class="text-green-600 underline">Add some</a></p>`;
    return;
  }

  panel.innerHTML = '';
  contacts.forEach(contact => {
    const isSelected = selectedParticipants.some(p => p.id === contact.id);
    const row = document.createElement('label');
    row.className = `flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50 border border-transparent'}`;
    row.innerHTML = `
      <input type="checkbox" class="contact-checkbox w-4 h-4 text-green-600 rounded" value="${contact.id}" ${isSelected ? 'checked' : ''}>
      <div class="flex-1 min-w-0">
        <p class="font-medium truncate">${escapeHtml(contact.name)}</p>
        <p class="text-sm text-gray-500">${escapeHtml(contact.phone)}</p>
      </div>
    `;
    row.querySelector('.contact-checkbox').addEventListener('change', (e) => {
      if (e.target.checked) {
        if (!selectedParticipants.some(p => p.id === contact.id)) {
          selectedParticipants.push(contact);
        }
      } else {
        selectedParticipants = selectedParticipants.filter(p => p.id !== contact.id);
      }
      updateSelectedCount();
      renderDialogPanel(category);
      renderSelectedChips();
    });
    panel.appendChild(row);
  });
}

function openParticipantsDialog() {
  const dialog = document.getElementById('participants-dialog');
  dialog.classList.remove('hidden');
  dialog.classList.add('flex');
  renderDialogPanel(dialogActiveCategory);
  updateSelectedCount();
}

function closeParticipantsDialog() {
  const dialog = document.getElementById('participants-dialog');
  dialog.classList.add('hidden');
  dialog.classList.remove('flex');
}

async function addFromContactsInDialog() {
  if (!('contacts' in navigator) || !('ContactsManager' in window)) {
    alert('Contact picker not available in this browser.');
    return;
  }

  try {
    const props = ['name', 'tel'];
    const deviceContacts = await navigator.contacts.select(props, { multiple: true });

    for (const c of deviceContacts) {
      const name = Array.isArray(c.name) ? c.name[0] : (c.name || 'Unknown');
      const tel = Array.isArray(c.tel) ? c.tel[0] : c.tel;
      if (!tel) continue;

      const normalizedPhone = normalizePhone(tel);
      if (!normalizedPhone) continue;

      const tempContact = { id: `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, name, phone: normalizedPhone, category: dialogActiveCategory };
      if (!selectedParticipants.some(p => p.id === tempContact.id)) {
        selectedParticipants.push(tempContact);
      }
    }

    updateSelectedCount();
    renderDialogPanel(dialogActiveCategory);
    renderSelectedChips();
  } catch {
    alert('Contact picker access denied.');
  }
}

function calculateEqualSplit(totalPaise, count) {
  if (count <= 0) return [];
  if (count === 1) return [totalPaise];
  const base = Math.floor(totalPaise / count);
  const remainder = totalPaise - (base * count);
  const shares = [];
  for (let i = 0; i < count; i++) {
    shares.push(base + (i < remainder ? 1 : 0));
  }
  return shares;
}

async function createSplit(event) {
  event.preventDefault();
  const status = document.getElementById('create-split-status');
  status.textContent = '';

  const description = document.getElementById('description')?.value.trim();
  const amount = parseFloat(document.getElementById('total-amount')?.value);
  const paymentMode = document.querySelector('input[name="paymentMode"]:checked')?.value || 'creator_paid';

  if (!description || Number.isNaN(amount)) {
    status.textContent = 'Please fill in description and amount.';
    return;
  }

  if (selectedParticipants.length === 0) {
    status.textContent = 'Please add at least one participant.';
    return;
  }

  if (paymentMode === 'creator_paid') {
    try {
      const resp = await fetch('/api/profile/upi/default');
      const data = await resp.json();
      if (!data.hasDefault) {
        status.textContent = 'Please add your UPI ID in Settings before creating a reimbursement split.';
        return;
      }
    } catch {
      status.textContent = 'Failed to verify UPI profile.';
      return;
    }
  }

  const totalPaise = Math.round(amount * 100);
  const sharesPaise = calculateEqualSplit(totalPaise, selectedParticipants.length);

  const participants = selectedParticipants.map((p, i) => ({
    name: p.name,
    phone: p.phone,
    amount: Math.round((sharesPaise[i] / 100) * 100) / 100,
  }));

  const splitData = {
    description,
    amount,
    participants,
    paymentMode,
  };

  if (qrData) {
    splitData.merchantUpiId = qrData.pa;
    splitData.merchantName = qrData.pn;
    splitData.merchantCurrency = qrData.cu || 'INR';
  }

  try {
    const response = await fetch('/api/splits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(splitData),
    });
    const data = await response.json();
    if (!response.ok) return void (status.textContent = data.error || 'Failed to create split.');

    selectedParticipants = [];
    renderSelectedChips();
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
    const splits = Array.isArray(data.splits) ? data.splits : [];
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

function loadQrDataFromSession() {
  const raw = sessionStorage.getItem('splitsquad_qr_data');
  if (!raw) return;

  try {
    qrData = JSON.parse(raw);
    sessionStorage.removeItem('splitsquad_qr_data');

    const display = document.getElementById('qr-data-display');
    const nameEl = document.getElementById('qr-merchant-name');
    const upiEl = document.getElementById('qr-upi-id');
    const amountEl = document.getElementById('total-amount');

    if (qrData.pn) nameEl.textContent = qrData.pn;
    upiEl.textContent = qrData.pa;

    if (qrData.am) {
      amountEl.value = qrData.am;
    }

    display.classList.remove('hidden');

    document.getElementById('clear-qr-data').addEventListener('click', () => {
      qrData = null;
      display.classList.add('hidden');
      amountEl.value = '';
    });
  } catch {
    qrData = null;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const createForm = document.getElementById('create-split-form');
  const openDialogBtn = document.getElementById('open-participants-dialog');
  const closeDialogBtn = document.getElementById('close-dialog');
  const addSelectedBtn = document.getElementById('dialog-add-selected');
  const addFromContactsBtn = document.getElementById('dialog-add-from-contacts');
  const dialogTabs = document.querySelectorAll('.dialog-tab');
  const participantsDialog = document.getElementById('participants-dialog');

  loadQrDataFromSession();

  if (openDialogBtn) {
    await loadContacts();
    openDialogBtn.addEventListener('click', openParticipantsDialog);
  }

  if (closeDialogBtn) {
    closeDialogBtn.addEventListener('click', closeParticipantsDialog);
  }

  if (participantsDialog) {
    participantsDialog.addEventListener('click', (e) => {
      if (e.target === participantsDialog) closeParticipantsDialog();
    });
  }

  if (addSelectedBtn) {
    addSelectedBtn.addEventListener('click', () => {
      closeParticipantsDialog();
      renderSelectedChips();
    });
  }

  if (addFromContactsBtn) {
    addFromContactsBtn.addEventListener('click', addFromContactsInDialog);
  }

  dialogTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dialogTabs.forEach(t => {
        t.classList.remove('border-green-600', 'text-green-600');
        t.classList.add('border-transparent', 'text-gray-500');
      });
      tab.classList.add('border-green-600', 'text-green-600');
      tab.classList.remove('border-transparent', 'text-gray-500');

      document.querySelectorAll('.dialog-panel').forEach(p => p.classList.add('hidden'));
      dialogActiveCategory = tab.dataset.category;
      document.querySelector(`.dialog-panel[data-category="${dialogActiveCategory}"]`).classList.remove('hidden');
      renderDialogPanel(dialogActiveCategory);
    });
  });

  if (createForm) {
    createForm.addEventListener('submit', createSplit);
  }

  if (document.getElementById('splits-container')) loadSplits();
});
