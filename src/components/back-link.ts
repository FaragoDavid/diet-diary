import icons from "../utils/icons.js";

export class BackLink implements BaseComponent {
  async render() {
    return `
      <a href="/dashboard" class="absolute top-2 left-2">
        <button type="submit" class="btn-sm">${icons.back}</button>
      </a>
    `;
  }
}