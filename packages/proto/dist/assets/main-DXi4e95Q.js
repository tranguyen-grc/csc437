import{n as u,d,S as f,i as k,a as p,x as l}from"./sr-ticket-CHmJi7ma.js";/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function m(i){return u({...i,state:!0,attribute:!1})}d({"sr-ticket":f});var y=Object.defineProperty,h=(i,t,e,a)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&y(t,e,s),s};const c=class c extends k{constructor(){super(...arguments),this.tickets=[]}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}async hydrate(t){try{const e=await fetch(t,{credentials:"same-origin"});if(!e.ok)throw new Error(`${e.status} ${e.statusText}`);const a=await e.json();this.tickets=Array.isArray(a)?a:[a]}catch(e){console.error("Failed to load tickets:",e),this.tickets=[]}}renderTicket(t){return l`
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
    `}render(){return l`${this.tickets.map(t=>this.renderTicket(t))}`}};c.styles=p`
    :host {
      display: contents;
    }
    ul, li {
        list-style: none;   /* 🚫 removes bullets */
        padding: 0;
        margin: 0;
    }
    li { margin: var(--space-2) 0; }
  `;let r=c;h([u()],r.prototype,"src");h([m()],r.prototype,"tickets");d({"sr-ticket-list":r});
