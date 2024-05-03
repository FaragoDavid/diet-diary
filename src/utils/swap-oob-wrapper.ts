export function swapOobWrapper(id: string, swapOob: HtmxSwap, template: string): string {
  return `<div id=${id} hx-swap-oob="${swapOob}">${template}</div>`
}