import { HTMX_SWAP } from './htmx.js';

export function swapOobWrapper(id: string, swapOob: HtmxSwap, template: string): string {
  return `<div id=${id} hx-swap-oob="${swapOob}">${template}</div>`;
}

export function swapOobTag(swapOob: HtmxSwapOobOption): string {
  return swapOob === HTMX_SWAP.ReplaceElement ? `hx-swap-oob="${HTMX_SWAP.ReplaceElement}"` : '';
}
