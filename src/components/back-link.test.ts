import format from 'html-format';

import { BackLink } from '../components/back-link';

jest.mock('../utils/icons', () => ({
  back: '<back-icon />',
}));

describe('BackLink', () => {
  it('should render the back link correctly', async () => {
    const target = 'test-target';

    expect(await new BackLink(target).render()).toContain(
      format(`
        <a href="/dashboard/${target}" class="fixed top-2 left-2 bg-base-200 rounded-lg">
          <button type="submit" class="btn-sm"><back-icon /></button>
        </a>
      `),
    );
  });
});
