const texts = {
  amount: 'Menny.',
};

type HxSwap = 'outerHTML' | 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend' | 'delete' | 'none';

export function amount(options: {
  amount?: number;
  name?: string;
  showText?: boolean;
  hx?: { verb: 'get' | 'post'; url: string; target?: string; swap?: HxSwap, include?: string, trigger?: string };
}) {
  const { amount, name, showText, hx } = options;
  return `
    <div class="flex flex-col justify-center items-center gap-y-1">
      ${showText ? `<div class="text text-center text-sm italic">${texts.amount}</div>` : ''}
      <div class="flex justify-center items-center">
        <input 
          type="number"
          ${name ? `name="${name}"` : ''}
          class="input input-sm input-bordered w-16 pr-5 text-right peer placeholder:text-neutral" 
          ${amount ? `value="${amount}"` : ''}
          ${!amount ? 'placeholder="0"' : ''}
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
