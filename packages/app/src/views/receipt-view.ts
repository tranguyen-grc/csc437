import { History, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Ticket } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class ReceiptViewElement extends View<Model, Msg> {
  @state() merchant = "Taqueria El Sol";
  @state() payer = "Alex";
  @state() splitWith = "Sam, Jordan";
  @state() items = "8.95, 4.00";
  @state() tax = "1.16";
  @state() tip = "2.00";
  @state() error?: string;
  @state() preview?: { total: number; owed: number; to: string; from: string };

  constructor() {
    super("splitroom:model");
  }

  static styles = css`
    :host {
      display: block;
      background-color: var(--color-bg-page);
      color: var(--color-text);
      font-family: var(--font-family-body);
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
    .page {
      max-width: var(--container-max);
      margin: 0 var(--space-2);
    }
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
    form {
      display: grid;
      gap: var(--space-3);
    }
    label {
      display: grid;
      gap: 0.35rem;
    }
    input,
    textarea {
      padding: 0.5rem 0.6rem;
      border: var(--border-1);
      border-radius: var(--radius-1);
      background: var(--color-card-bg);
      color: var(--color-text);
      font: inherit;
    }
    textarea {
      min-height: 5rem;
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
    .error {
      color: var(--color-error, #b00020);
      border: 1px solid var(--color-error, #b00020);
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-1);
      background: color-mix(in srgb, var(--color-error, #b00020) 12%, transparent);
    }
    .preview {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .back-link {
      margin-bottom: var(--space-3);
      display: inline-block;
    }
  `;

  render() {
    return html`
      <div class="title">
        <p class="back-link">
          <a href="/app/groups">
            <svg class="icon">
              <use href="/icons/receipt.svg#icon-back" />
            </svg>
            Back to Group
          </a>
        </p>
      </div>

      <main class="page">
        <section class="card">
          <h1>
            <svg class="icon">
              <use href="/icons/receipt.svg#icon-receipt" />
            </svg>
            Add Receipt
          </h1>

          <form @submit=${this.handleSubmit}>
            <label>
              <span>Merchant</span>
              <input
                name="merchant"
                .value=${this.merchant}
                @input=${(e: Event) => (this.merchant = (e.target as HTMLInputElement).value)}
                required
              />
            </label>

            <label>
              <span>Payer</span>
              <input
                name="payer"
                .value=${this.payer}
                @input=${(e: Event) => (this.payer = (e.target as HTMLInputElement).value)}
                required
              />
            </label>

            <label>
              <span>Split with (comma-separated)</span>
              <input
                name="splitWith"
                .value=${this.splitWith}
                @input=${(e: Event) => (this.splitWith = (e.target as HTMLInputElement).value)}
                required
              />
            </label>

            <label>
              <span>Item prices (comma-separated)</span>
              <input
                name="items"
                .value=${this.items}
                @input=${(e: Event) => (this.items = (e.target as HTMLInputElement).value)}
                required
              />
            </label>

            <label>
              <span>Tax</span>
              <input
                name="tax"
                type="number"
                step="0.01"
                .value=${this.tax}
                @input=${(e: Event) => (this.tax = (e.target as HTMLInputElement).value)}
              />
            </label>

            <label>
              <span>Tip</span>
              <input
                name="tip"
                type="number"
                step="0.01"
                .value=${this.tip}
                @input=${(e: Event) => (this.tip = (e.target as HTMLInputElement).value)}
              />
            </label>

            <button type="submit">Create Ticket</button>

            ${this.error ? html`<p class="error">${this.error}</p>` : null}

            ${this.preview
              ? html`<div class="preview card rule-top">
                  <h3>Preview</h3>
                  <p>
                    ${this.preview.from} owe ${this.preview.to}
                    $${this.preview.owed.toFixed(2)} (total $${this.preview.total.toFixed(2)})
                  </p>
                </div>`
              : null}
          </form>
        </section>
      </main>
    `;
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const itemPrices = this.parseNumbers(this.items);
    const tax = Number(this.tax) || 0;
    const tip = Number(this.tip) || 0;

    if (!itemPrices.length) {
      this.error = "Please enter at least one item price.";
      return;
    }

    const totalItems = itemPrices.reduce((sum, val) => sum + val, 0);
    const total = totalItems + tax + tip;
    const splitNames = this.parseNames(this.splitWith);
    const payer = this.payer.trim();
    const participants = payer ? [payer, ...splitNames] : splitNames;

    if (!participants.length || !payer) {
      this.error = "Enter a payer and at least one other person to split with.";
      return;
    }

    const share = total / participants.length;
    const owed = total - share; // everyone except payer owes back their share
    const from = splitNames.join(", ");
    const to = payer;

    this.preview = { total, owed, to, from };
    this.error = undefined;

    const ticket: Partial<Ticket> = {
      from,
      to,
      amount: owed.toFixed(2),
      status: "open",
      label: this.merchant || "Receipt"
    };

    this.dispatchMessage([
      "ticket/create",
      { ticket },
      {
        onSuccess: () => {
          this.dispatchMessage(["tickets/load", {}]);
          History.dispatch(this, "history/navigate", { href: "/app/groups" });
        },
        onFailure: (err: Error) => {
          this.error = String(err);
        }
      }
    ]);
  }

  private parseNumbers(list: string): number[] {
    return list
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n) && Number.isFinite(n));
  }

  private parseNames(list: string): string[] {
    return list
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
}
