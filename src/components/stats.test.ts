import { expect } from '@jest/globals';

import '../toContainHtml';
import { HTMX_SWAP } from '../utils/htmx';
import { stats, StatsOptions } from './stats';

describe('stats', () => {
  const macroAmounts = {
    cal: 100,
    carbs: 50,
    fat: 20,
  };

  // @ts-ignore
  const options: StatsOptions = {};

  describe('vertical layout', () => {
    beforeEach(() => {
      options.layout = 'vertical';
    });

    it('renders correctly with id', () => {
      expect(stats(macroAmounts, { ...options, id: 'test-id' })).toContain('id="test-id"');
    });

    it('renders correctly with size', () => {
      expect(stats(macroAmounts, { ...options, size: 'lg' })).toContain('class="flex text-lg"');
      expect(stats(macroAmounts, { ...options, size: 'sm' })).toContain('class="flex text-sm"');
    });

    it('renders correctly with span', () => {
      expect(stats(macroAmounts, { ...options, span: 'col-span-2' })).toContain('class="flex col-span-2"');
    });

    it('renders correctly when swapOob option is replace element', () => {
      expect(stats(macroAmounts, { ...options, swapOob: HTMX_SWAP.ReplaceElement })).toContain(`hx-swap-oob="${HTMX_SWAP.ReplaceElement}"`);
    });

    it('renders correctly when swapOob option is not replace element', () => {
      expect(stats(macroAmounts, { ...options, id: 'test', swapOob: HTMX_SWAP.AfterElement })).toContain('hx-swap-oob');
    });

    it('throws error when swapOob option is not replace element and id is not provided', () => {
      expect(() => stats(macroAmounts, { ...options, swapOob: HTMX_SWAP.AfterElement })).toThrow('id is required for hx-swap-oob');
    });

    it('renders all macros', () => {
      const result = stats(macroAmounts, options);
      expect(result).toContainHtml(`
        <div class="flex">
          <div class="flex flex-col justify-center items-center">
            <div class="text text-center text-primary italic">Kal</div>
            <div class="text text-center text-primary">${macroAmounts.cal}</div>
          </div>
          <div class="divider divider-horizontal m-1" />
          <div class="flex flex-col justify-center items-center">
            <div class="text text-center text-primary italic">CH</div>
            <div class="text text-center text-primary">${macroAmounts.carbs}</div>
          </div>
          <div class="divider divider-horizontal m-1" />
          <div class="flex flex-col justify-center items-center">
            <div class="text text-center text-primary italic">zsír</div>
            <div class="text text-center text-primary">${macroAmounts.fat}</div>
          </div>
        </div>
      `);
    });
  });

  describe('horizontal layout', () => {
    beforeEach(() => {
      options.layout = 'horizontal';
    });

    it('renders correctly with id', () => {
      expect(stats(macroAmounts, { ...options, id: 'test-id' })).toContain('id="test-id"');
    });

    it('renders correctly with size', () => {
      expect(stats(macroAmounts, { ...options, size: 'lg' })).toContain('class="flex text-lg"');
      expect(stats(macroAmounts, { ...options, size: 'sm' })).toContain('class="flex text-sm"');
    });

    it('renders correctly with span', () => {
      expect(stats(macroAmounts, { ...options, span: 'col-span-2' })).toContain('class="flex col-span-2"');
    });

    it('renders correctly when swapOob option is replace element', () => {
      expect(stats(macroAmounts, { ...options, swapOob: HTMX_SWAP.ReplaceElement })).toContain(`hx-swap-oob="${HTMX_SWAP.ReplaceElement}"`);
    });

    it('renders correctly when swapOob option is not replace element', () => {
      expect(stats(macroAmounts, { ...options, id: 'test', swapOob: HTMX_SWAP.AfterElement })).toContain('hx-swap-oob');
    });

    it('throws error when swapOob option is not replace element and id is not provided', () => {
      expect(() => stats(macroAmounts, { ...options, swapOob: HTMX_SWAP.AfterElement })).toThrow('id is required for hx-swap-oob');
    });

    it('renders all macros', () => {
      const result = stats(macroAmounts, options);
      expect(result).toContainHtml(`
        <div class="flex">
          <div class=\"text text-secondary italic\">Kal: ${macroAmounts.cal}</div>
          <div class="divider divider-horizontal m-1" />
          <div class=\"text text-secondary italic\">CH: ${macroAmounts.carbs}</div>
          <div class="divider divider-horizontal m-1" />
          <div class=\"text text-secondary italic\">zsír: ${macroAmounts.fat}</div>
        </div>
      `);
    });
  });

  describe('cells layout', () => {
    beforeEach(() => {
      options.layout = 'cells';
    });

    it('renders correctly when swapOob option is not replace element', () => {
      expect(stats(macroAmounts, { ...options, id: 'test', swapOob: HTMX_SWAP.AfterElement })).toContain('hx-swap-oob');
    });

    it('throws error when swapOob option is not replace element and id is not provided', () => {
      expect(() => stats(macroAmounts, { ...options, swapOob: HTMX_SWAP.AfterElement })).toThrow('id is required for hx-swap-oob');
    });

    it('renders all macros without size option', () => {
      const result = stats(macroAmounts, options);

      expect(result).toContainHtml(`
        <div class="text text-secondary">Kal: ${macroAmounts.cal}</div>
        <div class="text text-secondary">CH: ${macroAmounts.carbs}</div>
        <div class="text text-secondary">zsír: ${macroAmounts.fat}</div>
      `);
    });

    it('renders all macros with size option', () => {
      (['sm', 'lg'] as StatsOptions['size'][]).forEach((size) => {
        expect(stats(macroAmounts, { ...options, size })).toContainHtml(`
          <div class="text text-secondary text-${size}">Kal: ${macroAmounts.cal}</div>
          <div class="text text-secondary text-${size}">CH: ${macroAmounts.carbs}</div>
          <div class="text text-secondary text-${size}">zsír: ${macroAmounts.fat}</div>
        `);
      });
    });
  });
});
