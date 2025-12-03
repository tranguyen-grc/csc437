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
  static styles = css``;

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
          <p><a href="group.html">
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
            <li><a href="receipt.html">
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
