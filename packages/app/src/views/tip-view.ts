import { LitElement, css, html } from "lit";

export class TipViewElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      background-color: var(--color-bg-page);
      color: var(--color-text);
      font-family: var(--font-family-body);
    }
    h1 {
      color: var(--color-accent);
      font-family: var(--font-family-display);
      margin: var(--space-2) 0 var(--space-1);
      line-height: var(--line-height-tight);
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
        <p><a href="/app/receipt">Back to receipt</a></p>
      </div>
      <main class="page">
        <section class="card">
          <h1>Tip</h1>
          <p>Tip amount: $2.00</p>
        </section>
      </main>
    `;
  }
}
