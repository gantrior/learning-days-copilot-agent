import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear any existing cart data
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should add product to cart and update cart badge', async ({ page }) => {
    // Add first product to cart
    const firstProduct = page.locator('.product-card').first();
    const productName = await firstProduct.locator('.product-name').textContent();
    
    await firstProduct.locator('.add-to-cart-btn').click();
    
    // Check cart badge appears with count 1
    await expect(page.locator('.cart-badge')).toBeVisible();
    await expect(page.locator('.cart-badge')).toHaveText('1');
    
    // Add another product
    const secondProduct = page.locator('.product-card').nth(1);
    await secondProduct.locator('.add-to-cart-btn').click();
    
    // Check cart badge updates to 2
    await expect(page.locator('.cart-badge')).toHaveText('2');
  });

  test('should complete cart workflow from homepage to checkout', async ({ page }) => {
    // Step 1: Add products to cart
    const firstProduct = page.locator('.product-card').first();
    const productName = await firstProduct.locator('.product-name').textContent();
    const productPrice = await firstProduct.locator('.product-price').textContent();
    
    await firstProduct.locator('.add-to-cart-btn').click();
    
    // Step 2: Navigate to cart
    await page.getByText('🛒 Cart').click();
    await expect(page).toHaveURL('/cart');
    
    // Check cart page content
    await expect(page.getByText('Shopping Cart')).toBeVisible();
    await expect(page.getByText(productName)).toBeVisible();
    await expect(page.getByText(productPrice)).toBeVisible();
    
    // Step 3: Update quantity
    const quantityInput = page.locator('input[type="number"]').first();
    await quantityInput.fill('2');
    
    // Verify quantity update
    await expect(quantityInput).toHaveValue('2');
    
    // Step 4: Proceed to checkout
    await page.getByText('Proceed to Checkout').click();
    await expect(page).toHaveURL('/checkout');
    
    // Step 5: Fill checkout form
    await page.getByLabel('First Name').fill('John');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByLabel('Email').fill('john.doe@example.com');
    await page.getByLabel('Phone').fill('555-123-4567');
    await page.getByLabel('Address').fill('123 Main St');
    await page.getByLabel('City').fill('Anytown');
    await page.getByLabel('State/Province').fill('CA');
    await page.getByLabel('ZIP/Postal Code').fill('12345');
    await page.getByLabel('Country').selectOption('US');
    
    // Payment information
    await page.getByLabel('Cardholder Name').fill('John Doe');
    await page.getByLabel('Card Number').fill('4111 1111 1111 1111');
    await page.getByLabel('Expiry Date').fill('12/25');
    await page.getByLabel('CVV').fill('123');
    
    // Step 6: Submit order
    await page.getByText('Place Order').click();
    
    // Step 7: Verify order confirmation
    await expect(page).toHaveURL(/\/order-confirmation/);
    await expect(page.getByText('Order Confirmation')).toBeVisible();
    await expect(page.getByText(/Order #/)).toBeVisible();
    await expect(page.getByText('Thank you for your order!')).toBeVisible();
    
    // Verify cart is cleared
    await page.getByText('Home').click();
    await expect(page.locator('.cart-badge')).not.toBeVisible();
  });

  test('should persist cart data across page reloads', async ({ page }) => {
    // Add product to cart
    const firstProduct = page.locator('.product-card').first();
    await firstProduct.locator('.add-to-cart-btn').click();
    
    // Verify cart badge
    await expect(page.locator('.cart-badge')).toHaveText('1');
    
    // Reload page
    await page.reload();
    
    // Verify cart persists
    await expect(page.locator('.cart-badge')).toHaveText('1');
    
    // Navigate to cart and verify content
    await page.getByText('🛒 Cart').click();
    await expect(page.locator('.cart-item')).toHaveCount(1);
  });

  test('should handle cart operations - remove and clear', async ({ page }) => {
    // Add multiple products
    await page.locator('.product-card').first().locator('.add-to-cart-btn').click();
    await page.locator('.product-card').nth(1).locator('.add-to-cart-btn').click();
    await page.locator('.product-card').nth(2).locator('.add-to-cart-btn').click();
    
    // Go to cart
    await page.getByText('🛒 Cart').click();
    
    // Verify 3 items
    await expect(page.locator('.cart-item')).toHaveCount(3);
    
    // Remove one item
    await page.locator('.remove-item-btn').first().click();
    await expect(page.locator('.cart-item')).toHaveCount(2);
    
    // Clear entire cart
    await page.getByText('Clear Cart').click();
    
    // Verify empty cart message
    await expect(page.getByText('Your cart is empty')).toBeVisible();
    await expect(page.getByText('Continue Shopping')).toBeVisible();
  });

  test('should calculate totals correctly', async ({ page }) => {
    // Add product with known price
    const firstProduct = page.locator('.product-card').first();
    const priceText = await firstProduct.locator('.product-price').textContent();
    const price = parseFloat(priceText.replace('$', ''));
    
    await firstProduct.locator('.add-to-cart-btn').click();
    
    // Go to cart
    await page.getByText('🛒 Cart').click();
    
    // Update quantity to 3
    await page.locator('input[type="number"]').first().fill('3');
    
    // Verify total calculation
    const expectedTotal = (price * 3).toFixed(2);
    await expect(page.getByText(`$${expectedTotal}`)).toBeVisible();
  });
});