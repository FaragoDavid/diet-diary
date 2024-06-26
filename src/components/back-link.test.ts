import { expect } from '@jest/globals';

import { BackLink } from '../components/back-link';
import '../toContainHtml';

jest.mock('../utils/icons', () => ({ back: '<back-icon />' }));

describe('Back Link Component', () => {
  it('renders the back link correctly', async () => {
    const target = 'test-target';

    expect(await new BackLink(target).render()).toContainHtml(`
      <a href="/dashboard/${target}" class="fixed top-2 left-2 bg-base-200 rounded-lg">
        <button type="submit" class="btn-sm"><back-icon /></button>
      </a>
    `);
  });
});
