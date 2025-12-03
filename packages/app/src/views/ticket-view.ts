import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";


type Ticket = {
  id: string;
  from: string;
  to: string;
  amount: number;
  status: "open" | "paid";
  href?: string;
  label?: string;
};

export class TicketViewElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      background-color: var(--color-bg-page);
      color: var(--color-text);
      font-family: var(--font-family-body);
      font-weight: var(--weight-regular);
      font-size: var(--font-size-1);
      line-height: var(--line-height-body);
    }

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

    a {
      color: var(--color-link);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

    .card {
      background-color: var(--color-card-bg);
      border: var(--border-1);
      border-radius: var(--radius-1);
      padding: var(--space-2) var(--space-3);
    }

    .title {
      padding: var(--space-2) var(--space-3);
      margin: var(--space-2) 0;
    }

    .rule-top {
      border-top: var(--border-thick);
      padding-top: var(--space-1);
    }

    svg.icon {
      display: inline;
      height: 1em;
      width: 1em;
      vertical-align: text-bottom;
      fill: currentColor;
    }

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

    @media (max-width: 1200px) {
      .grid {
        grid-template-columns: repeat(8, 1fr);
      }
      .span-12 {
        grid-column: span 8;
      }
    }

    @media (max-width: 720px) {
      .grid {
        grid-template-columns: repeat(4, 1fr);
      }
      .span-12 {
        grid-column: span 4;
      }
      .page {
        padding: var(--space-4);
      }
    }
  `;

  @property({ attribute: "ticket-id" }) ticketId?: string;
  @state() ticket?: Ticket;

  private _auth = new Observer<Auth.Model>(this, "splitroom:auth");
  private _user?: Auth.User;

  connectedCallback() {
    super.connectedCallback();
    this._auth.observe((auth) => {
      this._user = auth.user;
      if (this.ticketId) this.load(this.ticketId);
    });
  }

  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`
      }
    );
  }

  async load(id: string) {
    const res = await fetch(`/api/tickets/${id}`, {
      headers: this.authorization || {}
    });
    this.ticket = res.ok ? await res.json() : undefined;
  }

  render() {
    const t = this.ticket;
    if (!t) return html`<p class="card">Loading…</p>`;
    return html`
      <main class="page">
      <div class="grid">
  
        <div class="title span-12">
          <p><a href="/app/groups">
            <svg class="icon">
              <use href="/icons/receipt.svg#icon-back" />
            </svg>
            Back to Group
          </a></p>
        </div>
      
        <section class="card span-12">
          <h1>
            <svg class="icon">
              <use href="/icons/receipt.svg#icon-trading" />
            </svg>
            Ticket
          </h1>
          <p><strong>Sam → Alex: $12.40</strong></p>
        </section>
      
        <section class="card rule-top span-12">
          <h2>Details</h2>
          <ul>
            <li><a href="/app/groups">
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-receipt" />
              </svg>
              Receipt
            </a></li>
          </ul>
      
          <h3>Status</h3>
          <p>Open</p>
      
          <h3>Action</h3>
        </section>
      </div>
      
    </main>
    `;
  }
}
