import { test, expect, chromium } from '@playwright/test';

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

test.describe('SplitSquad E2E Tests', () => {
  test('Landing page loads with correct title', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto(SERVER_URL);
    
    // Check page title
    const title = await page.title();
    expect(title).toContain('SplitSquad');
    
    // Check hero heading
    const heading = page.locator('h1');
    await expect(heading).toContainText('SplitSquad');
    
    await browser.close();
  });

  test('No console errors on landing page', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const consoleErrors = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto(SERVER_URL);
    await page.waitForLoadState('networkidle');

    // Filter out expected errors (like favicon 404)
    const criticalErrors = consoleErrors.filter(
      err => !err.includes('favicon') && !err.includes('404')
    );

    expect(criticalErrors.length).toBe(0);
    await browser.close();
  });

  test('Footer is present', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto(SERVER_URL);
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('SplitSquad');
    
    await browser.close();
  });

  test('Health check endpoint returns ok', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const response = await context.request.get(`${SERVER_URL}/api/health`);
    
    expect(response.ok()).toBe(true);
    
    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.timestamp).toBeDefined();
    
    await browser.close();
  });

  test('Landing page shows "How It Works" section', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto(SERVER_URL);
    
    const howItWorks = page.locator('text=How It Works');
    await expect(howItWorks).toBeVisible();
    
    // Check for the three steps
    await expect(page.locator('text=Send to Bot')).toBeVisible();
    await expect(page.locator('text=Add Participants')).toBeVisible();
    await expect(page.locator('text=Track & Settle')).toBeVisible();
    
    await browser.close();
  });

  test('Recent splits section is present', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto(SERVER_URL);
    
    const recentSplits = page.locator('text=Recent Splits');
    await expect(recentSplits).toBeVisible();
    
    await browser.close();
  });
});
