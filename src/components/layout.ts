import { html } from 'lit-html';
import { render } from '@lit-labs/ssr';
import { SsrLitElement } from '../lib/ssr-lit-element.js';

const pathForPublicAsset = (fileName: string) => `http://localhost:3000/public/${fileName}`;

const layout = async (body: SsrLitElement) => {
  return render(html`<!DOCTYPE html>
    <html data-theme="emerald">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>JobHunter Elite</title>

        <link rel="manifest" href="${pathForPublicAsset('site.webmanifest')}" />

        <link rel="stylesheet" href="${pathForPublicAsset('output.css')}" />

        <script src="https://unpkg.com/htmx.org@1.9.5"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/theme-change@2.0.2/index.js"></script>
      </head>

      <body hx-boost="true">
          <div class="flex flex-col items-center justify-between min-h-screen p-12">${await body.render()}</div>
      </body>
    </html>`);
};

export { layout };
