export interface RenderableComponent {
  render(...args: any[]): Promise<string> | string;
}
