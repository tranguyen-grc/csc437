import{b as p,i as d,x as u,n as s}from"./state-A8dMvlyH.js";const f=p`
  * {
  margin: 0;
  box-sizing: border-box;
}
body {
  line-height: 1.5;
}
img {
  max-width: 100%;
}

ul, ol { padding-left: 1.25rem; }
`,h={styles:f};var m=Object.defineProperty,e=(n,a,c,v)=>{for(var o=void 0,r=n.length-1,l;r>=0;r--)(l=n[r])&&(o=l(a,c,o)||o);return o&&m(a,c,o),o};const i=class i extends d{constructor(){super(...arguments),this.from="",this.to="",this.amount="",this.href="",this.status="open"}render(){const a=this.status==="paid";return u`
      <article class="ticket card ${a?"paid":"open"}">
        <div class="line">
          <span class="names">${this.from} → ${this.to}</span>
          <a class="action" href=${this.href}>
            <slot>Details</slot>
          </a>
        </div>
        <div class="line">
          <span class="amount">$${Number(this.amount).toFixed(2)}</span>
          <span class="status">${a?"Paid":"Open"}</span>
        </div>
      </article>
    `}};i.styles=[h.styles,p`
    :host { display: block; }
    .card {
        background-color: var(--color-card-bg);
        border: var(--border-1);
        border-radius: var(--radius-1);
        padding: var(--space-2) var(--space-3);
        color: var(--color-text);
    }
    .ticket.open { outline: 0; }
    .ticket.paid  { opacity: .8; }
    .line {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--space-4);
        margin-block: .25rem;
    }
    .names {
        font-weight: 600;
        color: var(--color-text);
    }
    .amount {
        font-family: var(--font-family-mono);
        font-weight: 700;
        color: var(--color-accent);
    }
    .status {
        font-size: .9em;
        opacity: .8;
    }
    .action {
        color: var(--color-link);
        text-decoration: none;
    }
    .action:hover { text-decoration: underline; }
    `];let t=i;e([s()],t.prototype,"from");e([s()],t.prototype,"to");e([s()],t.prototype,"amount");e([s()],t.prototype,"href");e([s()],t.prototype,"status");export{t as S};
