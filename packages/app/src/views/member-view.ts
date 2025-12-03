import { LitElement, css, html } from "lit";

export class MemberViewElement extends LitElement {
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
    ul {
      padding-left: var(--space-3);
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
                <use href="/icons/receipt.svg#icon-user" />
              </svg>
              Alex
            </h1>
            <p>Member profile for Alex.</p>
          </section>

          <section class="card rule-top span-12">
            <h2>Receipts</h2>
            <ul>
              <li><a href="/app/receipt">Taqueria El Sol</a></li>
            </ul>
          </section>
        </div>
      </main>
    `;
  }
}
