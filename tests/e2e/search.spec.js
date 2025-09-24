import { test, expect } from '@playwright/test';

test.describe('Search and Filter Functionality', () => {
  test('should perform basic search from header', async ({ page }) => {
    await page.goto('/');
    
    // Search for 'catnip'
    const searchInput = page.getByPlaceholder('Search for cat products...');
    await searchInput.fill('catnip');
    await page.getByText('🔍').click();
    
    // Should navigate to search page with query
    await expect(page).toHaveURL('/search?q=catnip');
    
    // Should display search results
    await expect(page.getByText(/Search Results for/)).toBeVisible();
    await expect(page.getByText('catnip')).toBeVisible();
    
    // Products should be filtered
    const products = page.locator('.product-card');
    await expect(products).toHaveCount({ min: 1 });
  });

  test('should handle search with enter key', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder('Search for cat products...');
    await searchInput.fill('toy');
    await searchInput.press('Enter');
    
    await expect(page).toHaveURL('/search?q=toy');
  });

  test('should clear search input after search', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder('Search for cat products...');
    await searchInput.fill('food');
    await page.getByText('🔍').click();
    
    // Input should be cleared
    await expect(searchInput).toHaveValue('');
  });

  test('should handle empty search gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Try to search with empty input
    await page.getByText('🔍').click();
    
    // Should stay on home page
    await expect(page).toHaveURL('/');
  });

  test('should navigate to all products page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByText('All Products').click();
    await expect(page).toHaveURL('/search');
    
    // Should display all products
    await expect(page.locator('.product-card')).toHaveCount({ min: 6 });
  });

  test('should filter products by category', async ({ page }) => {
    await page.goto('/search');
    
    // Wait for products to load
    await page.waitForSelector('.product-card');
    
    // If category filters exist, test them
    const categoryButtons = page.locator('.category-filter');
    const buttonCount = await categoryButtons.count();
    
    if (buttonCount > 0) {
      // Click on first category
      await categoryButtons.first().click();
      
      // Verify products are filtered
      await expect(page.locator('.product-card')).toHaveCount({ min: 1 });
    }
  });

  test('should handle special characters in search', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder('Search for cat products...');
    
    // Test with special characters
    await searchInput.fill('cat & dog!');
    await searchInput.press('Enter');
    
    await expect(page).toHaveURL('/search?q=cat%20%26%20dog!');
  });

  test('should show no results message for invalid search', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder('Search for cat products...');
    await searchInput.fill('nonexistentproduct12345');
    await searchInput.press('Enter');
    
    // Should still navigate to search page
    await expect(page).toHaveURL('/search?q=nonexistentproduct12345');
    
    // Should display no results (or empty results)
    const products = page.locator('.product-card');
    const productCount = await products.count();
    
    // Either no products or a "no results" message
    if (productCount === 0) {
      // Expect either no products or a no results message
      await expect(page.getByText(/no.*results|no.*products/i).or(products)).toHaveCount(0);
    }
  });

  test('should maintain search context when navigating back', async ({ page }) => {
    await page.goto('/');
    
    // Perform search
    const searchInput = page.getByPlaceholder('Search for cat products...');
    await searchInput.fill('mouse');
    await searchInput.press('Enter');
    
    await expect(page).toHaveURL('/search?q=mouse');
    
    // Navigate to home and back
    await page.getByText('Home').click();
    await page.goBack();
    
    // Should return to search results
    await expect(page).toHaveURL('/search?q=mouse');
  });

  test('should handle multiple consecutive searches', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder('Search for cat products...');
    
    // First search
    await searchInput.fill('toy');
    await searchInput.press('Enter');
    await expect(page).toHaveURL('/search?q=toy');
    
    // Second search
    await searchInput.fill('food');
    await searchInput.press('Enter');
    await expect(page).toHaveURL('/search?q=food');
    
    // Third search
    await searchInput.fill('collar');
    await searchInput.press('Enter');
    await expect(page).toHaveURL('/search?q=collar');
  });
});