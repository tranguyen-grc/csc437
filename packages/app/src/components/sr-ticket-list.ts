import { Auth, Observer, css, html, View } from "@calpoly/mustang";
import { property } from "lit/decorators.js";
import { Model } from "../store";
import { Msg } from "../messages";

export class SrTicketListElement extends View<Model, Msg> {
  @property({ attribute: "user-id" })
  userId?: string;

  private _auth = new Observer<Auth.Model>(this, "splitroom:auth");

  constructor() {
    super("splitroom:model");
  }

  static styles = css`
    :host {
      display: contents;
    }
    ul,
    li {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      margin: var(--space-2) 0;
    }
    .muted {
      color: var(--color-muted, #6b7280);
    }
    .error {
      color: var(--color-error, #b00020);
    }
    .ticket-card {
      background: var(--color-card-bg);
      border: var(--border-1);
      border-radius: var(--radius-1);
      padding: var(--space-2) var(--space-3);
      color: var(--color-text);
    }
    .line {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--space-4);
      margin-block: 0.25rem;
    }
    .names {
      font-weight: 600;
      color: var(--color-text);
    }
    .amount {
      font-family: var(--font-family-mono);
      font-weight: 700;
      color: var(--color-accent);
    }
    .status {
      font-size: 0.9em;
      opacity: 0.8;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._auth.observe((auth) => {
      if (auth.user?.authenticated) {
        this.dispatchMessage(["tickets/load", { userId: this.userId }]);
      }
    });
  }

  private renderTicket(t: Model["tickets"][number]) {
    const ticketId = t.id ?? (t as any)._id?.toString?.() ?? "";
    const amountNum = Number(t.amount ?? 0);
    const displayAmount = Number.isFinite(amountNum) ? amountNum : 0;

    return html`
      <li>
        <article class="ticket-card">
          <div class="line">
            <span class="names">${t.from} -> ${t.to}</span>
            <span class="status">${t.status === "paid" ? "Paid" : "Open"}</span>
          </div>
          <div class="line">
            <span class="amount">$${displayAmount.toFixed(2)}</span>
            <span>${t.label ?? "Ticket"}</span>
          </div>
        </article>
      </li>
    `;
  }

  override render() {
    const tickets = this.model?.tickets ?? [];
    const loading = this.model?.loading ?? false;
    const error = this.model?.error;

    if (loading) {
      return html`<p class="muted">Loading tickets...</p>`;
    }

    if (error) {
      return html`<p class="error">Failed to load tickets: ${error}</p>`;
    }

    if (!tickets.length) {
      return html`<p class="muted">No tickets yet.</p>`;
    }

    return html`<ul>${tickets.map((t) => this.renderTicket(t))}</ul>`;
  }
}

