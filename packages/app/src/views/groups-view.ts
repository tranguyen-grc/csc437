import { LitElement, html, css } from "lit";
import { Auth, Observer } from "@calpoly/mustang";
import { property } from "lit/decorators.js";

export class GroupsViewElement extends LitElement {
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

    .rule-top {
      border-top: var(--border-thick);
      padding-top: var(--space-1);
    }

    svg.icon {
      display: inline;
      height: 1em;
      width: 1em;
      fill: currentColor;
      vertical-align: text-bottom;
    }

    /* Page + Grid */
    .page {
      max-width: var(--container-max);
      margin: 0 var(--space-2);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: var(--space-4);
    }

    .span-12 {
      grid-column: span 12;
    }
    .span-6 {
      grid-column: span 6;
    }

    @media (max-width: 1200px) {
      .grid {
        grid-template-columns: repeat(8, 1fr);
      }
      .span-6 {
        grid-column: span 4;
      }
    }

    @media (max-width: 720px) {
      .grid {
        grid-template-columns: repeat(4, 1fr);
      }
      .span-12,
      .span-6 {
        grid-column: span 4;
      }
      .page {
        padding: var(--space-4);
      }
    }
  `;

  private _auth = new Observer<Auth.Model>(this, "splitroom:auth");
  private _user?: Auth.User;

  connectedCallback() {
    super.connectedCallback();
    this._auth.observe((auth) => (this._user = auth.user));
  }

  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`
      }
    );
  }

  render() {
    return html`
      <main class="page">
        <div class="grid">

          <section class="card span-12">
            <h1>
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-house" />
              </svg>
              House 1
            </h1>

            <h2>Members</h2>
            <ul>
              <li><a href="/app/groups">Alex</a></li>
              <li><a href="/app/groups">Sam</a></li>
              <li><a href="/app/groups">Jordan</a></li>
            </ul>
          </section>

          <section class="card rule-top span-6">
            <h2>
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-receipt" />
              </svg>
              Receipts
            </h2>
            <p>
              <a href="/app/groups">
                <svg class="icon">
                  <use href="/icons/receipt.svg#icon-plus" />
                </svg>
                Add a receipt
              </a>
            </p>
            <ul>
              <li><a href="/app/groups">Receipt — Taqueria El Sol</a></li>
            </ul>
          </section>

          <section class="card rule-top span-6">
            <h2>
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-trading" />
              </svg>
              Open Tickets
            </h2>

            <sr-ticket-list user-id=${this.userId ?? ""}></sr-ticket-list>
          </section>

        </div>
      </main>
    `;
  }
}

customElements.define("groups-view", GroupsViewElement);
