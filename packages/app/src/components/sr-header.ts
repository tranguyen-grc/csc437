import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer, Events } from "@calpoly/mustang";

export class SrHeaderElement extends LitElement {
  _authObserver = new Observer<Auth.Model>(this, "splitroom:auth");
  @state() loggedIn = false;
  @state() userid?: string;

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: Auth.Model) => {
      const { user } = auth;
      if (user && user.authenticated) {
        this.loggedIn = true;
        this.userid = user.username;
      } else {
        this.loggedIn = false;
        this.userid = undefined;
      }
    });
  }

  // Relay a custom event when the theme checkbox changes
  private onThemeChange = (e: Event) => {
    const checked = (e.target as HTMLInputElement).checked;
    this.dispatchEvent(
      new CustomEvent("darkmode:toggle", {
        bubbles: true,
        composed: true,
        detail: { checked }
      })
    );
  };

  private renderSignOutButton() {
    return html`
      <button
        @click=${(e: UIEvent) => {
          Events.relay(e, "auth:message", ["auth/signout"]);
        }}
      >
        Sign Out
      </button>
    `;
  }

  private renderSignInButton() {
    return html`<a href="/login.html">Sign In…</a>`;
  }

  override render() {
    return html`
      <header class="app-header">
        <div class="brand">
            <a href="index.html" class="brand-link">
                SplitRoom
            </a>
        </div>

        <label id="theme-toggle" class="theme-toggle">
            <input id="theme-input" type="checkbox" autocomplete="off" @change=${this.onThemeChange} />
            Dark mode
        </label>

        <nav class="top-nav">
            <a href="group.html">Groups</a>
            <a href="receipt.html">Receipts</a>
            <a href="member.html"><span class="hello">Hello, ${this.userid ?? "roommate"}</span></a>
            ${this.loggedIn ? this.renderSignOutButton() : this.renderSignInButton()}
        </nav>
        </header>
    `;
  }

  static styles = css`
    header.app-header {
        position: sticky;
        top: 0;
        display: flex;
        align-items: center;
        gap: var(--space-4);
        height: var(--header-h, 4rem);
        padding: var(--space-1) var(--space-3);
        background-color: var(--color-bg-page);
        color: var(--color-text);
        border-bottom: var(--border-1);
        min-width: 0;                    /* allow children to shrink */
    }

    .brand { display: flex; align-items: center; gap: .75rem; min-width: 0; }
    .brand-link { display: inline-flex; align-items: center; gap: .4ch; font-weight: 700; color: inherit; text-decoration: none; }
    svg.icon { width: 1.4rem; height: 1.4rem; }

    .theme-toggle { display: flex; align-items: center; gap: .4ch; font-size: .9em; opacity: .9; }

    nav.top-nav {
        margin-left: auto;               /* push to the right */
        display: flex;
        align-items: center;
        gap: var(--space-4);
        flex-wrap: nowrap;               /* keep on one line */
        min-width: 0;
        white-space: nowrap;             /* avoid wrapping inside items */
    }

    nav.top-nav a { color: inherit; text-decoration: none; font-weight: 500; }
    nav.top-nav a:hover { text-decoration: underline; }

    .hello { display: inline-block; max-width: 18ch; text-overflow: ellipsis; overflow: hidden; vertical-align: bottom; }

    .user button,
    button {
        padding: .4rem .7rem;
        border: var(--border-1);
        border-radius: var(--radius-1);
        background: transparent;
        cursor: pointer;
        white-space: nowrap;
    }
    .user button:hover,
    button:hover { background: color-mix(in srgb, var(--color-accent) 10%, transparent); }
    `;


}