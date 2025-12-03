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
  @property() src?: string;
  @state() private tickets: Ticket[] = [];

  _authObserver = new Observer<Auth.Model>(this, "splitroom:auth");
  _user?: Auth.User;

  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`
      }
    );
  }

  static styles = css`
    :host {
      display: contents;
    }
    ul, li {
        list-style: none; 
        padding: 0;
        margin: 0;
    }
    li { margin: var(--space-2) 0; }
  `;

  connectedCallback() {
    super.connectedCallback();
    // React when auth state arrives/changes
    this._authObserver.observe((auth) => {
      this._user = auth.user;
      if (this._user?.authenticated) {
        this.hydrate(this.src || "/api/tickets");
      }
    });
  }

  protected updated(changed: Map<string, unknown>) {
    // If src changes and we're authenticated, refetch
    if (changed.has("src") && this._user?.authenticated) {
      this.hydrate(this.src || "/api/tickets");
    }
  }

  private async hydrate(url: string) {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(this.authorization || {})
      };
      console.log("Auth header going out:", headers.Authorization);

      const res = await fetch(url, { headers });
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
