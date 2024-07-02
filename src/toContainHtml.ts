import { expect } from '@jest/globals';
import type { MatcherFunction } from 'expect';
import { html } from 'simply-beautiful';

const toContainHtml: MatcherFunction<[expected: unknown]> = function (actual, expected) {
  const pass = html(actual).includes(html(expected));
  if (pass) {
    return {
      message: () => `expected ${this.utils.printReceived(html(actual))} not to contain substring ${this.utils.printExpected(html(expected))}`,
      pass: true,
    };
  } else {
    return {
      message: () => `expected ${this.utils.printReceived(html(actual))} to contain substring ${this.utils.printExpected(html(expected))}`,
      pass: false,
    };
  }
};

expect.extend({
  toContainHtml,
});

declare module 'expect' {
  interface AsymmetricMatchers {
    toContainHtml(expected: string): void;
  }
  interface Matchers<R> {
    toContainHtml(expected: string): R;
  }
}
