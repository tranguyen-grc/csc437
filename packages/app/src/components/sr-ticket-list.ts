import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";

type Ticket = {
  from: string;
  to: string;
  amount: string;
  href: string;
  status: "open" | "paid" | string;
  label?: string;
};

export class SrTicketListElement extends LitElement {
  @property({ attribute: "user-id" })
  userId?: string;

  @state() private tickets: Ticket[] = [];

  _authObserver = new Observer<Auth.Model>(this, "splitroom:auth");
  _user?: Auth.User;

  // 🔐 build Authorization header from JWT in <mu-auth>
  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`
      }
    );
  }

  // 🧠 compute API URL from userId (adjust to match your API)
  get src() {
    // If you later add per-user filtering, change this:
    // `/api/tickets?user=${encodeURIComponent(this.userId!)}`
    return "/api/tickets";
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
  `;

  connectedCallback() {
    super.connectedCallback();

    this._authObserver.observe((auth) => {
      this._user = auth.user;

      // once auth arrives, fetch tickets for current userId (or all)
      if (this._user?.authenticated) {
        this.hydrate();
      }
    });
  }

  protected updated(changed: Map<string, unknown>) {
    // If user-id changes and we're authenticated, refetch
    if (changed.has("userId") && this._user?.authenticated) {
      this.hydrate();
    }
  }

  private async hydrate() {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(this.authorization || {})
      };

      console.log("Fetching tickets from", this.src);
      console.log("Auth header going out:", headers.Authorization);

      const res = await fetch(this.src, { headers });
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
    return html`<ul>${this.tickets.map((t) => this.renderTicket(t))}</ul>`;
  }
}
