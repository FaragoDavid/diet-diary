export class Segment implements BaseComponent {
  constructor(private component: BaseComponent) {}

  async render() {
    return `
        <div tabindex="0" class="collapse bg-base-300 sm:collapse-arrow">
            <div class="collapse-title text-center text-2xl font-medium">
                ${this.component.title}
            </div>

            <div class="collapse-content px-4">
                ${await this.component.render()}
            </div>
        </div>
    `;
  }
}
