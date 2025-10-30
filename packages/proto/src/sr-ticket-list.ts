import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

type Ticket = {
  from: string;
  to: string;
  amount: string;  
  href: string;
  status: "open" | "paid" | string;
  label?: string;   
};

export class SrTicketListElement extends LitElement {
  @property() src?: string;

  @state() private tickets: Ticket[] = [];

  static styles = css`
    :host {
      display: contents;
    }
    ul, li {
        list-style: none;   /* 🚫 removes bullets */
        padding: 0;
        margin: 0;
    }
    li { margin: var(--space-2) 0; }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }

  private async hydrate(url: string) {
    try {
      const res = await fetch(url, { credentials: "same-origin" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = (await res.json()) as Ticket[] | Ticket;
      this.tickets = Array.isArray(json) ? json : [json];
    } catch (err) {
      console.error("Failed to load tickets:", err);
      this.tickets = [];
    }
  }

  private renderTicket(t: Ticket) {
    return html`
      <li>
        <sr-ticket
          .from=${t.from}
          .to=${t.to}
          .amount=${t.amount}
          .href=${t.href}
          .status=${t.status}
        >
          ${t.label ?? "Details"}
        </sr-ticket>
      </li>
    `;
  }

  override render() {
    return html`${this.tickets.map((t) => this.renderTicket(t))}`;
  }
}
