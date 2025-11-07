import{n as u,i as h,a as p,x as l}from"./sr-ticket-CErIJbA5.js";/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function f(e){return u({...e,state:!0,attribute:!1})}var k=Object.defineProperty,d=(e,t,r,a)=>{for(var s=void 0,n=e.length-1,c;n>=0;n--)(c=e[n])&&(s=c(t,r,s)||s);return s&&k(t,r,s),s};const o=class o extends h{constructor(){super(...arguments),this.tickets=[]}connectedCallback(){super.connectedCallback();const t=this.src||"/api/tickets";this.hydrate(t)}async hydrate(t){try{const r=await fetch(t,{credentials:"same-origin"});if(!r.ok)throw new Error(`${r.status} ${r.statusText}`);const a=await r.json();this.tickets=Array.isArray(a)?a:[a]}catch(r){console.error("Failed to load tickets:",r),this.tickets=[]}}renderTicket(t){return l`
      <li>
        <sr-ticket
          .from=${t.from}
          .to=${t.to}
          .amount=${t.amount}
          .href=${t.href}
          .status=${t.status}
        >
          ${t.label??"Details"}
        </sr-ticket>
      </li>
    `}render(){return l`${this.tickets.map(t=>this.renderTicket(t))}`}};o.styles=p`
    :host {
      display: contents;
    }
    ul, li {
        list-style: none; 
        padding: 0;
        margin: 0;
    }
    li { margin: var(--space-2) 0; }
  `;let i=o;d([u()],i.prototype,"src");d([f()],i.prototype,"tickets");export{i as S};
