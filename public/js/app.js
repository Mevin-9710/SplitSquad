const API_BASE = '';

let selectedParticipants = [];
let allContacts = {};
let dialogActiveCategory = 'friends';
let qrData = null;
let currentPaymentMode = 'creator_paid';

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

function getTutorialState() {
  const match = document.cookie.match(/(^| )splitsquad_tutorial=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[2]));
  } catch {
    return null;
  }
}

function setTutorialState(state) {
  const expires = new Date(Date.now() + 30 * 864e5).toUTCString();
  document.cookie = 'splitsquad_tutorial=' + encodeURIComponent(JSON.stringify(state)) + '; expires=' + expires + '; path=/';
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
  card.className = 'brutalist-border-thin p-4 mb-2 bg-surface-container-lowest';
  const amountDisplay = split.total_amount > 100 ? (split.total_amount / 100).toFixed(2) : split.total_amount;
  card.innerHTML = `
    <div class="flex justify-between items-start mb-2">
      <div>
        <h3 class="font-label-md text-label-md uppercase">${escapeHtml(split.description || 'Untitled')}</h3>
        <p class="font-label-sm text-label-sm text-on-surface-variant">${formatDate(split.created_at)}</p>
      </div>
      <span class="font-label-sm text-label-sm uppercase px-2 py-1 ${split.payment_mode === 'merchant_direct' ? 'bg-surface-container-high' : 'bg-primary-container text-on-primary-fixed'}">${split.payment_mode === 'merchant_direct' ? 'Pay Merchant' : 'I Paid'}</span>
    </div>
    <div class="flex justify-between items-center border-t border-on-surface pt-2">
      <div class="font-headline-md text-headline-md">₹${amountDisplay}</div>
      <a href="/app/split/${split.id}" class="font-label-sm text-label-sm uppercase text-primary hover:text-on-primary-container">View →</a>
    </div>
  `;
  return card;
}

function createSelectedParticipantChip(contact) {
  const chip = document.createElement('div');
  chip.className = 'brutalist-border-thin bg-primary-container px-3 py-2 flex items-center gap-2';
  chip.dataset.id = contact.id;
  chip.innerHTML = `
    <span class="font-label-sm text-label-sm uppercase text-on-primary-fixed">${escapeHtml(contact.name)}</span>
    <button type="button" class="remove-participant text-on-primary-fixed hover:text-on-primary-container">
      <span class="material-symbols-outlined text-4" data-icon="close">close</span>
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
    panel.innerHTML = `<div class="flex flex-col items-center justify-center py-8 gap-2">
      <span class="material-symbols-outlined text-4xl text-outline" data-icon="person_off">person_off</span>
      <p class="font-label-md text-label-md uppercase text-on-surface-variant">No contacts. <a href="/app/contacts" class="text-primary underline">Add some</a></p>
    </div>`;
    return;
  }

  panel.innerHTML = '';
  contacts.forEach(contact => {
    const isSelected = selectedParticipants.some(p => p.id === contact.id);
    const row = document.createElement('label');
    row.className = `flex items-center gap-3 p-3 border-b border-on-surface cursor-pointer transition-colors ${isSelected ? 'bg-primary-container' : 'hover:bg-surface-variant'}`;
    row.innerHTML = `
      <div class="brutalist-border-thin bg-surface-container-high w-10 h-10 flex items-center justify-center flex-shrink-0">
        <span class="font-label-sm text-label-sm uppercase">${contact.name.slice(0, 2).toUpperCase()}</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-label-md text-label-md uppercase truncate">${escapeHtml(contact.name)}</p>
        <p class="font-label-sm text-label-sm text-on-surface-variant">${escapeHtml(contact.phone)}</p>
      </div>
      <div class="brutalist-border-thin w-6 h-6 flex items-center justify-center ${isSelected ? 'bg-primary-container' : 'bg-surface-container-lowest'}">
        ${isSelected ? '<span class="material-symbols-outlined text-4 text-on-primary-fixed" data-icon="check">check</span>' : ''}
      </div>
    `;
    row.addEventListener('click', (e) => {
      e.preventDefault();
      if (selectedParticipants.some(p => p.id === contact.id)) {
        selectedParticipants = selectedParticipants.filter(p => p.id !== contact.id);
      } else {
        selectedParticipants.push(contact);
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

  if (!description || Number.isNaN(amount)) {
    status.textContent = 'Please fill in description and amount.';
    return;
  }

  if (selectedParticipants.length === 0) {
    status.textContent = 'Please add at least one participant.';
    return;
  }

  if (currentPaymentMode === 'creator_paid') {
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

  let participantsList;
  if (currentPaymentMode === 'merchant_direct') {
    participantsList = [
      { id: 'creator', name: 'You', phone: '0000000000', isCreator: true },
      ...selectedParticipants,
    ];
  } else {
    participantsList = [...selectedParticipants];
  }

  const sharesPaise = calculateEqualSplit(totalPaise, participantsList.length);

  const participants = participantsList.map((p, i) => ({
    name: p.name,
    phone: p.isCreator ? 'creator' : p.phone,
    amount: Math.round((sharesPaise[i] / 100) * 100) / 100,
    isCreator: p.isCreator || false,
  }));

  const splitData = {
    description,
    amount,
    participants,
    paymentMode: currentPaymentMode,
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
    container.innerHTML = '<div class="text-center py-8 text-error"><p class="font-label-md text-label-md uppercase">Failed to load splits.</p></div>';
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

function loadQrDataFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const pa = params.get('upi_pa');
  if (!pa) return;

  qrData = {
    pa: pa,
    pn: params.get('upi_pn') || '',
    am: params.get('upi_am') || '',
    cu: params.get('upi_cu') || 'INR',
    tn: params.get('upi_tn') || '',
  };

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

  window.history.replaceState({}, document.title, window.location.pathname);
}

function setupPaymentModeToggle() {
  const buttons = document.querySelectorAll('.payment-mode-btn');
  const merchantBtn = document.querySelector('.payment-mode-btn[data-mode="merchant_direct"]');
  const creatorBtn = document.querySelector('.payment-mode-btn[data-mode="creator_paid"]');

  if (!qrData && merchantBtn) {
    merchantBtn.style.display = 'none';
    creatorBtn.classList.add('border-r-0');
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentPaymentMode = btn.dataset.mode;
      buttons.forEach(b => {
        b.classList.remove('bg-primary-container', 'text-on-primary-fixed');
        b.classList.add('bg-surface-container-lowest', 'text-on-surface-variant');
      });
      btn.classList.add('bg-primary-container', 'text-on-primary-fixed');
      btn.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');
    });
  });
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
  loadQrDataFromUrl();
  setupPaymentModeToggle();

  if (qrData) {
    const merchantBtn = document.querySelector('.payment-mode-btn[data-mode="merchant_direct"]');
    if (merchantBtn) merchantBtn.style.display = '';
  }

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
        t.classList.remove('bg-primary-container', 'text-on-primary-fixed');
        t.classList.add('bg-surface-container-lowest', 'text-on-surface-variant');
      });
      tab.classList.add('bg-primary-container', 'text-on-primary-fixed');
      tab.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');

      document.querySelectorAll('.dialog-panel').forEach(p => p.classList.add('hidden'));
      dialogActiveCategory = tab.dataset.category;
      document.querySelector(`.dialog-panel[data-category="${dialogActiveCategory}"]`).classList.remove('hidden');
      renderDialogPanel(dialogActiveCategory);
    });
  });

  if (createForm) {
    createForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('create-split-status');
      status.textContent = '';

      const description = document.getElementById('description')?.value.trim();
      const amount = parseFloat(document.getElementById('total-amount')?.value);

      if (!description || Number.isNaN(amount)) {
        status.textContent = 'Please fill in description and amount.';
        return;
      }

      if (selectedParticipants.length === 0) {
        status.textContent = 'Please add at least one participant.';
        return;
      }

      if (currentPaymentMode === 'creator_paid') {
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

      let participantsList;
      if (currentPaymentMode === 'merchant_direct') {
        participantsList = [
          { id: 'creator', name: 'You', phone: '0000000000', isCreator: true },
          ...selectedParticipants,
        ];
      } else {
        participantsList = [...selectedParticipants];
      }

      const sharesPaise = calculateEqualSplit(totalPaise, participantsList.length);

      const participants = participantsList.map((p, i) => ({
        name: p.name,
        phone: p.isCreator ? 'creator' : p.phone,
        amount: Math.round((sharesPaise[i] / 100) * 100) / 100,
        isCreator: p.isCreator || false,
      }));

      const splitData = {
        description,
        amount,
        participants,
        paymentMode: currentPaymentMode,
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

        const tutorialState = getTutorialState();
        if (tutorialState && !tutorialState.completed) {
          tutorialState.tutorialSplitId = data.id;
          setTutorialState(tutorialState);
        }

        selectedParticipants = [];
        renderSelectedChips();
    window.location.href = `/app/split/${data.id}`;
      } catch {
        status.textContent = 'Failed to create split.';
      }
    });
  }

  if (document.getElementById('splits-container')) loadSplits();
});
