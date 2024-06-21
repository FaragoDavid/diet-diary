import { HTMX_SWAP } from '../utils/htmx.js';
import { swapOobWrapper } from '../utils/swap-oob-wrapper.js';

const macroTexts = {
  cal: 'Kal',
  carbs: 'CH',
  fat: 'zsír',
};
const textSizes = {
  sm: 'text-sm',
  lg: 'text-lg',
};
export type StatLayout = 'horizontal' | 'vertical' | 'cells';
type Macro = 'cal' | 'carbs' | 'fat';
type Size = 'sm' | 'lg';

function stat(macro: Macro, amount: number, layout: StatLayout, options?: { size?: Size }) {
  const macroText = macroTexts[macro];
  const amountText = Math.floor(amount);

  if (layout === 'vertical')
    return `
      <div class="flex flex-col justify-center items-center">
        <div class="text text-center text-primary italic">${macroText}</div>
        <div class="text text-center text-primary">${amountText}</div>
      </div>`;
  if (layout === 'horizontal') return `<div class="text text-secondary italic">${macroText}: ${amountText}</div>`;
  if (layout === 'cells')
    return `<div class="text text-secondary ${options?.size ? textSizes[options.size] : ''}">${macroText}: ${amountText}</div>`;
}
export type StatsOptions = { id?: string; layout: StatLayout; size?: Size; span?: string; swapOob?: HtmxSwapOobOption };
export function stats(macroAmounts: { cal: number; carbs: number; fat: number }, options: StatsOptions) {
  const { cal, carbs, fat } = macroAmounts;
  let { id, layout, size, span, swapOob } = options;
  if (span == undefined) span = '';

  let template = '';
  if (layout === 'vertical' || layout === 'horizontal')
    template = `
      <div id="${id}" class="flex ${size ? textSizes[size] : ''} ${span || ''}" ${
      swapOob === HTMX_SWAP.ReplaceElement ? `hx-swap-oob="${swapOob}"` : ''
    }>
        ${stat('cal', cal, layout)}
        <div class="divider divider-horizontal m-1"></div> 
        ${stat('carbs', carbs, layout)}
        <div class="divider divider-horizontal m-1"></div> 
        ${stat('fat', fat, layout)}
      </div>
    `;
  if (layout === 'cells')
    template = `
      ${stat('cal', cal, layout, { size })}
      ${stat('carbs', carbs, layout, { size })}
      ${stat('fat', fat, layout, { size })}
    `;

  if (swapOob && swapOob !== HTMX_SWAP.ReplaceElement) {
    if (!id) throw new Error('id is required for hx-swap-oob');
    return swapOobWrapper(id, swapOob, template);
  }
  return template;
}
