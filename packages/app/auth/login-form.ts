// packages/app/src/auth/login-form.ts
import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface LoginFormData {
  username?: string;
  password?: string;
}

export class LoginFormElement extends LitElement {
  // @ts-ignore
  @state() formData: LoginFormData = {};
  // @ts-ignore
  @property() api?: string;          // e.g. "/auth/login"
  // @ts-ignore
  @property() redirect: string = "/"; // where to go after success
  // @ts-ignore
  @state() error?: string;

  get canSubmit(): boolean {
    return Boolean(this.api && this.formData.username && this.formData.password);
  }

  override render() {
    return html`
      <form
        @change=${(e: InputEvent) => this.handleChange(e)}
        @submit=${(e: SubmitEvent) => this.handleSubmit(e)}
      >
        <slot></slot>

        <slot name="button">
          <button type="submit" ?disabled=${!this.canSubmit}>Login</button>
        </slot>

        <p class="error">${this.error ?? ""}</p>
      </form>
    `;
  }

  static styles = css`
    :host { display:block; }
    form { display:grid; gap: 0.75rem; }
    label { display:grid; gap: 0.25rem; }
    input {
      padding: 0.5rem 0.6rem;
      border: var(--border-1, 1px solid #ccc);
      border-radius: var(--radius-1, 8px);
      background: var(--color-card-bg, #fff);
      color: var(--color-text, #111);
    }
    button {
      padding: 0.6rem 0.9rem;
      border-radius: var(--radius-1, 8px);
      border: var(--border-1, 1px solid transparent);
      cursor: pointer;
    }
    button[disabled] { opacity: .5; cursor: not-allowed; }
    .error:not(:empty) {
      color: var(--color-error, #b00020);
      border: 1px solid var(--color-error, #b00020);
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-1, 8px);
      background: color-mix(in srgb, var(--color-error, #b00020) 12%, transparent);
    }
  `;

  handleChange(event: InputEvent) {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;
    const { name, value } = target;
    const prev = this.formData;

    if (name === "username") this.formData = { ...prev, username: value };
    if (name === "password") this.formData = { ...prev, password: value };
  }

  handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!this.canSubmit) return;

    fetch(this.api!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.formData)
    })
      .then((res) => {
        if (res.status !== 200) throw new Error("Login failed");
        return res.json();
      })
      .then((json: { token: string }) => {
        const evt = new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token: json.token, redirect: this.redirect }]
        });
        this.dispatchEvent(evt);
      })
      .catch((err: unknown) => {
        this.error = String(err);
      });
  }
}
