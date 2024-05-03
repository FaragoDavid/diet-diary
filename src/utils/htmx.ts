export const enum HTMX_SWAP {
  ReplaceChildren = 'innerHTML',
  ReplaceElement = 'outerHTML',
  BeforeElement = 'beforebegin',
  BeforeFirstChild = 'afterbegin',
  AfterLastChild = 'beforeend',
  AfterElement = 'afterend',
  Delete = 'delete',
}
