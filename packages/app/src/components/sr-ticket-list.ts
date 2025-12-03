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
    const href = t.href ?? (t.id ? `/app/tickets/${t.id}` : "#");

    return html`
      <li>
        <sr-ticket
          .from=${t.from}
          .to=${t.to}
          .amount=${t.amount}
          .href=${href}
          .status=${t.status}
        >
          ${t.label ?? "Details"}
        </sr-ticket>
      </li>
    `;
  }

  override render() {
    const tickets = this.model?.tickets ?? [];
    const loading = this.model?.loading ?? false;
    const error = this.model?.error;

    if (loading) {
      return html`<p class="muted">Loading tickets…</p>`;
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
