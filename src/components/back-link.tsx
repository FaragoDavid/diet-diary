import * as elements from 'typed-html';
import icons from '../utils/icons';

export class BackLink {
  constructor(private target: string) {}

  async render(): Promise<string> {
    return (
      <a href={`/dashboard/${this.target}`} class="fixed top-2 left-2 bg-base-200 rounded-lg">
        <button type="submit" class="btn-sm">
          {icons.back}
        </button>
      </a>
    ) as string;
  }
}
