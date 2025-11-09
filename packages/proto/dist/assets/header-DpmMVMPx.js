import{i as c,O as p,e as g,x as o,b as u,r as h}from"./state-A8dMvlyH.js";var m=Object.defineProperty,d=(s,e,t,v)=>{for(var r=void 0,n=s.length-1,l;n>=0;n--)(l=s[n])&&(r=l(e,t,r)||r);return r&&m(e,t,r),r};const i=class i extends c{constructor(){super(...arguments),this._authObserver=new p(this,"splitroom:auth"),this.loggedIn=!1,this.onThemeChange=e=>{const t=e.target.checked;this.dispatchEvent(new CustomEvent("darkmode:toggle",{bubbles:!0,composed:!0,detail:{checked:t}}))}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{const{user:t}=e;t&&t.authenticated?(this.loggedIn=!0,this.userid=t.username):(this.loggedIn=!1,this.userid=void 0)})}renderSignOutButton(){return o`
      <button
        @click=${e=>{g.relay(e,"auth:message",["auth/signout"])}}
      >
        Sign Out
      </button>
    `}renderSignInButton(){return o`<a href="/login.html">Sign In…</a>`}render(){return o`
      <header class="app-header">
        <div class="brand">
            <a href="index.html" class="brand-link">
                SplitRoom
            </a>
        </div>

        <label id="theme-toggle" class="theme-toggle">
            <input id="theme-input" type="checkbox" autocomplete="off" @change=${this.onThemeChange} />
            Dark mode
        </label>

        <nav class="top-nav">
            <a href="group.html">Groups</a>
            <a href="receipt.html">Receipts</a>
            <a href="member.html"><span class="hello">Hello, ${this.userid??"roommate"}</span></a>
            ${this.loggedIn?this.renderSignOutButton():this.renderSignInButton()}
        </nav>
        </header>
    `}};i.styles=u`
    header.app-header {
        position: sticky;
        top: 0;
        display: flex;
        align-items: center;
        gap: var(--space-4);
        height: var(--header-h, 4rem);
        padding: var(--space-1) var(--space-3);
        background-color: var(--color-bg-page);
        color: var(--color-text);
        border-bottom: var(--border-1);
        min-width: 0;                    /* allow children to shrink */
    }

    .brand { display: flex; align-items: center; gap: .75rem; min-width: 0; }
    .brand-link { display: inline-flex; align-items: center; gap: .4ch; font-weight: 700; color: inherit; text-decoration: none; }
    svg.icon { width: 1.4rem; height: 1.4rem; }

    .theme-toggle { display: flex; align-items: center; gap: .4ch; font-size: .9em; opacity: .9; }

    nav.top-nav {
        margin-left: auto;               /* push to the right */
        display: flex;
        align-items: center;
        gap: var(--space-4);
        flex-wrap: nowrap;               /* keep on one line */
        min-width: 0;
        white-space: nowrap;             /* avoid wrapping inside items */
    }

    nav.top-nav a { color: inherit; text-decoration: none; font-weight: 500; }
    nav.top-nav a:hover { text-decoration: underline; }

    .hello { display: inline-block; max-width: 18ch; text-overflow: ellipsis; overflow: hidden; vertical-align: bottom; }

    .user button,
    button {
        padding: .4rem .7rem;
        border: var(--border-1);
        border-radius: var(--radius-1);
        background: transparent;
        cursor: pointer;
        white-space: nowrap;
    }
    .user button:hover,
    button:hover { background: color-mix(in srgb, var(--color-accent) 10%, transparent); }
    `;let a=i;d([h()],a.prototype,"loggedIn");d([h()],a.prototype,"userid");export{a as S};
