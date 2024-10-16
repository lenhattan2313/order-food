import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type AxeFixture = {
  axeBuilder: () => AxeBuilder;
};

export const accessibilityTest = test.extend<AxeFixture>({
  axeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).withRules([
        'accesskeys',
        'area-alt',
        'aria-allowed-role',
        'aria-braille-equivalent',
        'aria-conditional-attr',
        'aria-deprecated-role',
        'aria-dialog-name',
        'aria-prohibited-attr',
        'aria-roledescription',
        'aria-treeitem-name',
        'aria-text',
        'audio-caption',
        'blink',
        'duplicate-id',
        // 'empty-heading',
        'frame-focusable-content',
        'frame-title-unique',
        'heading-order',
        'html-xml-lang-mismatch',
        'identical-links-same-purpose',
        'image-redundant-alt',
        'input-button-name',
        // 'label-content-name-mismatch',
        'landmark-one-main',
        'link-in-text-block',
        'marquee',
        'meta-viewport',
        'nested-interactive',
        'no-autoplay-audio',
        'role-img-alt',
        'scrollable-region-focusable',
        'select-name',
        'server-side-image-map',
        'skip-link',
        'summary-name',
        'svg-img-alt',
        'tabindex',
        'table-duplicate-name',
        'table-fake-caption',
        'target-size',
        'td-has-header',
        'button-name',
        'image-alt',
      ]);
    await use(makeAxeBuilder);
  },
});