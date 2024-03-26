export class Segment implements BaseComponent {
  constructor(private component: BaseComponent) {}

  async render() {
    return `
      <div tabindex="0" class="collapse bg-base-100 sm:collapse-arrow collapse-open">
        <div class="collapse-title text-center text-2xl font-medium pe-2">
          ${this.component.title}
        </div>

        <div class="collapse-content px-4">
          ${await this.component.render()}
        </div>
      </div>
    `;
  }
}
