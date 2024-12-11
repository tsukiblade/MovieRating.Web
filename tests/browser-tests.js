import { browser } from 'k6/browser';
import { sleep } from 'k6';
import { check, randomString } from 'https://jslib.k6.io/k6-utils/1.5.0/index.js';

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    checks: ['rate==1.0'],
  },
};

const BASE_URL = 'http://localhost:5173';

export default async function () {

    const page = await browser.newPage();
  
    try {
      // Test Home Page Load
      await testHomePageLoad(page);
  
      // Test Movie Creation
      const movieId = await testCreateMovie(page);
  
    } finally {
      page.close();
    }
}

async function testHomePageLoad(page) {
    await page.goto(BASE_URL);

    sleep(1)

    // Check if main elements are visible
    check(page, {
        'title exists': async () => await page.locator('[data-testid="movies-title"]').isVisible(),
        'add button exists': async () => await page.locator('[data-testid="add-movie-button"]').isVisible(),
      });
  
    sleep(1);
}

async function testCreateMovie(page) {
    await page.goto(`${BASE_URL}/create`);

    const movieTitle = `Test Movie ${randomString(6)}`;

    await page.locator('[data-testid="movie-title-input"]').type(movieTitle);
    await page.locator('[data-testid="movie-description-input"]').type('Test description');
    await page.locator('[data-testid="movie-genre-input"]').type('Test Genre');
    await page.locator('[data-testid="movie-director-input"]').type('Test Director');
    await page.locator('[data-testid="movie-actors-input"]').type('Actor 1, Actor 2');

    await page.locator('button[type="submit"]').click();

    sleep(1);

    check(page, {
        'redirected to home page': () => page.url().includes('/'),
        'movie created': async () => {
            const moviesList = await page.locator('[data-testid="movies-grid"]').textContent();
            return moviesList.includes(movieTitle);
        },
        //'new movie appears in list': () => page.locator(`text="${movieTitle}"`).isVisible(),
    });
}