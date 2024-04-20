const macroTexts = {
  cal: 'Kal',
  carbs: 'CH',
  fat: 'zsír',
};
const textSizes = {
  sm: 'text-sm',
  lg: 'text-lg',
};

function stat(macro: 'cal' | 'carbs' | 'fat', amount: number, orientation: 'horizontal' | 'vertical') {
  if (orientation === 'vertical')
    return `
      <div class="flex flex-col justify-center items-center">
        <div class="text text-center text-primary italic">${macroTexts[macro]}</div>
        <div class="text text-center text-primary">${Math.floor(amount)}</div>
      </div>`;
  if (orientation === 'horizontal')
    return `<div class="text text-secondary italic">${macroTexts[macro]}: ${Math.floor(amount)}</div>`;
}

export function stats(
  macroAmounts: { cal: number; carbs: number; fat: number },
  options: { id: string; orientation: 'horizontal' | 'vertical'; size?: 'sm' | 'lg'; span?: string; swap?: boolean },
) {
  const { cal, carbs, fat } = macroAmounts;
  let { id, orientation, size, span, swap } = options;
  if (span == undefined) span = '';
  if (swap == undefined) swap = false;

  return `
    <div id="${id}" class="flex ${size ? textSizes[size] : ''} ${span || ''}" ${swap ? `hx-swap-oob="true"` : ''}>
      ${stat('cal', cal, orientation)}
      <div class="divider divider-horizontal" ></div> 
      ${stat('carbs', carbs, orientation)}
      <div class="divider divider-horizontal" ></div> 
      ${stat('fat', fat, orientation)}
    </div>
  `;
}
