import * as elements from 'typed-html';
import { HTMX_SWAP } from '../utils/htmx';

const texts = {
  amount: 'Menny.',
};

export type AmountInputHtmxOption = {
  verb: 'get' | 'post';
  url: string;
  target?: string;
  swap?: `${HTMX_SWAP}`;
  include?: string;
  trigger?: string;
};
export type AmountInputOptions = { id?: string; amount?: number; name?: string; showText?: boolean; hx?: AmountInputHtmxOption };
export function amount(options: AmountInputOptions): string {
  const { amount, name, showText, hx, id } = options;

  const divAttrs: any = {
    class: 'flex flex-col justify-center items-center gap-y-1',
  };
  if (id) divAttrs.id = id;

  const inputAttrs: any = {
    type: 'number',
    class: 'input input-sm input-bordered w-16 pr-5 text-right peer placeholder:text-neutral',
    placeholder: '0',
  };

  if (name) inputAttrs.name = name;
  if (amount !== undefined) inputAttrs.value = amount.toString();
  if (hx?.verb === 'get') inputAttrs['hx-get'] = hx.url;
  if (hx?.verb === 'post') inputAttrs['hx-post'] = hx.url;
  if (hx?.target) inputAttrs['hx-target'] = hx.target;
  if (hx?.include) inputAttrs['hx-include'] = hx.include;
  if (hx?.swap) inputAttrs['hx-swap'] = hx.swap;
  if (hx?.trigger) inputAttrs['hx-trigger'] = hx.trigger;

  return (
    <div {...divAttrs}>
      {showText && <div class="text text-center text-sm italic">{texts.amount}</div>}
      <div class="flex justify-center items-center">
        <input {...inputAttrs} />
        <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
      </div>
    </div>
  ) as string;
}
