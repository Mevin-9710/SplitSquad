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

function showStatus(msg, isError = false) {
  const el = document.getElementById('status-msg');
  el.textContent = msg;
  el.className = `text-sm text-center ${isError ? 'text-red-500' : 'text-green-600'}`;
  setTimeout(() => { el.textContent = ''; }, 3000);
}

function createContactRow(contact) {
  const row = document.createElement('div');
  row.className = 'contact-item flex justify-between items-center bg-gray-50 rounded-lg p-3';
  row.dataset.id = contact.id;
  row.innerHTML = `
    <div>
      <p class="font-medium">${escapeHtml(contact.name)}</p>
      <p class="text-sm text-gray-500">${escapeHtml(contact.phone)}</p>
    </div>
    <button type="button" class="delete-contact-btn text-red-500 hover:text-red-700 text-sm font-medium" data-id="${contact.id}">
      Remove
    </button>
  `;
  row.querySelector('.delete-contact-btn').addEventListener('click', () => deleteContact(contact.id, row));
  return row;
}

async function deleteContact(id, rowEl) {
  try {
    const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete');
    rowEl.remove();
    showStatus('Contact removed');
    checkEmptyState(rowEl.closest('.contacts-list'));
  } catch {
    showStatus('Failed to remove contact', true);
  }
}

async function addContact(name, phone, category) {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) throw new Error('Invalid phone number');

  const response = await fetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone: normalizedPhone, category }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to add contact');
  }

  return await response.json();
}

async function addContactsFromDevice(category) {
  if (!('contacts' in navigator) || !('ContactsManager' in window)) {
    showStatus('Contact picker not available in this browser. Use manual entry.', true);
    return;
  }

  try {
    const props = ['name', 'tel'];
    const deviceContacts = await navigator.contacts.select(props, { multiple: true });

    let added = 0;
    for (const c of deviceContacts) {
      const name = Array.isArray(c.name) ? c.name[0] : (c.name || 'Unknown');
      const tel = Array.isArray(c.tel) ? c.tel[0] : c.tel;
      if (!tel) continue;

      try {
        const contact = await addContact(name, tel, category);
        const listEl = document.querySelector(`.contacts-list[data-category="${category}"]`);
        const emptyMsg = listEl.querySelector('.empty-msg');
        if (emptyMsg) emptyMsg.remove();
        listEl.appendChild(createContactRow(contact));
        added++;
      } catch {
        // Skip duplicates or invalid
      }
    }

    showStatus(added ? `Added ${added} contact(s)` : 'No contacts added');
  } catch {
    showStatus('Contact picker access denied', true);
  }
}

function checkEmptyState(listEl) {
  const items = listEl.querySelectorAll('.contact-item');
  if (items.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'text-gray-400 text-center py-8 empty-msg';
    emptyMsg.textContent = 'No contacts in this category yet.';
    listEl.appendChild(emptyMsg);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.category-tab');
  const panels = document.querySelectorAll('.category-panel');
  const addFromContactsBtns = document.querySelectorAll('.add-from-contacts-btn');
  const addManualBtns = document.querySelectorAll('.add-manual-btn');
  const manualModal = document.getElementById('manual-add-modal');
  const manualCategoryEl = document.getElementById('manual-category');
  const manualForm = document.getElementById('manual-add-form');
  const cancelManualBtn = document.getElementById('cancel-manual-add');

  let currentCategory = null;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('border-green-600', 'text-green-600');
        t.classList.add('border-transparent', 'text-gray-500');
      });
      tab.classList.add('border-green-600', 'text-green-600');
      tab.classList.remove('border-transparent', 'text-gray-500');

      panels.forEach(p => p.classList.add('hidden'));
      const target = tab.dataset.category;
      document.querySelector(`.category-panel[data-category="${target}"]`).classList.remove('hidden');
    });
  });

  addFromContactsBtns.forEach(btn => {
    btn.addEventListener('click', () => addContactsFromDevice(btn.dataset.category));
  });

  addManualBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.dataset.category;
      manualCategoryEl.textContent = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
      manualModal.classList.remove('hidden');
      manualModal.classList.add('flex');
      document.getElementById('manual-name').value = '';
      document.getElementById('manual-phone').value = '';
      document.getElementById('manual-name').focus();
    });
  });

  cancelManualBtn.addEventListener('click', () => {
    manualModal.classList.add('hidden');
    manualModal.classList.remove('flex');
  });

  manualModal.addEventListener('click', (e) => {
    if (e.target === manualModal) {
      manualModal.classList.add('hidden');
      manualModal.classList.remove('flex');
    }
  });

  manualForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('manual-name').value.trim();
    const phone = document.getElementById('manual-phone').value.trim();

    if (!name || !phone) return;

    try {
      const contact = await addContact(name, phone, currentCategory);
      const listEl = document.querySelector(`.contacts-list[data-category="${currentCategory}"]`);
      const emptyMsg = listEl.querySelector('.empty-msg');
      if (emptyMsg) emptyMsg.remove();
      listEl.appendChild(createContactRow(contact));
      manualModal.classList.add('hidden');
      manualModal.classList.remove('flex');
      showStatus('Contact added');
    } catch (error) {
      showStatus(error.message, true);
    }
  });

  document.querySelectorAll('.delete-contact-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.contact-item');
      deleteContact(btn.dataset.id, row);
    });
  });
});
