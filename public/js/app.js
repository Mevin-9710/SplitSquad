const API_BASE = '';

let selectedParticipants = [];
let allContacts = {};
let dialogActiveCategory = 'friends';

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
    panel.innerHTML = `<p class="text-gray-400 text-center py-8">No contacts in this category. <a href="/contacts" class="text-green-600 underline">Manage Participants</a></p>`;
    return;
  }

  panel.innerHTML = '';
  contacts.forEach(contact => {
    const isSelected = selectedParticipants.some(p => p.id === contact.id);
    const row = document.createElement('label');
    row.className = `flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50 border border-transparent'}`;
    row.innerHTML = `
      <input type="checkbox" class="contact-checkbox w-4 h-4 text-green-600 rounded" value="${contact.id}" ${isSelected ? 'checked' : ''}>
      <div class="flex-1">
        <p class="font-medium">${escapeHtml(contact.name)}</p>
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

  const perPerson = amount / selectedParticipants.length;

  const participants = selectedParticipants.map(p => ({
    name: p.name,
    phone: p.phone,
    amount: Math.round(perPerson * 100) / 100,
  }));

  try {
    const response = await fetch('/api/splits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, amount, participants }),
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

document.addEventListener('DOMContentLoaded', async () => {
  const createForm = document.getElementById('create-split-form');
  const openDialogBtn = document.getElementById('open-participants-dialog');
  const closeDialogBtn = document.getElementById('close-dialog');
  const addSelectedBtn = document.getElementById('dialog-add-selected');
  const addFromContactsBtn = document.getElementById('dialog-add-from-contacts');
  const dialogTabs = document.querySelectorAll('.dialog-tab');
  const participantsDialog = document.getElementById('participants-dialog');

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
