type HtmxSwap = 'innerHTML' | 'outerHTML' | 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend' | 'delete';
type HtmxSwapOobOption = HtmxSwap | false;

interface BaseComponent {
  render: () => Promise<string>;
  title?: string;
}
