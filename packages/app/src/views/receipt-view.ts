import { LitElement, css, html } from "lit";

export class ReceiptViewElement extends LitElement {
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
    h2 {
      color: var(--color-accent);
      font-family: var(--font-family-display);
      line-height: var(--line-height-tight);
      margin: var(--space-2) 0 var(--space-1);
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
    .span-4 {
      grid-column: span 4;
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
    dl {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: var(--space-1) var(--space-3);
      margin: 0;
    }
    dt {
      font-weight: 600;
      color: var(--color-muted, #6b7280);
    }
    dd {
      margin: 0;
    }
    a {
      color: var(--color-link);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `;

  render() {
    return html`
      <div class="title">
        <p>
          <a href="/app/groups">
            <svg class="icon">
              <use href="/icons/receipt.svg#icon-back" />
            </svg>
            Back to Group
          </a>
        </p>
      </div>

      <main class="page">
        <div class="grid">
          <section class="card span-12">
            <h1>
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-receipt" />
              </svg>
              Receipt
            </h1>
            <dl>
              <dt>Merchant</dt>
              <dd>Taqueria El Sol</dd>
              <dt>Date</dt>
              <dd>2025-09-20</dd>
              <dt>Payer</dt>
              <dd><a href="/app/member">Alex</a></dd>
            </dl>
          </section>

          <section class="card rule-top span-4">
            <h2>
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-item" />
              </svg>
              Items
            </h2>
            <ul>
              <li><a href="/app/item">Chicken Burrito</a> — <a href="/app/price">$8.95</a> — Shared by Alex, Sam</li>
              <li><a href="/app/item">Chips &amp; Salsa</a> — <a href="/app/price">$4.00</a> — Shared by Alex</li>
            </ul>
          </section>

          <section class="card rule-top span-4">
            <h2>
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-dollar" />
              </svg>
              Charges
            </h2>
            <dl>
              <dt>Tax</dt>
              <dd><a href="/app/tax">$1.16</a></dd>
              <dt>Tip</dt>
              <dd><a href="/app/tip">$2.00</a></dd>
              <dt>Discount</dt>
              <dd><a href="/app/discount">$0.00</a></dd>
              <dt>Total</dt>
              <dd><a href="/app/total">$16.11</a></dd>
            </dl>
          </section>

          <section class="card rule-top span-4">
            <sr-ticket
              from="Sam"
              to="Alex"
              amount="12.40"
              href="/app/tickets/preview"
              status="open"
            >
              View / Mark Paid
            </sr-ticket>
          </section>
        </div>
      </main>
    `;
  }
}
