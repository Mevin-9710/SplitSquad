function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function isValidUpiId(upiId) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(upiId.trim());
}

function showStatus(msg, isError = false) {
  const el = document.getElementById('status-msg');
  el.textContent = msg;
  el.className = `text-sm text-center mt-4 ${isError ? 'text-red-500' : 'text-green-600'}`;
  setTimeout(() => { el.textContent = ''; }, 3000);
}

async function loadUpiProfiles() {
  try {
    const response = await fetch('/api/profile/upi');
    const data = await response.json();
    renderUpiList(data.profiles || []);
  } catch {
    showStatus('Failed to load UPI profiles', true);
  }
}

function renderUpiList(profiles) {
  const listEl = document.getElementById('upi-list');
  const emptyEl = document.getElementById('upi-empty');

  listEl.innerHTML = '';

  if (profiles.length === 0) {
    listEl.innerHTML = `
      <div class="text-center py-8 text-gray-400" id="upi-empty">
        <p>No UPI IDs saved yet.</p>
        <p class="text-sm mt-1">Add your UPI ID to receive payments automatically.</p>
      </div>
    `;
    return;
  }

  profiles.forEach(profile => {
    const card = document.createElement('div');
    card.className = `flex items-center justify-between p-3 rounded-lg border ${profile.is_default ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`;
    card.innerHTML = `
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <p class="font-mono text-sm font-medium truncate">${escapeHtml(profile.upi_id)}</p>
          ${profile.is_default ? '<span class="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">Default</span>' : ''}
        </div>
        <p class="text-xs text-gray-500">${escapeHtml(profile.label)}</p>
      </div>
      <div class="flex gap-1 ml-2">
        ${!profile.is_default ? `<button type="button" class="set-default-btn text-xs text-green-600 hover:text-green-800 px-2 py-1" data-id="${profile.id}">Set Default</button>` : ''}
        <button type="button" class="edit-label-btn text-xs text-gray-500 hover:text-gray-700 px-2 py-1" data-id="${profile.id}" data-label="${escapeHtml(profile.label)}">Edit</button>
        <button type="button" class="delete-upi-btn text-xs text-red-500 hover:text-red-700 px-2 py-1" data-id="${profile.id}">Delete</button>
      </div>
    `;

    card.querySelector('.set-default-btn')?.addEventListener('click', async () => {
      try {
        await fetch(`/api/profile/upi/${profile.id}/default`, { method: 'POST' });
        loadUpiProfiles();
        showStatus('Default updated');
      } catch {
        showStatus('Failed to update default', true);
      }
    });

    card.querySelector('.edit-label-btn').addEventListener('click', () => {
      document.getElementById('edit-label-id').value = profile.id;
      document.getElementById('edit-label-input').value = profile.label;
      const modal = document.getElementById('edit-label-modal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });

    card.querySelector('.delete-upi-btn').addEventListener('click', async () => {
      if (!confirm('Delete this UPI ID?')) return;
      try {
        await fetch(`/api/profile/upi/${profile.id}`, { method: 'DELETE' });
        loadUpiProfiles();
        showStatus('UPI ID removed');
      } catch {
        showStatus('Failed to delete', true);
      }
    });

    listEl.appendChild(card);
  });
}

async function addUpiProfile(upiId, label) {
  const response = await fetch('/api/profile/upi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ upiId, label }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to add');
  return data;
}

async function updateLabel(id, label) {
  const response = await fetch(`/api/profile/upi/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to update');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add-upi-btn');
  const addModal = document.getElementById('add-upi-modal');
  const addForm = document.getElementById('add-upi-form');
  const cancelAddBtn = document.getElementById('cancel-add-upi');
  const upiInput = document.getElementById('new-upi-id');
  const validationError = document.getElementById('upi-validation-error');

  const editModal = document.getElementById('edit-label-modal');
  const editForm = document.getElementById('edit-label-form');
  const cancelEditBtn = document.getElementById('cancel-edit-label');

  const testUpiBtn = document.getElementById('test-upi-btn');
  const testUpiInput = document.getElementById('test-upi-id');

  loadUpiProfiles();

  addBtn.addEventListener('click', () => {
    addModal.classList.remove('hidden');
    addModal.classList.add('flex');
    upiInput.value = '';
    document.getElementById('new-upi-label').value = '';
    validationError.classList.add('hidden');
    upiInput.focus();
  });

  cancelAddBtn.addEventListener('click', () => {
    addModal.classList.add('hidden');
    addModal.classList.remove('flex');
  });

  addModal.addEventListener('click', (e) => {
    if (e.target === addModal) {
      addModal.classList.add('hidden');
      addModal.classList.remove('flex');
    }
  });

  upiInput.addEventListener('input', () => {
    const value = upiInput.value.trim();
    if (value && !isValidUpiId(value)) {
      validationError.textContent = 'Invalid format. Use: name@bank (e.g., rahul@oksbi)';
      validationError.classList.remove('hidden');
    } else {
      validationError.classList.add('hidden');
    }
  });

  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const upiId = upiInput.value.trim();
    const label = document.getElementById('new-upi-label').value.trim();

    if (!isValidUpiId(upiId)) {
      validationError.textContent = 'Invalid UPI ID format';
      validationError.classList.remove('hidden');
      return;
    }

    try {
      await addUpiProfile(upiId, label || 'UPI');
      addModal.classList.add('hidden');
      addModal.classList.remove('flex');
      loadUpiProfiles();
      showStatus('UPI ID added');
    } catch (error) {
      showStatus(error.message, true);
    }
  });

  cancelEditBtn.addEventListener('click', () => {
    editModal.classList.add('hidden');
    editModal.classList.remove('flex');
  });

  editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
      editModal.classList.add('hidden');
      editModal.classList.remove('flex');
    }
  });

  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-label-id').value;
    const label = document.getElementById('edit-label-input').value.trim();

    if (!label) return;

    try {
      await updateLabel(id, label);
      editModal.classList.add('hidden');
      editModal.classList.remove('flex');
      loadUpiProfiles();
      showStatus('Label updated');
    } catch (error) {
      showStatus(error.message, true);
    }
  });

  testUpiBtn.addEventListener('click', () => {
    const upiId = testUpiInput.value.trim();
    if (!upiId || !isValidUpiId(upiId)) {
      showStatus('Enter a valid UPI ID', true);
      return;
    }
    const uri = `upi://pay?pa=${encodeURIComponent(upiId)}&am=1&tn=SplitSquad+Test&cu=INR`;
    window.location.href = uri;
  });
});
