import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property } from "lit/decorators.js";
import { Credential } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class ProfileViewElement extends View<Model, Msg> {
  @property({ attribute: "user-id" })
  userid?: string;

  constructor() {
    super("splitroom:model");
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "user-id" && newValue && newValue !== oldValue) {
      this.dispatchMessage(["profile/request", { userid: newValue }]);
    }
  }

  render() {
    const { profile, loading, error } = this.model;

    if (loading) return html`<p class="muted">Loading profile…</p>`;
    if (error) return html`<p class="error">Failed to load: ${error}</p>`;
    if (!profile) return html`<p class="muted">No profile loaded.</p>`;

    return html`
      <section class="card">
        <h1>Traveler</h1>
        ${renderProfile(profile)}
      </section>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    .card {
      background: var(--color-card-bg);
      border: var(--border-1);
      border-radius: var(--radius-1);
      padding: var(--space-3);
      color: var(--color-text);
    }
    h1 {
      margin: 0 0 var(--space-2);
      font-family: var(--font-family-display);
      color: var(--color-accent);
      font-size: var(--font-size-3);
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
    .muted {
      color: var(--color-muted, #6b7280);
    }
    .error {
      color: var(--color-error, #b00020);
    }
  `;
}

function renderProfile(profile: Credential) {
  return html`
    <dl>
      <dt>User</dt>
      <dd>${profile.username}</dd>
      <dt>Password Hash</dt>
      <dd class="muted">${profile.hashedPassword}</dd>
    </dl>
  `;
}
