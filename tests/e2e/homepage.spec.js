import { test, expect } from '@playwright/test';

test.describe('Cat E-Shop Homepage', () => {
  test('should load homepage with products', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Cat E-Shop/);
    
    // Check header elements
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.getByText('Cat E-Shop')).toBeVisible();
    await expect(page.getByText('🐱')).toBeVisible();
    
    // Check navigation
    await expect(page.getByText('Home')).toBeVisible();
    await expect(page.getByText('All Products')).toBeVisible();
    await expect(page.getByText('🛒 Cart')).toBeVisible();
    
    // Check search functionality
    await expect(page.getByPlaceholder('Search for cat products...')).toBeVisible();
    await expect(page.getByText('🔍')).toBeVisible();
    
    // Check that products are displayed
    await expect(page.locator('.product-card')).toHaveCount({ min: 6 });
    
    // Check footer
    await expect(page.locator('.footer')).toBeVisible();
  });

  test('should display product information correctly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for products to load
    await page.waitForSelector('.product-card');
    
    const firstProduct = page.locator('.product-card').first();
    
    // Check product card elements
    await expect(firstProduct.locator('.product-image')).toBeVisible();
    await expect(firstProduct.locator('.product-name')).toBeVisible();
    await expect(firstProduct.locator('.product-price')).toBeVisible();
    await expect(firstProduct.locator('.product-description')).toBeVisible();
    await expect(firstProduct.locator('.add-to-cart-btn')).toBeVisible();
    
    // Check price format
    const priceText = await firstProduct.locator('.product-price').textContent();
    expect(priceText).toMatch(/^\$\d+\.\d{2}$/);
  });

  test('should handle responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    
    const desktopProducts = page.locator('.product-card');
    await expect(desktopProducts).toHaveCount({ min: 6 });
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(desktopProducts.first()).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('Cat E-Shop')).toBeVisible();
    await expect(desktopProducts.first()).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Test home link (already on home)
    await page.getByText('Home').click();
    await expect(page).toHaveURL('/');
    
    // Test logo link
    await page.goto('/search'); // Go somewhere else first
    await page.getByText('Cat E-Shop').click();
    await expect(page).toHaveURL('/');
    
    // Test all products link
    await page.getByText('All Products').click();
    await expect(page).toHaveURL('/search');
    
    // Test cart link
    await page.getByText('🛒 Cart').click();
    await expect(page).toHaveURL('/cart');
  });
});