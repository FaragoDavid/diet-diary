const macroTexts = {
  cal: 'Kal',
  carbs: 'CH',
  fat: 'zsír',
};
const textSizes = {
  sm: 'text-sm',
  lg: 'text-lg',
};

function stat(macro: 'cal' | 'carbs' | 'fat', amount: number, layout: 'horizontal' | 'vertical' | 'cells') {
  if (layout === 'vertical')
    return `
      <div class="flex flex-col justify-center items-center">
        <div class="text text-center text-primary italic">${macroTexts[macro]}</div>
        <div class="text text-center text-primary">${Math.floor(amount)}</div>
      </div>`;
  if (layout === 'horizontal' || layout === 'cells')
    return `<div class="text text-secondary italic">${macroTexts[macro]}: ${Math.floor(amount)}</div>`;
}

export function stats(
  macroAmounts: { cal: number; carbs: number; fat: number },
  options: { id?: string; layout: 'horizontal' | 'vertical' | 'cells'; size?: 'sm' | 'lg'; span?: string; swap?: boolean },
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
  if (layout === 'cells') return [stat('cal', cal, layout), stat('carbs', carbs, layout), stat('fat', fat, layout)].join('');
  return ``;
}
