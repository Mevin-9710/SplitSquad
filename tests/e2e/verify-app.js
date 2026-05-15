/**
 * SplitSquad E2E Verification Script
 * Run with: node tests/e2e/verify-app.js
 */

const SERVER_URL = 'http://localhost:3000';

async function verify() {
  console.log('Starting SplitSquad E2E Verification...\n');
  
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (err) {
      console.log(`✗ ${name}`);
      console.log(`  Error: ${err.message}`);
      failed++;
    }
  }

  // Test 1: Health check endpoint returns ok
  await test('Health check endpoint returns ok', async () => {
    const res = await globalThis.fetch(`${SERVER_URL}/api/health`);
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(`Status is ${data.status}`);
    if (!data.timestamp) throw new Error('Missing timestamp');
    console.log(`    Response: ${JSON.stringify(data)}`);
  });

  // Test 2: Landing page title
  await test('Landing page loads with correct title', async () => {
    const res = await globalThis.fetch(`${SERVER_URL}/`);
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const html = await res.text();
    if (!html.includes('SplitSquad')) throw new Error('Title not found');
    console.log(`    Title found in HTML`);
  });

  // Test 3: Footer is present
  await test('Footer is present', async () => {
    const res = await globalThis.fetch(`${SERVER_URL}/`);
    const html = await res.text();
    if (!html.includes('<footer')) throw new Error('Footer not found');
    console.log(`    Footer element found`);
  });

  // Test 4: How It Works section
  await test('Landing page shows "How It Works" section', async () => {
    const res = await globalThis.fetch(`${SERVER_URL}/`);
    const html = await res.text();
    if (!html.includes('How It Works')) throw new Error('Section not found');
    if (!html.includes('Send to Bot')) throw new Error('Step 1 not found');
    if (!html.includes('Add Participants')) throw new Error('Step 2 not found');
    if (!html.includes('Track & Settle')) throw new Error('Step 3 not found');
    console.log(`    All 3 steps found`);
  });

  // Test 5: Logo is referenced
  await test('Logo is present', async () => {
    const res = await globalThis.fetch(`${SERVER_URL}/`);
    const html = await res.text();
    if (!html.includes('/images/logo.svg')) throw new Error('Logo not found');
    console.log(`    Logo path found`);
  });

  // Test 6: JavaScript file is loaded
  await test('JavaScript app.js is loaded', async () => {
    const res = await globalThis.fetch(`${SERVER_URL}/`);
    const html = await res.text();
    if (!html.includes('/js/app.js')) throw new Error('app.js not found');
    console.log(`    app.js script found`);
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
