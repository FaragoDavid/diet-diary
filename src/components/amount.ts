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
export function amount(options: AmountInputOptions) {
  const { amount, name, showText, hx, id } = options;

  return `
    <div ${id ? `id="${id}"` : ''}
      class="flex flex-col justify-center items-center gap-y-1">
      ${showText ? `<div class="text text-center text-sm italic">${texts.amount}</div>` : ''}
      <div class="flex justify-center items-center">
        <input 
          type="number"
          ${name ? `name="${name}"` : ''}
          class="input input-sm input-bordered w-16 pr-5 text-right peer placeholder:text-neutral" 
          ${amount ? `value="${amount}"` : ''}
          placeholder="0"
          ${hx ? `hx-${hx.verb}="${hx.url}"` : ''}
          ${hx?.target ? `hx-target="${hx.target}"` : ''}
          ${hx?.include ? `hx-include="${hx.include}"` : ''}
          ${hx?.swap ? `hx-swap="${hx.swap}"` : ''}
          ${hx?.trigger ? `hx-trigger="${hx.trigger}"` : ''}
        >
          <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
        </input>
      </div>
    </div>
  `;
}
