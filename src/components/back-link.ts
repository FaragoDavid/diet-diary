import format from 'html-format';

import icons from '../utils/icons';

export class BackLink implements BaseComponent {
  constructor(private target: string) {}

  async render() {
    return format(`
      <a href="/dashboard/${this.target}" class="fixed top-2 left-2 bg-base-200 rounded-lg">
        <button type="submit" class="btn-sm">${icons.back}</button>
      </a>
    `);
  }
}