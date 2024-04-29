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

export function stats(
  macroAmounts: { cal: number; carbs: number; fat: number },
  options: { id?: string; layout: StatLayout; size?: Size; span?: string; swap?: boolean },
) {
  const { cal, carbs, fat } = macroAmounts;
  let { id, layout, size, span, swap } = options;
  if (span == undefined) span = '';
  if (swap == undefined) swap = false;

  if (layout === 'vertical' || layout === 'horizontal')
    return `
      <div id="${id}" class="flex ${size ? textSizes[size] : ''} ${span || ''}" ${swap ? `hx-swap-oob="true"` : ''}>
        ${stat('cal', cal, layout)}
        <div class="divider divider-horizontal"></div> 
        ${stat('carbs', carbs, layout)}
        <div class="divider divider-horizontal"></div> 
        ${stat('fat', fat, layout)}
      </div>
    `;
  if (layout === 'cells') return [stat('cal', cal, layout, { size }), stat('carbs', carbs, layout, { size }), stat('fat', fat, layout, { size })].join('');
  return ``;
}
