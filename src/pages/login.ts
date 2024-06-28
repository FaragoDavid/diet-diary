import icons from '../utils/icons';
import config from '../config';

export class Login implements BaseComponent {
  async render() {
    return `
      <div id="login-page" class="flex flex-col justify-center overflow-hidden h-screen space-y-6">
        <h1 class="text-3xl font-semibold text-center text-primary">${config.texts.titles.page}</h1>
        <form class="flex flex-col justify-center items-center space-y-4">
          <label class="input input-bordered flex items-center gap-2">
            ${icons.password}
            <input type="password" name="password" class="grow placeholder:text-neutral" placeholder="Jelszó" />
          </label>
          <div>
            <button 
              class="btn btn-primary"
              hx-post="/login"
              hx-push-url="/dashboard"
              hx-target="#login-page"
              hx-swap="outerHTML"
            >${config.pages.login.login}</button>
          </div>
        </form>
      </div>
    `;
  }
}
