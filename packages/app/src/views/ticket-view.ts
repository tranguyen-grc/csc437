import { Auth, Form, History, Observer, View, define } from "@calpoly/mustang";
import { html, css } from "lit";
import { property } from "lit/decorators.js";
import { Ticket } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class TicketViewElement extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element
  });

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

    mu-form {
      display: grid;
      gap: var(--space-2);
      max-width: 24rem;
      margin-top: var(--space-2);
    }

    .field {
      display: grid;
      gap: 0.25rem;
    }

    .field span {
      font-weight: 600;
      color: var(--color-muted, #6b7280);
    }

    .field input,
    .field select {
      padding: 0.5rem 0.6rem;
      border: var(--border-1);
      border-radius: var(--radius-1);
      background: var(--color-card-bg);
      color: var(--color-text);
      font: inherit;
    }

    .actions {
      display: flex;
      gap: var(--space-2);
      align-items: center;
    }

    button {
      padding: 0.6rem 1rem;
      border-radius: var(--radius-1);
      border: none;
      background: var(--color-accent);
      color: var(--color-bg-page);
      font-weight: 700;
      cursor: pointer;
    }

    button:hover {
      opacity: 0.95;
    }
  `;

  @property({ attribute: "ticket-id" }) ticketId?: string;

  private _auth = new Observer<Auth.Model>(this, "splitroom:auth");
  private _authenticated = false;

  constructor() {
    super("splitroom:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this._auth.observe((auth) => {
      this._authenticated = Boolean(auth.user?.authenticated);
      if (this._authenticated && this.ticketId) {
        this.dispatchMessage(["ticket/request", { ticketid: this.ticketId }]);
      }
    });
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      name === "ticket-id" &&
      newValue &&
      newValue !== oldValue &&
      this._authenticated
    ) {
      this.dispatchMessage(["ticket/request", { ticketid: newValue }]);
    }
  }

  render() {
    const { ticket, loading, error } = this.model ?? {};
    if (loading) {
      return html`<p class="card">Loading...</p>`;
    }
    if (error) return html`<p class="card">Failed to load: ${error}</p>`;
    const t = ticket;
    if (!t) return html`<p class="card">No ticket loaded.</p>`;

    return html`
      <main class="page">
        <div class="grid">
          <div class="title span-12">
            <p>
              <a href="/app/groups">
                <svg class="icon">
                  <use href="/icons/receipt.svg#icon-back" />
                </svg>
                Back to Group
              </a>
            </p>
          </div>

          <section class="card span-12">
            <h1>
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-trading" />
              </svg>
              Ticket
            </h1>
            <p>
              <strong
                >${t.from} -> ${t.to}: $${Number(t.amount ?? 0).toFixed(2)}</strong
              >
            </p>
          </section>

          <section class="card rule-top span-12">
            <h2>Details</h2>
            <ul>
              <li>
                <a href="/app/groups">
                  <svg class="icon">
                    <use href="/icons/receipt.svg#icon-receipt" />
                  </svg>
                  Receipt
                </a>
              </li>
            </ul>

            <h3>Status</h3>
            <p>${t.status === "paid" ? "Paid" : "Open"}</p>

            <h3>Action</h3>
            <mu-form
              .init=${{ status: t.status, label: t.label }}
              @mu-form:submit=${this.handleSubmit}
            >
              <label class="field">
                <span>Label</span>
                <input
                  type="text"
                  name="label"
                  placeholder="Add a short note"
                />
              </label>

              <label class="field">
                <span>Status</span>
                <select name="status">
                  <option value="open">Open</option>
                  <option value="paid">Paid</option>
                </select>
              </label>

              <div class="actions">
                <button type="submit">Save Ticket</button>
              </div>
            </mu-form>
          </section>
        </div>
      </main>
    `;
  }

  handleSubmit(event: Form.SubmitEvent<Partial<Ticket>>) {
    if (!this.ticketId) return;

    this.dispatchMessage([
      "ticket/save",
      {
        ticketid: this.ticketId,
        ticket: event.detail
      },
      {
        onSuccess: () =>
          History.dispatch(this, "history/navigate", { href: "/app/groups" }),
        onFailure: (error: Error) =>
          console.error("Failed to save ticket", error)
      }
    ]);
  }
}
