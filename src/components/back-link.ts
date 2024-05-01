import icons from "../utils/icons.js";

export class BackLink implements BaseComponent {
  async render() {
    return `
      <a href="/dashboard" class="fixed top-2 left-2 bg-base-200 rounded-lg">
        <button type="submit" class="btn-sm">${icons.back}</button>
      </a>
    `;
  }
}