import * as elements from 'typed-html';
import { HTMX_SWAP } from '../utils/htmx';
import { swapOobWrapper } from '../utils/swap-oob-wrapper';

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

function stat(macro: Macro, amount: number, layout: StatLayout, options?: { size?: Size }): string {
  const macroText = macroTexts[macro];
  const amountText = Math.floor(amount);

  if (layout === 'vertical')
    return (
      <div class="flex flex-col justify-center items-center">
        <div class="text text-center text-primary italic">{macroText}</div>
        <div class="text text-center text-primary">{amountText}</div>
      </div>
    ) as string;

  if (layout === 'horizontal') {
    const text = `${macroText}: ${amountText}`;
    return (<div class="text text-secondary italic">{text}</div>) as string;
  }

  if (layout === 'cells') {
    const text = `${macroText}: ${amountText}`;
    const classNames = options?.size ? `text text-secondary ${textSizes[options.size]}` : 'text text-secondary';
    return (<div class={classNames}>{text}</div>) as string;
  }

  return '';
}

export type StatsOptions = { id?: string; layout: StatLayout; size?: Size; span?: string; swapOob?: HtmxSwapOobOption };
export function stats(macroAmounts: { cal: number; carbs: number; fat: number }, options: StatsOptions): string {
  const { cal, carbs, fat } = macroAmounts;
  let { id, layout, size, span, swapOob } = options;
  if (span == undefined) span = '';

  let template = '';

  if (layout === 'vertical' || layout === 'horizontal') {
    const divAttrs: any = {
      class: `flex${size ? ' ' + textSizes[size] : ''}${span ? ' ' + span : ''}`,
    };
    if (id) divAttrs.id = id;
    if (swapOob === HTMX_SWAP.ReplaceElement) divAttrs['hx-swap-oob'] = swapOob;

    template = (
      <div {...divAttrs}>
        {stat('cal', cal, layout)}
        <div class="divider divider-horizontal m-1" />
        {stat('carbs', carbs, layout)}
        <div class="divider divider-horizontal m-1" />
        {stat('fat', fat, layout)}
      </div>
    ) as string;
  }

  if (layout === 'cells') {
    template = `
      ${stat('cal', cal, layout, { size })}
      ${stat('carbs', carbs, layout, { size })}
      ${stat('fat', fat, layout, { size })}
    `;
  }

  if (swapOob && swapOob !== HTMX_SWAP.ReplaceElement) {
    if (!id) throw new Error('id is required for hx-swap-oob');
    return swapOobWrapper(id, swapOob, template);
  }
  return template;
}
