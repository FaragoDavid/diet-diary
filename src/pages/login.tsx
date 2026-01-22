import icons from '../utils/icons';
import config from '../config';

export class Login {
  async render() {
    const hasGoogleOAuth = config.oauth.google.clientId && config.oauth.google.clientSecret;

    if (!hasGoogleOAuth) {
      return `
        <div id="login-page" class="flex flex-col justify-center overflow-hidden h-screen space-y-6">
          <h1 class="text-3xl font-semibold text-center text-primary">${config.texts.titles.page}</h1>
          <div class="flex flex-col items-center space-y-4">
            <div class="alert alert-warning max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.</span>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div id="login-page" class="flex flex-col justify-center overflow-hidden h-screen space-y-6">
        <h1 class="text-3xl font-semibold text-center text-primary">${config.texts.titles.page}</h1>
        <div class="flex flex-col justify-center items-center space-y-4">
          <a href="/auth/google" class="btn btn-primary">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </a>
        </div>
      </div>
    `;
  }
}
