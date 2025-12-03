import { LitElement, html, css } from "lit";

export class LoginViewElement extends LitElement {
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
    h2 {
      color: var(--color-accent);
      font-family: var(--font-family-display);
      margin: var(--space-2) 0 var(--space-1);
      line-height: var(--line-height-tight);
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

    .span-6 {
      grid-column: span 6;
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

    form {
      display: grid;
      gap: var(--space-3);
    }

    label {
      display: grid;
      gap: var(--space-1);
      color: var(--color-text);
    }

    input {
      padding: 0.6rem 0.75rem;
      border: var(--border-1);
      border-radius: var(--radius-1);
      background: var(--color-card-bg);
      color: var(--color-text);
    }

    a {
      color: var(--color-link);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

    @media (max-width: 1200px) {
      .grid {
        grid-template-columns: repeat(8, 1fr);
      }
      .span-6,
      .span-12 {
        grid-column: span 8;
      }
    }

    @media (max-width: 720px) {
      .grid {
        grid-template-columns: repeat(4, 1fr);
      }
      .span-6,
      .span-12 {
        grid-column: span 4;
      }
      .page {
        padding: var(--space-4);
      }
    }
  `;

  render() {
    return html`
      <main class="page">
        <div class="grid">
          <section class="card span-6">
            <h2>User Login</h2>
            <login-form api="/auth/login" redirect="/app">
              <label>
                <span>Username</span>
                <input type="text" name="username" autocomplete="off" />
              </label>
              <label>
                <span>Password</span>
                <input type="password" name="password" />
              </label>
            </login-form>
          </section>
          <section class="card span-6">
            <p>New roommate?</p>
            <p><a href="/newuser.html">Sign up as a new user</a></p>
          </section>
        </div>
      </main>
    `;
  }
}
