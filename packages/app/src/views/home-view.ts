import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";

export class HomeViewElement extends LitElement {
  // @ts-ignore
  @property({ attribute: "user-id" })
  userId?: string;

  static styles = css`
    /* Base "body" defaults mapped to host */
    :host {
      display: block;
      background-color: var(--color-bg-page);
      color: var(--color-text);
      font-family: var(--font-family-body);
      font-weight: var(--weight-regular);
      font-size: var(--font-size-1);
      line-height: var(--line-height-body);
    }

    /* Base resets remain (won't affect outer document but kept for reference) */
    html,
    body {
      margin: 0;
      padding: 0;
    }

    /* Body defaults */
    body {
      background-color: var(--color-bg-page);
      color: var(--color-text);
      font-family: var(--font-family-body);
      font-weight: var(--weight-regular);
      font-size: var(--font-size-1);
      line-height: var(--line-height-body);
    }

    /* Headings use display font */
    h1,
    h2,
    h3 {
      color: var(--color-accent);
      font-family: var(--font-family-display);
      line-height: var(--line-height-tight);
      margin: var(--space-2) 0 var(--space-1);
    }

    h1 {
      font-size: var(--font-size-4);
      font-weight: var(--weight-bold);
    }
    h2 {
      font-size: var(--font-size-3);
      font-weight: var(--weight-bold);
    }
    h3 {
      font-size: var(--font-size-2);
      font-weight: var(--weight-bold);
    }

    /* Links */
    a {
      color: var(--color-link);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

    /* Cards */
    .card {
      background-color: var(--color-card-bg);
      border: var(--border-1);
      border-radius: var(--radius-1);
      padding: var(--space-2) var(--space-3);
    }

    .props {
      display: grid;
      grid-template-columns: max-content 1fr;
      column-gap: var(--space-4);
      row-gap: var(--space-2);
    }
    .props dt {
      font-weight: 600;
      color: var(--color-accent);
    }
    .props dd {
      margin: 0;
    }

    .title {
      padding: var(--space-2) var(--space-3);
      margin: var(--space-2) 0;
    }

    .rule-top {
      border-top: var(--border-thick);
      padding-top: var(--space-1);
    }

    .icon-text {
      display: flex;
      flex-direction: row;
      gap: 0.5ch;
      align-items: center;
    }

    svg.icon {
      display: inline;
      height: 1em;
      width: 1em;
      vertical-align: text-bottom;
      fill: currentColor;
    }

    /* --- Header layout (kept in case header is rendered inside) --- */
    .app-header {
      position: sticky;
      top: 0;
      display: grid;
      grid-template-columns: auto auto 1fr; /* brand | toggle | nav fills remaining */
      align-items: center;
      gap: var(--space-4);
      height: var(--header-h);
      padding: var(--space-1) var(--space-3);
      background: var(--header-bg);
      color: var(--header-text);
      background-color: var(--color-bg-page);
    }

    .app-header .brand-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5ch;
      font-weight: 700;
    }

    .theme-toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.4ch;
      font-size: 0.95em;
      opacity: 0.9;
      justify-self: start;
    }

    .top-nav {
      display: flex;
      gap: var(--space-4);
      justify-self: end;
    }

    .app-header a {
      color: inherit;
      text-decoration: none;
    }

    /* Page container */
    .page {
      max-width: var(--container-max);
      margin: 0 var(--space-2);
    }

    /* 12-col grid */
    .grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: var(--space-4);
    }

    .span-12 {
      grid-column: span 12;
    }
    .span-9 {
      grid-column: span 9;
    }
    .span-8 {
      grid-column: span 8;
    }
    .span-6 {
      grid-column: span 6;
    }
    .span-4 {
      grid-column: span 4;
    }
    .span-3 {
      grid-column: span 3;
    }

    form {
      display: grid;
      gap: var(--space-3);
    }

    /* Stack label text and control */
    label {
      display: grid;
      gap: var(--space-1);
      color: var(--color-text);
      font-size: var(--font-size-1);
    }

    /* Optional helper text inside labels */
    label small,
    .form-hint {
      color: var(--color-muted, #6b7280);
      font-size: 0.9em;
    }

    /* Text inputs, selects, textareas */
    input[type="text"],
    input[type="email"],
    input[type="password"],
    input[type="search"],
    input[type="number"],
    input[type="url"],
    select,
    textarea {
      appearance: none;
      width: 100%;
      padding: 0.6rem 0.75rem;
      border: var(--border-1);
      border-radius: var(--radius-1);
      background: var(--color-card-bg);
      color: var(--color-text);
      line-height: 1.25;
      outline: none;
    }

    /* Focus state using accent color */
    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="password"]:focus,
    input[type="search"]:focus,
    input[type="number"]:focus,
    input[type="url"]:focus,
    select:focus,
    textarea:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px
        color-mix(in srgb, var(--color-accent) 35%, transparent);
    }

    /* Invalid state (if you add .is-invalid to the control) */
    .is-invalid {
      border-color: var(--color-error, #b00020);
      box-shadow: 0 0 0 2px
        color-mix(in srgb, var(--color-error, #b00020) 30%, transparent);
    }

    /* Buttons */
    button,
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5ch;
      padding: 0.55rem 0.9rem;
      font-weight: var(--weight-bold);
      border-radius: var(--radius-1);
      border: 1px solid transparent;
      background: var(--color-accent);
      color: var(--color-text-on-accent, #fff);
      cursor: pointer;
      text-decoration: none;
    }

    button:hover,
    .button:hover {
      filter: brightness(1.03);
    }

    button:disabled,
    .button[aria-disabled="true"] {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Secondary / outline style if needed */
    .button--outline {
      background: transparent;
      border-color: var(--color-accent);
      color: var(--color-accent);
    }
    .button--outline:hover {
      background: color-mix(
        in srgb,
        var(--color-accent) 10%,
        transparent
      );
    }

    /* Actions row under forms */
    .form-actions {
      display: flex;
      gap: var(--space-2);
      justify-content: flex-start;
    }

    /* Error message block */
    .form-error,
    .error {
      color: var(--color-error, #b00020);
      border: 1px solid var(--color-error, #b00020);
      background: color-mix(
        in srgb,
        var(--color-error, #b00020) 12%,
        transparent
      );
      padding: var(--space-2);
      border-radius: var(--radius-1);
    }

    @media (max-width: 1200px) {
      .grid {
        grid-template-columns: repeat(8, 1fr);
      }
      .span-9 {
        grid-column: span 8;
      }
      .span-8 {
        grid-column: span 8;
      }
      .span-6 {
        grid-column: span 4;
      } /* halves on 8-col */
      .span-4 {
        grid-column: span 4;
      }
      .span-3 {
        grid-column: span 4;
      } /* 3 -> ~4 on 8-col */
    }

    @media (max-width: 720px) {
      .app-header {
        grid-template-columns: 1fr 1fr;
        row-gap: var(--space-2);
        height: auto;
        padding: var(--space-4);
      }
      .top-nav {
        justify-content: end;
      }

      .grid {
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-4);
      }
      .span-12,
      .span-9,
      .span-8,
      .span-6,
      .span-4,
      .span-3 {
        grid-column: span 4;
      }

      .page {
        padding: var(--space-4);
      }

      form {
        gap: var(--space-2);
      }
      label {
        gap: 0.35rem;
      }
    }

    .theme-toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.5ch;
      font-size: 0.95em;
      opacity: 0.9;
    }

    .theme-toggle input {
      inline-size: 1.1em;
      block-size: 1.1em;
    }
  `;

  render() {
    return html`
      <div class="title"></div>

      <main class="page">
        <div class="grid">
          <section class="card span-12">
            <h2 class="icon-text">
              <svg class="icon" aria-hidden="true" focusable="false">
                <use href="/icons/receipt.svg#icon-house"></use>
              </svg>
              <span>Roommate Groups</span>
            </h2>
            <p>
              <a href="/app/groups" class="icon-text">
                <svg class="icon" aria-hidden="true" focusable="false">
                  <use href="/icons/receipt.svg#icon-plus"></use>
                </svg>
                <span>Create or Access a Group</span>
              </a>
            </p>
          </section>

          <section class="card rule-top span-12">
            <h2>Your Dashboard</h2>

            <h3>Open Tickets</h3>
            <sr-ticket-list user-id=${this.userId ?? ""}></sr-ticket-list>
          </section>
        </div>
      </main>
    `;
  }
}

customElements.define("home-view", HomeViewElement);
