import * as elements from 'typed-html';
import icons from '../utils/icons';

export async function backLink(target: string) {
  return (
    <a href={`/dashboard/${target}`} class="fixed top-2 left-2 bg-base-200 rounded-lg">
      <button type="submit" class="btn-sm">
        {icons.back}
      </button>
    </a>
  ) as string;
}
