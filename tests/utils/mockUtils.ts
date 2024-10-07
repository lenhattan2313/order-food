import { Page, Route } from '@playwright/test';

export async function mockApiResponse(
  page: Page,
  urlPattern: string,
  response: Record<string, unknown>,
  status = 200,
  options?: { headers?: Record<string, string> },
) {
  await page.route(urlPattern, (route: Route) => {
    const headers = options?.headers || { 'Content-Type': 'application/json' };
    route.fulfill({
      status,
      contentType: 'application/json',
      headers,
      body: JSON.stringify(response),
    });
  });
}

export async function mockMultipleApiResponses(
  page: Page,
  mocks: Array<{
    url: string;
    response: Record<string, unknown>;
    status?: number;
    options?: { delay?: number; headers?: Record<string, string> };
  }>,
) {
  await Promise.all(
    mocks.map(({ url, response, status = 200, options }) =>
      mockApiResponse(page, url, response, status, options),
    ),
  );
}
