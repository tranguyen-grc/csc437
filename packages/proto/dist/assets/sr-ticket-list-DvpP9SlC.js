import{i as l,O as d,b as p,x as c,n as f,r as k}from"./state-A8dMvlyH.js";var y=Object.defineProperty,u=(n,t,s,r)=>{for(var e=void 0,a=n.length-1,h;a>=0;a--)(h=n[a])&&(e=h(t,s,e)||e);return e&&y(t,s,e),e};const o=class o extends l{constructor(){super(...arguments),this.tickets=[],this._authObserver=new d(this,"splitroom:auth")}get authorization(){return this._user?.authenticated&&{Authorization:`Bearer ${this._user.token}`}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this._user?.authenticated&&this.hydrate(this.src||"/api/tickets")})}updated(t){t.has("src")&&this._user?.authenticated&&this.hydrate(this.src||"/api/tickets")}async hydrate(t){try{const s={"Content-Type":"application/json",...this.authorization||{}};console.log("Auth header going out:",s.Authorization);const r=await fetch(t,{headers:s});if(!r.ok)throw new Error(`${r.status} ${r.statusText}`);const e=await r.json();this.tickets=Array.isArray(e)?e:[e]}catch(s){console.error("Failed to load tickets:",s),this.tickets=[]}}renderTicket(t){return c`
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
    `}render(){return c`${this.tickets.map(t=>this.renderTicket(t))}`}};o.styles=p`
    :host {
      display: contents;
    }
    ul, li {
        list-style: none; 
        padding: 0;
        margin: 0;
    }
    li { margin: var(--space-2) 0; }
  `;let i=o;u([f()],i.prototype,"src");u([k()],i.prototype,"tickets");export{i as S};
