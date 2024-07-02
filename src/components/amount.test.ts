import { expect } from '@jest/globals';

import '../toContainHtml';
import { HTMX_SWAP } from '../utils/htmx';
import { AmountInputHtmxOption, amount as amountInput } from './amount';

describe('Amount Input Component', () => {
  it('renders input with id', () => {
    const id = 'test-id';

    expect(amountInput({ id })).toContainHtml(`
      <div id="${id}"
        class="flex flex-col justify-center items-center gap-y-1">
        <div class="flex justify-center items-center">
          <input
            type="number"
            class="input input-sm input-bordered w-16 pr-5 text-right peer placeholder:text-neutral"
            placeholder="0"
          >
            <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
          </input>
        </div>
      </div>
    `);
  });

  it('renders input with default value', () => {
    const amount = 100;

    expect(amountInput({ amount })).toContainHtml(`
      <div
        class="flex flex-col justify-center items-center gap-y-1">
        <div class="flex justify-center items-center">
          <input
            type="number"
            class="input input-sm input-bordered w-16 pr-5 text-right peer placeholder:text-neutral"
            value="${amount}"
            placeholder="0"
          >
            <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
          </input>
        </div>
      </div>
    `);
  });

  it('renders input with name', () => {
    const name = 'test-name';

    expect(amountInput({ name })).toContainHtml(`
      <div
        class="flex flex-col justify-center items-center gap-y-1">
        <div class="flex justify-center items-center">
          <input
            type="number"
            name="${name}"
            class="input input-sm input-bordered w-16 pr-5 text-right peer placeholder:text-neutral"
            placeholder="0"
          >
            <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
          </input>
        </div>
      </div>
    `);
  });

  it('renders input with text', () => {
    const showText = true;

    expect(amountInput({ showText })).toContainHtml(`
      <div
        class="flex flex-col justify-center items-center gap-y-1">
        <div class="text text-center text-sm italic">Menny.</div>
        <div class="flex justify-center items-center">
          <input
            type="number"
            class="input input-sm input-bordered w-16 pr-5 text-right peer placeholder:text-neutral"
            placeholder="0"
          >
            <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
          </input>
        </div>
      </div>
    `);
  })

  describe('with hx option', () => {
    let hx: AmountInputHtmxOption;

    beforeEach(() => {
      hx = {
        verb: 'get',
        url: 'test-url',
      };
    });

    it('renders input with required htmx attributes', () => {
      expect(amountInput({ hx })).toContainHtml(`
        <div
          class="flex flex-col justify-center items-center gap-y-1">
          <div class="flex justify-center items-center">
            <input
              type="number"
              class="input input-sm input-bordered w-16 pr-5 text-right peer placeholder:text-neutral"
              placeholder="0"
              hx-get="${hx.url}"
            >
              <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
            </input>
          </div>
        </div>
      `);
    });

    it('renders input with htmx target attribute', () => {
      hx.target = 'test-target';

      expect(amountInput({ hx })).toContainHtml(`
        <div
          class="flex flex-col justify-center items-center gap-y-1">
          <div class="flex justify-center items-center">
            <input
              type="number"
              class="input input-sm input-bordered w-16 pr-5 text-right peer placeholder:text-neutral"
              placeholder="0"
              hx-get="${hx.url}"
              hx-target="${hx.target}"
            >
              <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
            </input>
          </div>
        </div>
      `);
    });

    it('renders input with htmx swap attribute', () => {
      hx.swap = HTMX_SWAP.AfterElement;

      expect(amountInput({ hx })).toContainHtml(`
        <div
          class="flex flex-col justify-center items-center gap-y-1">
          <div class="flex justify-center items-center">
            <input
              type="number"
              class="input input-sm input-bordered w-16 pr-5 text-right peer placeholder:text-neutral"
              placeholder="0"
              hx-get="${hx.url}"
              hx-swap="${hx.swap}"
            >
              <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
            </input>
          </div>
        </div>
      `);
    });

    it('renders input with htmx include attribute', () => {
      hx.include = 'test-include';

      expect(amountInput({ hx })).toContainHtml(`
        <div
          class="flex flex-col justify-center items-center gap-y-1">
          <div class="flex justify-center items-center">
            <input
              type="number"
              class="input input-sm input-bordered w-16 pr-5 text-right peer placeholder:text-neutral"
              placeholder="0"
              hx-get="${hx.url}"
              hx-include="${hx.include}"
            >
              <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
            </input>
          </div>
        </div>
      `);
    });

    it('renders input with htmx trigger attribute', () => {
      hx.trigger = 'test-trigger';

      expect(amountInput({ hx })).toContainHtml(`
        <div
          class="flex flex-col justify-center items-center gap-y-1">
          <div class="flex justify-center items-center">
            <input
              type="number"
              class="input input-sm input-bordered w-16 pr-5 text-right peer placeholder:text-neutral"
              placeholder="0"
              hx-get="${hx.url}"
              hx-trigger="${hx.trigger}"
            >
              <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
            </input>
          </div>
        </div>
      `);
    });
  });
});
