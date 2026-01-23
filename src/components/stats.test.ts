import { stats } from './stats';

describe('stats', () => {
  const macroAmounts = { cal: 200, carbs: 50, fat: 10 };

  describe('vertical layout', () => {
    it('should render vertical stats without id', () => {
      const html = stats(macroAmounts, { layout: 'vertical' });

      expect(html).toContain('flex flex-col');
      expect(html).toContain('Kal');
      expect(html).toContain('200');
      expect(html).toContain('CH');
      expect(html).toContain('50');
      expect(html).toContain('zsír');
      expect(html).toContain('10');
      expect(html).toContain('divider divider-horizontal');
    });

    it('should render vertical stats with id and size', () => {
      const html = stats(macroAmounts, { layout: 'vertical', id: 'test-stats', size: 'lg' });

      expect(html).toContain('id="test-stats"');
      expect(html).toContain('text-lg');
    });
  });

  describe('horizontal layout', () => {
    it('should render horizontal stats', () => {
      const html = stats(macroAmounts, { layout: 'horizontal' });

      expect(html).toContain('Kal: 200');
      expect(html).toContain('CH: 50');
      expect(html).toContain('zsír: 10');
      expect(html).toContain('text-secondary italic');
    });
  });

  describe('cells layout', () => {
    it('should render cells stats without wrapper', () => {
      const html = stats(macroAmounts, { layout: 'cells' });

      expect(html).toContain('Kal: 200');
      expect(html).toContain('CH: 50');
      expect(html).toContain('zsír: 10');
      expect(html).not.toContain('divider');
    });

    it('should render cells stats with size', () => {
      const html = stats(macroAmounts, { layout: 'cells', size: 'sm' });

      expect(html).toContain('text-sm');
    });
  });

  describe('swapOob', () => {
    it('should add hx-swap-oob attribute for ReplaceElement', () => {
      const html = stats(macroAmounts, { layout: 'vertical', id: 'test', swapOob: 'outerHTML' });

      expect(html).toContain('hx-swap-oob="outerHTML"');
    });

    it('should wrap with swapOobWrapper for other swap types', () => {
      const html = stats(macroAmounts, { layout: 'cells', id: 'test', swapOob: 'beforebegin' });

      expect(html).toContain('hx-swap-oob');
      expect(html).toContain('id=test');
    });

    it('should throw error when id is missing for non-ReplaceElement swap', () => {
      expect(() => {
        stats(macroAmounts, { layout: 'cells', swapOob: 'beforebegin' });
      }).toThrow('id is required for hx-swap-oob');
    });
  });

  describe('span option', () => {
    it('should add span class when provided', () => {
      const html = stats(macroAmounts, { layout: 'vertical', span: 'col-span-2' });

      expect(html).toContain('col-span-2');
    });
  });
});
