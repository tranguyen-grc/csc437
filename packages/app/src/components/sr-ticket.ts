import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
// ⬇️ note the .css.ts path (and probably ../styles)
import reset from "../styles/reset.css.ts";

export class SrTicketElement extends LitElement {
  @property() from = "";
  @property() to = "";
  @property() amount = "";
  @property() href = "";
  @property() status: "open" | "paid" | "" = "open";

  override render() {
    const isPaid = this.status === "paid";

    return html`
      <article class="ticket card ${isPaid ? "paid" : "open"}">
        <div class="line">
          <span class="names">${this.from} → ${this.to}</span>
          <a class="action" href=${this.href}>
            <slot>Details</slot>
          </a>
        </div>
        <div class="line">
          <span class="amount">$${Number(this.amount).toFixed(2)}</span>
          <span class="status">${isPaid ? "Paid" : "Open"}</span>
        </div>
      </article>
    `;
  }

  static styles = [
    reset.styles,
    css`
      :host {
        display: block;
      }

      .card {
        background-color: var(--color-card-bg);
        border: var(--border-1);
        border-radius: var(--radius-1);
        padding: var(--space-2) var(--space-3);
        color: var(--color-text);
      }

      .ticket.open {
        outline: 0;
      }

      .ticket.paid {
        opacity: 0.8;
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

      .action {
        color: var(--color-link);
        text-decoration: none;
      }

      .action:hover {
        text-decoration: underline;
      }
    `
  ];
}
