import{i as l,x as h,b as m,r as u,n as c,d as b,a as f}from"./state-A8dMvlyH.js";var g=Object.defineProperty,i=(d,t,r,s)=>{for(var e=void 0,o=d.length-1,p;o>=0;o--)(p=d[o])&&(e=p(t,r,e)||e);return e&&g(t,r,e),e};const n=class n extends l{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return h`
      <form
        @change=${t=>this.handleChange(t)}
        @submit=${t=>this.handleSubmit(t)}
      >
        <slot></slot>

        <slot name="button">
          <button type="submit" ?disabled=${!this.canSubmit}>Login</button>
        </slot>

        <p class="error">${this.error??""}</p>
      </form>
    `}handleChange(t){const r=t.target;if(!r)return;const{name:s,value:e}=r,o=this.formData;s==="username"&&(this.formData={...o,username:e}),s==="password"&&(this.formData={...o,password:e})}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(r=>{if(r.status!==200)throw new Error("Login failed");return r.json()}).then(r=>{const s=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:r.token,redirect:this.redirect}]});this.dispatchEvent(s)}).catch(r=>{this.error=String(r)})}};n.styles=m`
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
  `;let a=n;i([u()],a.prototype,"formData");i([c()],a.prototype,"api");i([c()],a.prototype,"redirect");i([u()],a.prototype,"error");b({"mu-auth":f.Provider,"login-form":a});
