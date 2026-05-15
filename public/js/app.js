/**
 * SplitSquad Frontend Application
 * Handles fetching and displaying splits on the landing page
 */

const API_BASE = '';

/**
 * Format amount in Indian Rupees
 * @param {number} amount - Amount in paise (smallest unit)
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  // Convert from paise to rupees if needed
  const rupees = amount > 100 ? amount / 100 : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Create a split card element
 * @param {Object} split - Split data
 * @returns {HTMLElement} Card element
 */
function createSplitCard(split) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-xl shadow-md p-4 mb-4 hover:shadow-lg transition-shadow';

  const amount = formatCurrency(split.total_amount);
  const date = formatDate(split.created_at);
  const statusClass = split.status === 'settled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  const statusText = split.status === 'settled' ? 'Settled' : 'Pending';

  card.innerHTML = \`
    <div class="flex justify-between items-start mb-3">
      <div>
        <h3 class="font-semibold text-gray-800 text-lg">\${escapeHtml(split.description || 'Untitled Split')}</h3>
        <p class="text-gray-500 text-sm">\${date}</p>
      </div>
      <span class="\${statusClass} px-3 py-1 rounded-full text-xs font-medium capitalize">
        \${statusText}
      </span>
    </div>
    <div class="flex justify-between items-center">
      <div class="text-2xl font-bold text-[#25D366]">\${amount}</div>
      <a href="/split/\${split.id}" class="text-[#25D366] hover:text-[#128C7E] font-medium text-sm">
        View Details →
      </a>
    </div>
  \`;

  return card;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Fetch splits from API and render them
 */
async function loadSplits() {
  const container = document.getElementById('splits-container');
  const emptyState = document.getElementById('empty-state');

  if (!container) {
    console.error('Splits container not found');
    return;
  }

  try {
    const response = await fetch(\`\${API_BASE}/api/splits\`);
    const data = await response.json();

    // Clear loading state
    container.innerHTML = '';

    // Check if there are splits
    const splits = Array.isArray(data) ? data : (data.splits || []);

    if (splits.length === 0) {
      // Show empty state
      container.classList.add('hidden');
      if (emptyState) {
        emptyState.classList.remove('hidden');
      }
      return;
    }

    // Hide empty state
    if (emptyState) {
      emptyState.classList.add('hidden');
    }

    // Render split cards
    splits.forEach(split => {
      const card = createSplitCard(split);
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to load splits:', error);
    container.innerHTML = \`
      <div class="text-center py-8 text-red-500">
        <p>Failed to load splits. Please try again later.</p>
      </div>
    \`;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Only run on pages with splits container
  if (document.getElementById('splits-container')) {
    loadSplits();
  }
});

// Export for testing
export { formatCurrency, formatDate, createSplitCard, loadSplits };
