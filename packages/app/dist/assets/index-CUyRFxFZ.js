(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();var W,Ke;class at extends Error{}at.prototype.name="InvalidTokenError";function us(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let r=e.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}function fs(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return us(t)}catch{return atob(t)}}function xr(i,t){if(typeof i!="string")throw new at("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,r=i.split(".")[e];if(typeof r!="string")throw new at(`Invalid token specified: missing part #${e+1}`);let s;try{s=fs(r)}catch(o){throw new at(`Invalid token specified: invalid base64 for part #${e+1} (${o.message})`)}try{return JSON.parse(s)}catch(o){throw new at(`Invalid token specified: invalid json for part #${e+1} (${o.message})`)}}const gs="mu:context",Xt=`${gs}:change`;class vs{constructor(t,e){this._proxy=ms(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class fe extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new vs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Xt,t),t}detach(t){this.removeEventListener(Xt,t)}}function ms(i,t){return new Proxy(i,{get:(r,s,o)=>s==="then"?void 0:Reflect.get(r,s,o),set:(r,s,o,n)=>{const c=i[s];console.log(`Context['${s.toString()}'] <= `,o);const a=Reflect.set(r,s,o,n);if(a){let p=new CustomEvent(Xt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(p,{property:s,oldValue:c,value:o}),t.dispatchEvent(p)}else console.log(`Context['${s}] was not set to ${o}`);return a}})}function ys(i,t){const e=Ar(t,i);return new Promise((r,s)=>{if(e){const o=e.localName;customElements.whenDefined(o).then(()=>r(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function Ar(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const r=t.closest(e);if(r)return r;const s=t.getRootNode();if(s instanceof ShadowRoot)return Ar(i,s.host)}class bs extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function kr(i="mu:message"){return(t,...e)=>t.dispatchEvent(new bs(e,i))}class ge{constructor(t,e,r="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=r,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const r=e.detail;this.consume(r)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${t[0]} message`,t);const e=this._update(t,this._context.value);if(console.log(`Next[${t[0]}] => `,e),!Array.isArray(e))this._context.value=e;else{const[r,...s]=e;this._context.value=r,s.forEach(o=>o.then(n=>{n.length&&this.consume(n)}))}}}const te="mu:auth:jwt",Er=class Sr extends ge{constructor(t,e){super((r,s)=>this.update(r,s),t,Sr.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":{const{token:s,redirect:o}=t[1];return[$s(s),Gt(o)]}case"auth/signout":return[ws(e.user),Gt(this._redirectForLogin)];case"auth/redirect":return[e,Gt(this._redirectForLogin,{next:window.location.href})];default:const r=t[0];throw new Error(`Unhandled Auth message "${r}"`)}}};Er.EVENT_TYPE="auth:message";let Pr=Er;const Cr=kr(Pr.EVENT_TYPE);function Gt(i,t){return new Promise((e,r)=>{if(i){const s=window.location.href,o=new URL(i,s);t&&Object.entries(t).forEach(([n,c])=>o.searchParams.set(n,c)),console.log("Redirecting to ",i),window.location.assign(o)}e([])})}class _s extends fe{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=Z.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new Pr(this.context,this.redirect).attach(this)}}class G{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(te),t}}class Z extends G{constructor(t){super();const e=xr(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new Z(t);return localStorage.setItem(te,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(te);return t?Z.authenticate(t):new G}}function $s(i){return{user:Z.authenticate(i),token:i}}function ws(i){return{user:i&&i.authenticated?G.deauthenticate(i):i,token:""}}function xs(i){return i&&i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function As(i){return i.authenticated?xr(i.token||""):{}}const jt=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:Z,Provider:_s,User:G,dispatch:Cr,headers:xs,payload:As},Symbol.toStringTag,{value:"Module"}));function Or(i,t,e){const r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});i.dispatchEvent(r)}function Et(i,t,e){const r=i.target;Or(r,t,e)}function ee(i,t="*"){return i.composedPath().find(s=>{const o=s;return o.tagName&&o.matches(t)})||void 0}const ks=Object.freeze(Object.defineProperty({__proto__:null,dispatchCustom:Or,originalTarget:ee,relay:Et},Symbol.toStringTag,{value:"Module"}));function zt(i,...t){const e=i.map((s,o)=>o?[t[o-1],s]:[s]).flat().join("");let r=new CSSStyleSheet;return r.replaceSync(e),r}const Es=new DOMParser;function P(i,...t){const e=t.map(c),r=i.map((a,p)=>{if(p===0)return[a];const f=e[p-1];return f instanceof Node?[`<ins id="mu-html-${p-1}"></ins>`,a]:[f,a]}).flat().join(""),s=Es.parseFromString(r,"text/html"),o=s.head.childElementCount?s.head.children:s.body.children,n=new DocumentFragment;return n.replaceChildren(...o),e.forEach((a,p)=>{if(a instanceof Node){const f=n.querySelector(`ins#mu-html-${p}`);if(f){const d=f.parentNode;d?.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${p}`)}}),n;function c(a,p){if(a===null)return"";switch(typeof a){case"string":return Ge(a);case"bigint":case"boolean":case"number":case"symbol":return Ge(a.toString());case"object":if(Array.isArray(a)){const f=new DocumentFragment,d=a.map(c);return f.replaceChildren(...d),f}return a instanceof Node?a:new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ge(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Lt(i,t={mode:"open"}){const e=i.attachShadow(t),r={template:s,styles:o};return r;function s(n){const c=n.firstElementChild,a=c&&c.tagName==="TEMPLATE"?c:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),r}function o(...n){e.adoptedStyleSheets=n}}W=class extends HTMLElement{constructor(){super(),this._state={},Lt(this).template(W.template).styles(W.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,r=t.value;e&&(this._state[e]=r)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Et(i,"mu-form:submit",this._state)}),this.submitSlot&&this.submitSlot.addEventListener("slotchange",()=>{var i,t;for(const e of((i=this.submitSlot)==null?void 0:i.assignedNodes())||[])(t=this.form)==null||t.insertBefore(e,this.submitSlot)})}set init(i){this._state=i||{},Ss(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}get submitSlot(){var i;const t=(i=this.shadowRoot)==null?void 0:i.querySelector('slot[name="submit"]');return t||null}},W.template=P`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,W.styles=zt`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function Ss(i,t){const e=Object.entries(i);for(const[r,s]of e){const o=t.querySelector(`[name="${r}"]`);if(o){const n=o;switch(n.type){case"checkbox":const c=n;c.checked=!!s;break;case"date":s instanceof Date?n.value=s.toISOString().substr(0,10):n.value=s;break;default:n.value=s;break}}}return i}const Tr=class Rr extends ge{constructor(t){super((e,r)=>this.update(e,r),t,Rr.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:r,state:s}=t[1];return Cs(r,s)}case"history/redirect":{const{href:r,state:s}=t[1];return Os(r,s)}}}};Tr.EVENT_TYPE="history:message";let ve=Tr;class Ze extends fe{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Ps(t);if(e){const r=new URL(e.href);r.origin===this.context.value.location.origin&&(!this._root||r.pathname.startsWith(this._root))&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),me(e,"history/navigate",{href:r.pathname+r.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ve(this.context).attach(this),this._root=this.getAttribute("root")||void 0}}function Ps(i){const t=i.currentTarget,e=r=>r.tagName=="A"&&r.href;if(i.button===0)if(i.composed){const s=i.composedPath().find(e);return s||void 0}else{for(let r=i.target;r;r===t?null:r.parentElement)if(e(r))return r;return}}function Cs(i,t={}){return history.pushState(t,"",i),{location:document.location,state:history.state}}function Os(i,t={}){return history.replaceState(t,"",i),{location:document.location,state:history.state}}const me=kr(ve.EVENT_TYPE),Ts=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ze,Provider:Ze,Service:ve,dispatch:me},Symbol.toStringTag,{value:"Module"}));class O{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,r)=>{if(this._provider){const s=new Qe(this._provider,t);this._effects.push(s),e(s)}else ys(this._target,this._contextLabel).then(s=>{const o=new Qe(s,t);this._provider=s,this._effects.push(o),s.attach(n=>this._handleChange(n)),e(o)}).catch(s=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Qe{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const Nr=class Ur extends HTMLElement{constructor(){super(),this._state={},this._user=new G,this._authObserver=new O(this,"blazing:auth"),Lt(this).template(Ur.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",r=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Rs(s,this._state,e,this.authorization).then(o=>st(o,this)).then(o=>{const n=`mu-rest-form:${r}`,c=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,[r]:o,url:s}});this.dispatchEvent(c)}).catch(o=>{const n="mu-rest-form:error",c=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,error:o,url:s,request:this._state}});this.dispatchEvent(c)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const r=e.name,s=e.value;r&&(this._state[r]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},st(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Xe(this.src,this.authorization).then(e=>{this._state=e,st(e,this)}))})}attributeChangedCallback(t,e,r){switch(t){case"src":this.src&&r&&r!==e&&!this.isNew&&Xe(this.src,this.authorization).then(s=>{this._state=s,st(s,this)});break;case"new":r&&(this._state={},st({},this));break}}};Nr.observedAttributes=["src","new","action"];Nr.template=P`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Xe(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function st(i,t){const e=Object.entries(i);for(const[r,s]of e){const o=t.querySelector(`[name="${r}"]`);if(o){const n=o;switch(n.type){case"checkbox":const c=n;c.checked=!!s;break;default:n.value=s;break}}}return i}function Rs(i,t,e="PUT",r={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...r},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()})}const Mr=class jr extends ge{constructor(t,e){super(e,t,jr.EVENT_TYPE,!1)}};Mr.EVENT_TYPE="mu:message";let zr=Mr;class Ns extends fe{constructor(t,e,r){super(e),this._user=new G,this._updateFn=t,this._authObserver=new O(this,r)}connectedCallback(){const t=new zr(this.context,(e,r)=>this._updateFn(e,r,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const Us=Object.freeze(Object.defineProperty({__proto__:null,Provider:Ns,Service:zr},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const At=globalThis,ye=At.ShadowRoot&&(At.ShadyCSS===void 0||At.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,be=Symbol(),tr=new WeakMap;let Lr=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==be)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ye&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=tr.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&tr.set(e,t))}return t}toString(){return this.cssText}};const Ms=i=>new Lr(typeof i=="string"?i:i+"",void 0,be),js=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1],i[0]);return new Lr(e,i,be)},zs=(i,t)=>{if(ye)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=At.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},er=ye?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return Ms(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ls,defineProperty:Is,getOwnPropertyDescriptor:Hs,getOwnPropertyNames:Ds,getOwnPropertySymbols:Bs,getPrototypeOf:qs}=Object,Q=globalThis,rr=Q.trustedTypes,Fs=rr?rr.emptyScript:"",sr=Q.reactiveElementPolyfillSupport,ct=(i,t)=>i,St={toAttribute(i,t){switch(t){case Boolean:i=i?Fs:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},_e=(i,t)=>!Ls(i,t),ir={attribute:!0,type:String,converter:St,reflect:!1,useDefault:!1,hasChanged:_e};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Q.litPropertyMetadata??(Q.litPropertyMetadata=new WeakMap);let V=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ir){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Is(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:o}=Hs(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:s,set(n){const c=s?.call(this);o?.call(this,n),this.requestUpdate(t,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ir}static _$Ei(){if(this.hasOwnProperty(ct("elementProperties")))return;const t=qs(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ct("properties"))){const e=this.properties,r=[...Ds(e),...Bs(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(er(s))}else t!==void 0&&e.push(er(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return zs(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){var r;const s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(o!==void 0&&s.reflect===!0){const n=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:St).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){var r,s;const o=this.constructor,n=o._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const c=o.getPropertyOptions(n),a=typeof c.converter=="function"?{fromAttribute:c.converter}:((r=c.converter)==null?void 0:r.fromAttribute)!==void 0?c.converter:St;this._$Em=n,this[n]=a.fromAttribute(e,c.type)??((s=this._$Ej)==null?void 0:s.get(n))??null,this._$Em=null}}requestUpdate(t,e,r){var s;if(t!==void 0){const o=this.constructor,n=this[t];if(r??(r=o.getPropertyOptions(t)),!((r.hasChanged??_e)(n,e)||r.useDefault&&r.reflect&&n===((s=this._$Ej)==null?void 0:s.get(t))&&!this.hasAttribute(o._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:o},n){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,n]of s){const{wrapped:c}=n,a=this[o];c!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,n,a)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(t=this._$EO)==null||t.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(r)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};V.elementStyles=[],V.shadowRootOptions={mode:"open"},V[ct("elementProperties")]=new Map,V[ct("finalized")]=new Map,sr?.({ReactiveElement:V}),(Q.reactiveElementVersions??(Q.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,Ct=Pt.trustedTypes,or=Ct?Ct.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ir="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Hr="?"+T,Ws=`<${Hr}>`,H=document,ht=()=>H.createComment(""),dt=i=>i===null||typeof i!="object"&&typeof i!="function",$e=Array.isArray,Ys=i=>$e(i)||typeof i?.[Symbol.iterator]=="function",Zt=`[ 	
\f\r]`,it=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,nr=/-->/g,ar=/>/g,j=RegExp(`>|${Zt}(?:([^\\s"'>=/]+)(${Zt}*=${Zt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),cr=/'/g,lr=/"/g,Dr=/^(?:script|style|textarea|title)$/i,Vs=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),ot=Vs(1),X=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),hr=new WeakMap,L=H.createTreeWalker(H,129);function Br(i,t){if(!$e(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return or!==void 0?or.createHTML(t):t}const Js=(i,t)=>{const e=i.length-1,r=[];let s,o=t===2?"<svg>":t===3?"<math>":"",n=it;for(let c=0;c<e;c++){const a=i[c];let p,f,d=-1,l=0;for(;l<a.length&&(n.lastIndex=l,f=n.exec(a),f!==null);)l=n.lastIndex,n===it?f[1]==="!--"?n=nr:f[1]!==void 0?n=ar:f[2]!==void 0?(Dr.test(f[2])&&(s=RegExp("</"+f[2],"g")),n=j):f[3]!==void 0&&(n=j):n===j?f[0]===">"?(n=s??it,d=-1):f[1]===void 0?d=-2:(d=n.lastIndex-f[2].length,p=f[1],n=f[3]===void 0?j:f[3]==='"'?lr:cr):n===lr||n===cr?n=j:n===nr||n===ar?n=it:(n=j,s=void 0);const h=n===j&&i[c+1].startsWith("/>")?" ":"";o+=n===it?a+Ws:d>=0?(r.push(p),a.slice(0,d)+Ir+a.slice(d)+T+h):a+T+(d===-2?c:h)}return[Br(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};let re=class qr{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let o=0,n=0;const c=t.length-1,a=this.parts,[p,f]=Js(t,e);if(this.el=qr.createElement(p,r),L.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=L.nextNode())!==null&&a.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(const d of s.getAttributeNames())if(d.endsWith(Ir)){const l=f[n++],h=s.getAttribute(d).split(T),u=/([.?@])?(.*)/.exec(l);a.push({type:1,index:o,name:u[2],strings:h,ctor:u[1]==="."?Gs:u[1]==="?"?Zs:u[1]==="@"?Qs:It}),s.removeAttribute(d)}else d.startsWith(T)&&(a.push({type:6,index:o}),s.removeAttribute(d));if(Dr.test(s.tagName)){const d=s.textContent.split(T),l=d.length-1;if(l>0){s.textContent=Ct?Ct.emptyScript:"";for(let h=0;h<l;h++)s.append(d[h],ht()),L.nextNode(),a.push({type:2,index:++o});s.append(d[l],ht())}}}else if(s.nodeType===8)if(s.data===Hr)a.push({type:2,index:o});else{let d=-1;for(;(d=s.data.indexOf(T,d+1))!==-1;)a.push({type:7,index:o}),d+=T.length-1}o++}}static createElement(t,e){const r=H.createElement("template");return r.innerHTML=t,r}};function tt(i,t,e=i,r){var s,o;if(t===X)return t;let n=r!==void 0?(s=e._$Co)==null?void 0:s[r]:e._$Cl;const c=dt(t)?void 0:t._$litDirective$;return n?.constructor!==c&&((o=n?._$AO)==null||o.call(n,!1),c===void 0?n=void 0:(n=new c(i),n._$AT(i,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=n:e._$Cl=n),n!==void 0&&(t=tt(i,n._$AS(i,t.values),n,r)),t}let Ks=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??H).importNode(e,!0);L.currentNode=s;let o=L.nextNode(),n=0,c=0,a=r[0];for(;a!==void 0;){if(n===a.index){let p;a.type===2?p=new we(o,o.nextSibling,this,t):a.type===1?p=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(p=new Xs(o,this,t)),this._$AV.push(p),a=r[++c]}n!==a?.index&&(o=L.nextNode(),n++)}return L.currentNode=H,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},we=class Fr{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),dt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==X&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ys(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&dt(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var e;const{values:r,_$litType$:s}=t,o=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=re.createElement(Br(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(r);else{const n=new Ks(o,this),c=n.u(this.options);n.p(r),this.T(c),this._$AH=n}}_$AC(t){let e=hr.get(t.strings);return e===void 0&&hr.set(t.strings,e=new re(t)),e}k(t){$e(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const o of t)s===e.length?e.push(r=new Fr(this.O(ht()),this.O(ht()),this,this.options)):r=e[s],r._$AI(o),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},It=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=_}_$AI(t,e=this,r,s){const o=this.strings;let n=!1;if(o===void 0)t=tt(this,t,e,0),n=!dt(t)||t!==this._$AH&&t!==X,n&&(this._$AH=t);else{const c=t;let a,p;for(t=o[0],a=0;a<o.length-1;a++)p=tt(this,c[r+a],e,a),p===X&&(p=this._$AH[a]),n||(n=!dt(p)||p!==this._$AH[a]),p===_?t=_:t!==_&&(t+=(p??"")+o[a+1]),this._$AH[a]=p}n&&!s&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Gs=class extends It{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}},Zs=class extends It{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}},Qs=class extends It{constructor(t,e,r,s,o){super(t,e,r,s,o),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??_)===X)return;const r=this._$AH,s=t===_&&r!==_||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==_&&(r===_||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},Xs=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}};const dr=Pt.litHtmlPolyfillSupport;dr?.(re,we),(Pt.litHtmlVersions??(Pt.litHtmlVersions=[])).push("3.3.0");const ti=(i,t,e)=>{const r=e?.renderBefore??t;let s=r._$litPart$;if(s===void 0){const o=e?.renderBefore??null;r._$litPart$=s=new we(t.insertBefore(ht(),o),o,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pt=globalThis;let K=class extends V{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ti(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return X}};K._$litElement$=!0,K.finalized=!0,(Ke=pt.litElementHydrateSupport)==null||Ke.call(pt,{LitElement:K});const pr=pt.litElementPolyfillSupport;pr?.({LitElement:K});(pt.litElementVersions??(pt.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ei={attribute:!0,type:String,converter:St,reflect:!1,hasChanged:_e},ri=(i=ei,t,e)=>{const{kind:r,metadata:s}=e;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),r==="accessor"){const{name:n}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(n,a,i)},init(c){return c!==void 0&&this.C(n,void 0,i,c),c}}}if(r==="setter"){const{name:n}=e;return function(c){const a=this[n];t.call(this,c),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+r)};function Wr(i){return(t,e)=>typeof e=="object"?ri(i,t,e):((r,s,o)=>{const n=s.hasOwnProperty(o);return s.constructor.createProperty(o,r),n?Object.getOwnPropertyDescriptor(s,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Yr(i){return Wr({...i,state:!0,attribute:!1})}function si(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function ii(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Vr={};(function(i){var t=(function(){var e=function(d,l,h,u){for(h=h||{},u=d.length;u--;h[d[u]]=l);return h},r=[1,9],s=[1,10],o=[1,11],n=[1,12],c=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(l,h,u,m,v,y,Wt){var k=y.length-1;switch(v){case 1:return new m.Root({},[y[k-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[y[k-1],y[k]]);break;case 4:case 5:this.$=y[k];break;case 6:this.$=new m.Literal({value:y[k]});break;case 7:this.$=new m.Splat({name:y[k]});break;case 8:this.$=new m.Param({name:y[k]});break;case 9:this.$=new m.Optional({},[y[k-1]]);break;case 10:this.$=l;break;case 11:case 12:this.$=l.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:o,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:r,13:s,14:o,15:n},{1:[2,2]},e(c,[2,4]),e(c,[2,5]),e(c,[2,6]),e(c,[2,7]),e(c,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:o,15:n},e(c,[2,10]),e(c,[2,11]),e(c,[2,12]),{1:[2,1]},e(c,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:r,12:[1,16],13:s,14:o,15:n},e(c,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(l,h){if(h.recoverable)this.trace(l);else{let u=function(m,v){this.message=m,this.hash=v};throw u.prototype=Error,new u(l,h)}},parse:function(l){var h=this,u=[0],m=[null],v=[],y=this.table,Wt="",k=0,Ye=0,ls=2,Ve=1,hs=v.slice.call(arguments,1),b=Object.create(this.lexer),U={yy:{}};for(var Yt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Yt)&&(U.yy[Yt]=this.yy[Yt]);b.setInput(l,U.yy),U.yy.lexer=b,U.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var Vt=b.yylloc;v.push(Vt);var ds=b.options&&b.options.ranges;typeof U.yy.parseError=="function"?this.parseError=U.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var ps=function(){var F;return F=b.lex()||Ve,typeof F!="number"&&(F=h.symbols_[F]||F),F},A,M,S,Jt,q={},wt,C,Je,xt;;){if(M=u[u.length-1],this.defaultActions[M]?S=this.defaultActions[M]:((A===null||typeof A>"u")&&(A=ps()),S=y[M]&&y[M][A]),typeof S>"u"||!S.length||!S[0]){var Kt="";xt=[];for(wt in y[M])this.terminals_[wt]&&wt>ls&&xt.push("'"+this.terminals_[wt]+"'");b.showPosition?Kt="Parse error on line "+(k+1)+`:
`+b.showPosition()+`
Expecting `+xt.join(", ")+", got '"+(this.terminals_[A]||A)+"'":Kt="Parse error on line "+(k+1)+": Unexpected "+(A==Ve?"end of input":"'"+(this.terminals_[A]||A)+"'"),this.parseError(Kt,{text:b.match,token:this.terminals_[A]||A,line:b.yylineno,loc:Vt,expected:xt})}if(S[0]instanceof Array&&S.length>1)throw new Error("Parse Error: multiple actions possible at state: "+M+", token: "+A);switch(S[0]){case 1:u.push(A),m.push(b.yytext),v.push(b.yylloc),u.push(S[1]),A=null,Ye=b.yyleng,Wt=b.yytext,k=b.yylineno,Vt=b.yylloc;break;case 2:if(C=this.productions_[S[1]][1],q.$=m[m.length-C],q._$={first_line:v[v.length-(C||1)].first_line,last_line:v[v.length-1].last_line,first_column:v[v.length-(C||1)].first_column,last_column:v[v.length-1].last_column},ds&&(q._$.range=[v[v.length-(C||1)].range[0],v[v.length-1].range[1]]),Jt=this.performAction.apply(q,[Wt,Ye,k,U.yy,S[1],m,v].concat(hs)),typeof Jt<"u")return Jt;C&&(u=u.slice(0,-1*C*2),m=m.slice(0,-1*C),v=v.slice(0,-1*C)),u.push(this.productions_[S[1]][0]),m.push(q.$),v.push(q._$),Je=y[u[u.length-2]][u[u.length-1]],u.push(Je);break;case 3:return!0}}return!0}},p=(function(){var d={EOF:1,parseError:function(h,u){if(this.yy.parser)this.yy.parser.parseError(h,u);else throw new Error(h)},setInput:function(l,h){return this.yy=h||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var h=l.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},unput:function(l){var h=l.length,u=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),u.length-1&&(this.yylineno-=u.length-1);var v=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:u?(u.length===m.length?this.yylloc.first_column:0)+m[m.length-u.length].length-u[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[v[0],v[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(l){this.unput(this.match.slice(l))},pastInput:function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var l=this.pastInput(),h=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+h+"^"},test_match:function(l,h){var u,m,v;if(this.options.backtrack_lexer&&(v={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(v.yylloc.range=this.yylloc.range.slice(0))),m=l[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],u=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),u)return u;if(this._backtrack){for(var y in v)this[y]=v[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,h,u,m;this._more||(this.yytext="",this.match="");for(var v=this._currentRules(),y=0;y<v.length;y++)if(u=this._input.match(this.rules[v[y]]),u&&(!h||u[0].length>h[0].length)){if(h=u,m=y,this.options.backtrack_lexer){if(l=this.test_match(u,v[y]),l!==!1)return l;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(l=this.test_match(h,v[m]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,u,m,v){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d})();a.lexer=p;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f})();typeof ii<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Vr);function Y(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Jr={Root:Y("Root"),Concat:Y("Concat"),Literal:Y("Literal"),Splat:Y("Splat"),Param:Y("Param"),Optional:Y("Optional")},Kr=Vr.parser;Kr.yy=Jr;var oi=Kr,ni=Object.keys(Jr);function ai(i){return ni.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Gr=ai,ci=Gr,li=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Zr(i){this.captures=i.captures,this.re=i.re}Zr.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(r,s){typeof t[s+1]>"u"?e[r]=void 0:e[r]=decodeURIComponent(t[s+1])}),e};var hi=ci({Concat:function(i){return i.children.reduce((function(t,e){var r=this.visit(e);return{re:t.re+r.re,captures:t.captures.concat(r.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(li,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Zr({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),di=hi,pi=Gr,ui=pi({Concat:function(i,t){var e=i.children.map((function(r){return this.visit(r,t)}).bind(this));return e.some(function(r){return r===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),fi=ui,gi=oi,vi=di,mi=fi;bt.prototype=Object.create(null);bt.prototype.match=function(i){var t=vi.visit(this.ast),e=t.match(i);return e||!1};bt.prototype.reverse=function(i){return mi.visit(this.ast,i)};function bt(i){var t;if(this?t=this:t=Object.create(bt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=gi.parse(i),t}var yi=bt,bi=yi,_i=bi;const $i=si(_i);var wi=Object.defineProperty,Qr=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&wi(t,e,s),s};const Xr=class extends K{constructor(t,e,r=""){super(),this._cases=[],this._fallback=()=>ot` <h1>Not Found</h1> `,this._cases=t.map(s=>({...s,route:new $i(s.path)})),this._historyObserver=new O(this,e),this._authObserver=new O(this,r)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ot` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(Cr(this,"auth/redirect"),ot` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ot` <h1>Authenticating</h1> `;if("redirect"in e){const r=e.redirect;if(typeof r=="string")return this.redirect(r),ot` <h1>Redirecting to ${r}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:r}=t,s=new URLSearchParams(e),o=r+e;for(const n of this._cases){const c=n.route.match(o);if(c)return{...n,path:r,params:c,query:s}}}redirect(t){me(this,"history/redirect",{href:t})}};Xr.styles=js`
    :host,
    main {
      display: contents;
    }
  `;let Ot=Xr;Qr([Yr()],Ot.prototype,"_user");Qr([Yr()],Ot.prototype,"_match");const xi=Object.freeze(Object.defineProperty({__proto__:null,Element:Ot,Switch:Ot},Symbol.toStringTag,{value:"Module"})),ts=class se extends HTMLElement{constructor(){if(super(),Lt(this).template(se.template).styles(se.styles),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};ts.template=P` <template>
    <slot name="actuator"><button>Menu</button></slot>
    <div id="panel">
      <slot></slot>
    </div>
  </template>`;ts.styles=zt`
    :host {
      position: relative;
    }
    #is-shown {
      display: none;
    }
    #panel {
      display: none;

      position: absolute;
      right: 0;
      margin-top: var(--size-spacing-small);
      width: max-content;
      padding: var(--size-spacing-small);
      border-radius: var(--size-radius-small);
      background: var(--color-background-card);
      color: var(--color-text);
      box-shadow: var(--shadow-popover);
    }
    :host([open]) #panel {
      display: block;
    }
  `;const es=class ie extends HTMLElement{constructor(){super(),this._array=[],Lt(this).template(ie.template).styles(ie.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(rs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const r=new Event("change",{bubbles:!0}),s=e.value,o=e.closest("label");if(o){const n=Array.from(this.children).indexOf(o);this._array[n]=s,this.dispatchEvent(r)}}}),this.addEventListener("click",t=>{ee(t,"button.add")?Et(t,"input-array:add"):ee(t,"button.remove")&&Et(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Ai(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const r=Array.from(this.children).indexOf(e);this._array.splice(r,1),e.remove()}}};es.template=P`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;es.styles=zt`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function Ai(i,t){t.replaceChildren(),i.forEach((e,r)=>t.append(rs(e)))}function rs(i,t){const e=i===void 0?P`<input />`:P`<input value="${i}" />`;return P`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function ki(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Ei=Object.defineProperty,Si=Object.getOwnPropertyDescriptor,Pi=(i,t,e,r)=>{for(var s=Si(t,e),o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&Ei(t,e,s),s};class Ht extends K{constructor(t){super(),this._pending=[],this._observer=new O(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([r,s])=>{console.log("Dispatching queued event",s,r),r.dispatchEvent(s)}),e.setEffect(()=>{var r;if(console.log("View effect",this,e,(r=this._context)==null?void 0:r.value),this._context)console.log("requesting update"),this.requestUpdate(),this._lastModel=this._context.value;else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const r=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",r),e.dispatchEvent(r)):(console.log("Queueing message event",r),this._pending.push([e,r]))}ref(t){return this.model?this.model[t]:void 0}}Pi([Wr()],Ht.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,xe=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ae=Symbol(),ur=new WeakMap;let ss=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==Ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(xe&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=ur.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&ur.set(e,t))}return t}toString(){return this.cssText}};const Ci=i=>new ss(typeof i=="string"?i:i+"",void 0,Ae),x=(i,...t)=>{const e=i.length===1?i[0]:t.reduce(((r,s,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1]),i[0]);return new ss(e,i,Ae)},Oi=(i,t)=>{if(xe)i.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const e of t){const r=document.createElement("style"),s=kt.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},fr=xe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return Ci(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ti,defineProperty:Ri,getOwnPropertyDescriptor:Ni,getOwnPropertyNames:Ui,getOwnPropertySymbols:Mi,getPrototypeOf:ji}=Object,Dt=globalThis,gr=Dt.trustedTypes,zi=gr?gr.emptyScript:"",Li=Dt.reactiveElementPolyfillSupport,lt=(i,t)=>i,Tt={toAttribute(i,t){switch(t){case Boolean:i=i?zi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ke=(i,t)=>!Ti(i,t),vr={attribute:!0,type:String,converter:Tt,reflect:!1,useDefault:!1,hasChanged:ke};Symbol.metadata??=Symbol("metadata"),Dt.litPropertyMetadata??=new WeakMap;let J=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=vr){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Ri(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:o}=Ni(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:s,set(n){const c=s?.call(this);o?.call(this,n),this.requestUpdate(t,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??vr}static _$Ei(){if(this.hasOwnProperty(lt("elementProperties")))return;const t=ji(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(lt("properties"))){const e=this.properties,r=[...Ui(e),...Mi(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(fr(s))}else t!==void 0&&e.push(fr(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Oi(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const o=(r.converter?.toAttribute!==void 0?r.converter:Tt).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const o=r.getPropertyOptions(s),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:Tt;this._$Em=s;const c=n.fromAttribute(e,o.type);this[s]=c??this._$Ej?.get(s)??c,this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){const s=this.constructor,o=this[t];if(r??=s.getPropertyOptions(t),!((r.hasChanged??ke)(o,e)||r.useDefault&&r.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:o},n){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[s,o]of r){const{wrapped:n}=o,c=this[s];n!==!0||this._$AL.has(s)||c===void 0||this.C(s,void 0,o,c)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((r=>r.hostUpdate?.())),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[lt("elementProperties")]=new Map,J[lt("finalized")]=new Map,Li?.({ReactiveElement:J}),(Dt.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ee=globalThis,Rt=Ee.trustedTypes,mr=Rt?Rt.createPolicy("lit-html",{createHTML:i=>i}):void 0,is="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,os="?"+R,Ii=`<${os}>`,D=document,ut=()=>D.createComment(""),ft=i=>i===null||typeof i!="object"&&typeof i!="function",Se=Array.isArray,Hi=i=>Se(i)||typeof i?.[Symbol.iterator]=="function",Qt=`[ 	
\f\r]`,nt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,yr=/-->/g,br=/>/g,z=RegExp(`>|${Qt}(?:([^\\s"'>=/]+)(${Qt}*=${Qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_r=/'/g,$r=/"/g,ns=/^(?:script|style|textarea|title)$/i,Di=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),g=Di(1),et=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),wr=new WeakMap,I=D.createTreeWalker(D,129);function as(i,t){if(!Se(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return mr!==void 0?mr.createHTML(t):t}const Bi=(i,t)=>{const e=i.length-1,r=[];let s,o=t===2?"<svg>":t===3?"<math>":"",n=nt;for(let c=0;c<e;c++){const a=i[c];let p,f,d=-1,l=0;for(;l<a.length&&(n.lastIndex=l,f=n.exec(a),f!==null);)l=n.lastIndex,n===nt?f[1]==="!--"?n=yr:f[1]!==void 0?n=br:f[2]!==void 0?(ns.test(f[2])&&(s=RegExp("</"+f[2],"g")),n=z):f[3]!==void 0&&(n=z):n===z?f[0]===">"?(n=s??nt,d=-1):f[1]===void 0?d=-2:(d=n.lastIndex-f[2].length,p=f[1],n=f[3]===void 0?z:f[3]==='"'?$r:_r):n===$r||n===_r?n=z:n===yr||n===br?n=nt:(n=z,s=void 0);const h=n===z&&i[c+1].startsWith("/>")?" ":"";o+=n===nt?a+Ii:d>=0?(r.push(p),a.slice(0,d)+is+a.slice(d)+R+h):a+R+(d===-2?c:h)}return[as(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class gt{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let o=0,n=0;const c=t.length-1,a=this.parts,[p,f]=Bi(t,e);if(this.el=gt.createElement(p,r),I.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=I.nextNode())!==null&&a.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(const d of s.getAttributeNames())if(d.endsWith(is)){const l=f[n++],h=s.getAttribute(d).split(R),u=/([.?@])?(.*)/.exec(l);a.push({type:1,index:o,name:u[2],strings:h,ctor:u[1]==="."?Fi:u[1]==="?"?Wi:u[1]==="@"?Yi:Bt}),s.removeAttribute(d)}else d.startsWith(R)&&(a.push({type:6,index:o}),s.removeAttribute(d));if(ns.test(s.tagName)){const d=s.textContent.split(R),l=d.length-1;if(l>0){s.textContent=Rt?Rt.emptyScript:"";for(let h=0;h<l;h++)s.append(d[h],ut()),I.nextNode(),a.push({type:2,index:++o});s.append(d[l],ut())}}}else if(s.nodeType===8)if(s.data===os)a.push({type:2,index:o});else{let d=-1;for(;(d=s.data.indexOf(R,d+1))!==-1;)a.push({type:7,index:o}),d+=R.length-1}o++}}static createElement(t,e){const r=D.createElement("template");return r.innerHTML=t,r}}function rt(i,t,e=i,r){if(t===et)return t;let s=r!==void 0?e._$Co?.[r]:e._$Cl;const o=ft(t)?void 0:t._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??=[])[r]=s:e._$Cl=s),s!==void 0&&(t=rt(i,s._$AS(i,t.values),s,r)),t}class qi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??D).importNode(e,!0);I.currentNode=s;let o=I.nextNode(),n=0,c=0,a=r[0];for(;a!==void 0;){if(n===a.index){let p;a.type===2?p=new _t(o,o.nextSibling,this,t):a.type===1?p=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(p=new Vi(o,this,t)),this._$AV.push(p),a=r[++c]}n!==a?.index&&(o=I.nextNode(),n++)}return I.currentNode=D,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class _t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=rt(this,t,e),ft(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==et&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Hi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&ft(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=gt.createElement(as(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{const o=new qi(s,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=wr.get(t.strings);return e===void 0&&wr.set(t.strings,e=new gt(t)),e}k(t){Se(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const o of t)s===e.length?e.push(r=new _t(this.O(ut()),this.O(ut()),this,this.options)):r=e[s],r._$AI(o),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class Bt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,o){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=$}_$AI(t,e=this,r,s){const o=this.strings;let n=!1;if(o===void 0)t=rt(this,t,e,0),n=!ft(t)||t!==this._$AH&&t!==et,n&&(this._$AH=t);else{const c=t;let a,p;for(t=o[0],a=0;a<o.length-1;a++)p=rt(this,c[r+a],e,a),p===et&&(p=this._$AH[a]),n||=!ft(p)||p!==this._$AH[a],p===$?t=$:t!==$&&(t+=(p??"")+o[a+1]),this._$AH[a]=p}n&&!s&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Fi extends Bt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Wi extends Bt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Yi extends Bt{constructor(t,e,r,s,o){super(t,e,r,s,o),this.type=5}_$AI(t,e=this){if((t=rt(this,t,e,0)??$)===et)return;const r=this._$AH,s=t===$&&r!==$||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==$&&(r===$||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Vi{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){rt(this,t)}}const Ji=Ee.litHtmlPolyfillSupport;Ji?.(gt,_t),(Ee.litHtmlVersions??=[]).push("3.3.1");const Ki=(i,t,e)=>{const r=e?.renderBefore??t;let s=r._$litPart$;if(s===void 0){const o=e?.renderBefore??null;r._$litPart$=s=new _t(t.insertBefore(ut(),o),o,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pe=globalThis;class w extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ki(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return et}}w._$litElement$=!0,w.finalized=!0,Pe.litElementHydrateSupport?.({LitElement:w});const Gi=Pe.litElementPolyfillSupport;Gi?.({LitElement:w});(Pe.litElementVersions??=[]).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Zi={attribute:!0,type:String,converter:Tt,reflect:!1,hasChanged:ke},Qi=(i=Zi,t,e)=>{const{kind:r,metadata:s}=e;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),r==="accessor"){const{name:n}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(n,a,i)},init(c){return c!==void 0&&this.C(n,void 0,i,c),c}}}if(r==="setter"){const{name:n}=e;return function(c){const a=this[n];t.call(this,c),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+r)};function E(i){return(t,e)=>typeof e=="object"?Qi(i,t,e):((r,s,o)=>{const n=s.hasOwnProperty(o);return s.constructor.createProperty(o,r),n?Object.getOwnPropertyDescriptor(s,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function qt(i){return E({...i,state:!0,attribute:!1})}var Xi=Object.defineProperty,cs=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&Xi(t,e,s),s};const Ce=class Ce extends w{constructor(){super(...arguments),this._authObserver=new O(this,"splitroom:auth"),this.loggedIn=!1,this.onThemeChange=t=>{const e=t.target.checked;this.dispatchEvent(new CustomEvent("darkmode:toggle",{bubbles:!0,composed:!0,detail:{checked:e}}))}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t;e&&e.authenticated?(this.loggedIn=!0,this.userid=e.username):(this.loggedIn=!1,this.userid=void 0)})}renderSignOutButton(){return g`
      <button
        @click=${t=>{ks.relay(t,"auth:message",["auth/signout"])}}
      >
        Sign Out
      </button>
    `}renderSignInButton(){return g`<a href="/login">Sign In</a>`}render(){return g`
      <header class="app-header">
        <div class="brand">
          <a href="/app" class="brand-link">SplitRoom</a>
        </div>

        <label id="theme-toggle" class="theme-toggle">
          <input
            id="theme-input"
            type="checkbox"
            autocomplete="off"
            @change=${this.onThemeChange}
          />
          Dark mode
        </label>

        <nav class="top-nav">
          <a href="/app/groups">Groups</a>
          <a href="/app">
            <span class="hello">Hello, ${this.userid??"roommate"}</span>
          </a>
          ${this.loggedIn?this.renderSignOutButton():this.renderSignInButton()}
        </nav>
      </header>
    `}};Ce.styles=x`
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
      min-width: 0;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 0;
    }
    .brand-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4ch;
      font-weight: 700;
      color: inherit;
      text-decoration: none;
    }
    svg.icon {
      width: 1.4rem;
      height: 1.4rem;
    }

    .theme-toggle {
      display: flex;
      align-items: center;
      gap: 0.4ch;
      font-size: 0.9em;
      opacity: 0.9;
    }

    nav.top-nav {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: var(--space-4);
      flex-wrap: nowrap;
      min-width: 0;
      white-space: nowrap;
    }

    nav.top-nav a {
      color: inherit;
      text-decoration: none;
      font-weight: 500;
    }
    nav.top-nav a:hover {
      text-decoration: underline;
    }

    .hello {
      display: inline-block;
      max-width: 18ch;
      text-overflow: ellipsis;
      overflow: hidden;
      vertical-align: bottom;
    }

    .user button,
    button {
      padding: 0.4rem 0.7rem;
      border: var(--border-1);
      border-radius: var(--radius-1);
      background: transparent;
      cursor: pointer;
      white-space: nowrap;
    }
    .user button:hover,
    button:hover {
      background: color-mix(in srgb, var(--color-accent) 10%, transparent);
    }
  `;let vt=Ce;cs([qt()],vt.prototype,"loggedIn");cs([qt()],vt.prototype,"userid");const to=x`
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
`,eo={styles:to};var ro=Object.defineProperty,$t=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&ro(t,e,s),s};const Oe=class Oe extends w{constructor(){super(...arguments),this.from="",this.to="",this.amount="",this.href="",this.status="open"}render(){const t=this.status==="paid";return g`
      <article class="ticket card ${t?"paid":"open"}">
        <div class="line">
          <span class="names">${this.from} → ${this.to}</span>
          <a class="action" href=${this.href}>
            <slot>Details</slot>
          </a>
        </div>
        <div class="line">
          <span class="amount">$${Number(this.amount).toFixed(2)}</span>
          <span class="status">${t?"Paid":"Open"}</span>
        </div>
      </article>
    `}};Oe.styles=[eo.styles,x`
      :host {
        display: block;
      }

      .card {
        background-color: var(--color-card-bg);
        border: var(--border-1);
        border-radius: var(--radius-1);
        padding: var(--space-2) var(--space-3);
        color: var(--color-text);
      }

      .ticket.open {
        outline: 0;
      }

      .ticket.paid {
        opacity: 0.8;
      }

      .line {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--space-4);
        margin-block: 0.25rem;
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
        font-size: 0.9em;
        opacity: 0.8;
      }

      .action {
        color: var(--color-link);
        text-decoration: none;
      }

      .action:hover {
        text-decoration: underline;
      }
    `];let N=Oe;$t([E()],N.prototype,"from");$t([E()],N.prototype,"to");$t([E()],N.prototype,"amount");$t([E()],N.prototype,"href");$t([E()],N.prototype,"status");var so=Object.defineProperty,io=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&so(t,e,s),s};const Te=class Te extends Ht{constructor(){super("splitroom:model"),this._auth=new O(this,"splitroom:auth")}connectedCallback(){super.connectedCallback(),this._auth.observe(t=>{t.user?.authenticated&&this.dispatchMessage(["tickets/load",{userId:this.userId}])})}renderTicket(t){const e=t.href??(t.id?`/app/tickets/${t.id}`:"#");return P`
      <li>
        <sr-ticket
          .from=${t.from}
          .to=${t.to}
          .amount=${t.amount}
          .href=${e}
          .status=${t.status}
        >
          ${t.label??"Details"}
        </sr-ticket>
      </li>
    `}render(){const t=this.model?.tickets??[],e=this.model?.loading??!1,r=this.model?.error;return e?P`<p class="muted">Loading tickets…</p>`:r?P`<p class="error">Failed to load tickets: ${r}</p>`:t.length?P`<ul>${t.map(s=>this.renderTicket(s))}</ul>`:P`<p class="muted">No tickets yet.</p>`}};Te.styles=zt`
    :host {
      display: contents;
    }
    ul,
    li {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      margin: var(--space-2) 0;
    }
    .muted {
      color: var(--color-muted, #6b7280);
    }
    .error {
      color: var(--color-error, #b00020);
    }
  `;let Nt=Te;io([E({attribute:"user-id"})],Nt.prototype,"userId");var oo=Object.defineProperty,Ft=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&oo(t,e,s),s};const Re=class Re extends w{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return g`
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
    `}handleChange(t){const e=t.target;if(!e)return;const{name:r,value:s}=e,o=this.formData;r==="username"&&(this.formData={...o,username:s}),r==="password"&&(this.formData={...o,password:s})}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw new Error("Login failed");return e.json()}).then(e=>{const r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:e.token,redirect:this.redirect}]});this.dispatchEvent(r)}).catch(e=>{this.error=String(e)})}};Re.styles=x`
    :host {
      display: block;
    }
    form {
      display: grid;
      gap: 0.75rem;
    }
    label {
      display: grid;
      gap: 0.25rem;
    }
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
    button[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .error:not(:empty) {
      color: var(--color-error, #b00020);
      border: 1px solid var(--color-error, #b00020);
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-1, 8px);
      background: color-mix(in srgb, var(--color-error, #b00020) 12%, transparent);
    }
  `;let B=Re;Ft([qt()],B.prototype,"formData");Ft([E()],B.prototype,"api");Ft([E()],B.prototype,"redirect");Ft([qt()],B.prototype,"error");function no(i,t,e){switch(i[0]){case"tickets/load":{const[,r]=i;return[{...t,loading:!0,error:void 0},ao(e,r)]}case"tickets/loaded":{const[,r]=i;return{...t,loading:!1,tickets:r??[]}}case"ticket/request":{const[,r]=i;return[{...t,loading:!0,error:void 0},co(r,e)]}case"ticket/load":{const[,{ticket:r}]=i;return{...t,loading:!1,ticket:r}}case"tickets/error":{const[,r]=i;return{...t,loading:!1,error:r}}case"profile/request":{const[,r]=i;return t.profile&&t.profile.username===r.userid?t:[{...t,loading:!0,error:void 0},lo(r,e)]}case"profile/load":{const[,{profile:r}]=i;return{...t,loading:!1,profile:r}}case"profile/error":{const[,r]=i;return{...t,loading:!1,error:r}}default:return t}}function ao(i,t){const e=new URL("/api/tickets",window.location.origin);return t?.userId&&e.searchParams.set("user",t.userId),fetch(e.toString(),{headers:jt.headers(i)}).then(r=>r.ok?r.json():Promise.reject(`${r.status} ${r.statusText}`)).then(r=>["tickets/loaded",r]).catch(r=>["tickets/error",String(r)])}function co(i,t){return fetch(`/api/tickets/${i.ticketid}`,{headers:jt.headers(t)}).then(e=>e.ok?e.json():Promise.reject(`${e.status} ${e.statusText}`)).then(e=>["ticket/load",{ticket:e}]).catch(e=>["tickets/error",String(e)])}function lo(i,t){return fetch(`/api/travelers/${i.userid}`,{headers:jt.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")}).then(e=>["profile/load",{userid:i.userid,profile:e}]).catch(e=>["profile/error",String(e)])}const ho={tickets:[],loading:!1,error:void 0};class po extends Us.Provider{constructor(){super(no,ho,"splitroom:auth")}}var uo=Object.defineProperty,fo=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&uo(t,e,s),s};const Ne=class Ne extends Ht{constructor(){super("splitroom:model")}attributeChangedCallback(t,e,r){super.attributeChangedCallback(t,e,r),t==="user-id"&&r&&r!==e&&this.dispatchMessage(["profile/request",{userid:r}])}render(){const{profile:t,loading:e,error:r}=this.model;return e?g`<p class="muted">Loading profile…</p>`:r?g`<p class="error">Failed to load: ${r}</p>`:t?g`
      <section class="card">
        <h1>Traveler</h1>
        ${go(t)}
      </section>
    `:g`<p class="muted">No profile loaded.</p>`}};Ne.styles=x`
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
  `;let Ut=Ne;fo([E({attribute:"user-id"})],Ut.prototype,"userid");function go(i){return g`
    <dl>
      <dt>User</dt>
      <dd>${i.username}</dd>
      <dt>Password Hash</dt>
      <dd class="muted">${i.hashedPassword}</dd>
    </dl>
  `}const Ue=class Ue extends w{render(){return g`
      <div class="title">
        <p>
          <a href="/app/groups">
            <svg class="icon">
              <use href="/icons/receipt.svg#icon-back" />
            </svg>
            Back to Group
          </a>
        </p>
      </div>

      <main class="page">
        <div class="grid">
          <section class="card span-12">
            <h1>
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-receipt" />
              </svg>
              Receipt
            </h1>
            <dl>
              <dt>Merchant</dt>
              <dd>Taqueria El Sol</dd>
              <dt>Date</dt>
              <dd>2025-09-20</dd>
              <dt>Payer</dt>
              <dd><a href="/app/member">Alex</a></dd>
            </dl>
          </section>

          <section class="card rule-top span-4">
            <h2>
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-item" />
              </svg>
              Items
            </h2>
            <ul>
              <li><a href="/app/item">Chicken Burrito</a> — <a href="/app/price">$8.95</a> — Shared by Alex, Sam</li>
              <li><a href="/app/item">Chips &amp; Salsa</a> — <a href="/app/price">$4.00</a> — Shared by Alex</li>
            </ul>
          </section>

          <section class="card rule-top span-4">
            <h2>
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-dollar" />
              </svg>
              Charges
            </h2>
            <dl>
              <dt>Tax</dt>
              <dd><a href="/app/tax">$1.16</a></dd>
              <dt>Tip</dt>
              <dd><a href="/app/tip">$2.00</a></dd>
              <dt>Discount</dt>
              <dd><a href="/app/discount">$0.00</a></dd>
              <dt>Total</dt>
              <dd><a href="/app/total">$16.11</a></dd>
            </dl>
          </section>

          <section class="card rule-top span-4">
            <sr-ticket
              from="Sam"
              to="Alex"
              amount="12.40"
              href="/app/tickets/preview"
              status="open"
            >
              View / Mark Paid
            </sr-ticket>
          </section>
        </div>
      </main>
    `}};Ue.styles=x`
    :host {
      display: block;
      background-color: var(--color-bg-page);
      color: var(--color-text);
      font-family: var(--font-family-body);
      font-size: var(--font-size-1);
      line-height: var(--line-height-body);
    }
    h1,
    h2 {
      color: var(--color-accent);
      font-family: var(--font-family-display);
      line-height: var(--line-height-tight);
      margin: var(--space-2) 0 var(--space-1);
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
    .span-12 {
      grid-column: span 12;
    }
    .span-4 {
      grid-column: span 4;
    }
    .card {
      background-color: var(--color-card-bg);
      border: var(--border-1);
      border-radius: var(--radius-1);
      padding: var(--space-2) var(--space-3);
    }
    .rule-top {
      border-top: var(--border-thick);
      padding-top: var(--space-1);
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
    a {
      color: var(--color-link);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `;let oe=Ue;const Me=class Me extends w{render(){return g`
      <div class="title">
        <p>
          <a href="/app/groups">
            <svg class="icon">
              <use href="/icons/receipt.svg#icon-back" />
            </svg>
            Back to Group
          </a>
        </p>
      </div>

      <main class="page">
        <div class="grid">
          <section class="card span-12">
            <h1>
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-user" />
              </svg>
              Alex
            </h1>
            <p>Member profile for Alex.</p>
          </section>

          <section class="card rule-top span-12">
            <h2>Receipts</h2>
            <ul>
              <li><a href="/app/receipt">Taqueria El Sol</a></li>
            </ul>
          </section>
        </div>
      </main>
    `}};Me.styles=x`
    :host {
      display: block;
      background-color: var(--color-bg-page);
      color: var(--color-text);
      font-family: var(--font-family-body);
      font-size: var(--font-size-1);
      line-height: var(--line-height-body);
    }
    h1,
    h2 {
      color: var(--color-accent);
      font-family: var(--font-family-display);
      line-height: var(--line-height-tight);
      margin: var(--space-2) 0 var(--space-1);
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
    .span-12 {
      grid-column: span 12;
    }
    .card {
      background-color: var(--color-card-bg);
      border: var(--border-1);
      border-radius: var(--radius-1);
      padding: var(--space-2) var(--space-3);
    }
    .rule-top {
      border-top: var(--border-thick);
      padding-top: var(--space-1);
    }
    ul {
      padding-left: var(--space-3);
    }
    a {
      color: var(--color-link);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `;let ne=Me;const je=class je extends w{render(){return g`
      <div class="title">
        <p><a href="/app/receipt">Back to receipt</a></p>
      </div>
      <main class="page">
        <section class="card">
          <h1>
            <svg class="icon">
              <use href="/icons/receipt.svg#icon-item" />
            </svg>
            Chicken Burrito
          </h1>
          <p>Shared by Alex, Sam</p>
          <p>See <a href="/app/price">$8.95</a> for price</p>
        </section>
      </main>
    `}};je.styles=x`
    :host {
      display: block;
      background-color: var(--color-bg-page);
      color: var(--color-text);
      font-family: var(--font-family-body);
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
    .card {
      background-color: var(--color-card-bg);
      border: var(--border-1);
      border-radius: var(--radius-1);
      padding: var(--space-2) var(--space-3);
    }
    .rule-top {
      border-top: var(--border-thick);
      padding-top: var(--space-1);
    }
    a {
      color: var(--color-link);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `;let ae=je;const ze=class ze extends w{render(){return g`
      <div class="title">
        <p><a href="/app/item">Back to item</a></p>
      </div>
      <main class="page">
        <section class="card">
          <h1>Price</h1>
          <p>This item costs $8.95.</p>
        </section>
      </main>
    `}};ze.styles=x`
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
  `;let ce=ze;const Le=class Le extends w{render(){return g`
      <div class="title">
        <p><a href="/app/receipt">Back to receipt</a></p>
      </div>
      <main class="page">
        <section class="card">
          <h1>Discount</h1>
          <p>No discounts applied.</p>
        </section>
      </main>
    `}};Le.styles=x`
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
  `;let le=Le;const Ie=class Ie extends w{render(){return g`
      <div class="title">
        <p><a href="/app/receipt">Back to receipt</a></p>
      </div>
      <main class="page">
        <section class="card">
          <h1>Tax</h1>
          <p>Tax for this receipt: $1.16</p>
        </section>
      </main>
    `}};Ie.styles=x`
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
  `;let he=Ie;const He=class He extends w{render(){return g`
      <div class="title">
        <p><a href="/app/receipt">Back to receipt</a></p>
      </div>
      <main class="page">
        <section class="card">
          <h1>Tip</h1>
          <p>Tip amount: $2.00</p>
        </section>
      </main>
    `}};He.styles=x`
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
  `;let de=He;const De=class De extends w{render(){return g`
      <div class="title">
        <p><a href="/app/receipt">Back to receipt</a></p>
      </div>
      <main class="page">
        <section class="card">
          <h1>Total</h1>
          <p>Total amount: $16.11</p>
        </section>
      </main>
    `}};De.styles=x`
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
  `;let pe=De;var vo=Object.defineProperty,mo=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&vo(t,e,s),s};const Be=class Be extends w{render(){return g`
      <div class="title"></div>

      <main class="page">
        <div class="grid">
          <section class="card span-12">
            <h2 class="icon-text">
              <svg class="icon" aria-hidden="true" focusable="false">
                <use href="/icons/receipt.svg#icon-house"></use>
              </svg>
              <span>Roommate Groups</span>
            </h2>
            <p>
              <a href="/app/groups" class="icon-text">
                <svg class="icon" aria-hidden="true" focusable="false">
                  <use href="/icons/receipt.svg#icon-plus"></use>
                </svg>
                <span>Create or Access a Group</span>
              </a>
            </p>
          </section>

          <section class="card rule-top span-12">
            <h2>Your Dashboard</h2>

            <h3>Open Tickets</h3>
            <sr-ticket-list user-id=${this.userId??""}></sr-ticket-list>
          </section>
        </div>
      </main>
    `}};Be.styles=x`
    /* Base "body" defaults mapped to host */
    :host {
      display: block;
      background-color: var(--color-bg-page);
      color: var(--color-text);
      font-family: var(--font-family-body);
      font-weight: var(--weight-regular);
      font-size: var(--font-size-1);
      line-height: var(--line-height-body);
    }

    /* Base resets remain (won't affect outer document but kept for reference) */
    html,
    body {
      margin: 0;
      padding: 0;
    }

    /* Body defaults */
    body {
      background-color: var(--color-bg-page);
      color: var(--color-text);
      font-family: var(--font-family-body);
      font-weight: var(--weight-regular);
      font-size: var(--font-size-1);
      line-height: var(--line-height-body);
    }

    /* Headings use display font */
    h1,
    h2,
    h3 {
      color: var(--color-accent);
      font-family: var(--font-family-display);
      line-height: var(--line-height-tight);
      margin: var(--space-2) 0 var(--space-1);
    }

    h1 {
      font-size: var(--font-size-4);
      font-weight: var(--weight-bold);
    }
    h2 {
      font-size: var(--font-size-3);
      font-weight: var(--weight-bold);
    }
    h3 {
      font-size: var(--font-size-2);
      font-weight: var(--weight-bold);
    }

    /* Links */
    a {
      color: var(--color-link);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

    /* Cards */
    .card {
      background-color: var(--color-card-bg);
      border: var(--border-1);
      border-radius: var(--radius-1);
      padding: var(--space-2) var(--space-3);
    }

    .props {
      display: grid;
      grid-template-columns: max-content 1fr;
      column-gap: var(--space-4);
      row-gap: var(--space-2);
    }
    .props dt {
      font-weight: 600;
      color: var(--color-accent);
    }
    .props dd {
      margin: 0;
    }

    .title {
      padding: var(--space-2) var(--space-3);
      margin: var(--space-2) 0;
    }

    .rule-top {
      border-top: var(--border-thick);
      padding-top: var(--space-1);
    }

    .icon-text {
      display: flex;
      flex-direction: row;
      gap: 0.5ch;
      align-items: center;
    }

    svg.icon {
      display: inline;
      height: 1em;
      width: 1em;
      vertical-align: text-bottom;
      fill: currentColor;
    }

    /* --- Header layout (kept in case header is rendered inside) --- */
    .app-header {
      position: sticky;
      top: 0;
      display: grid;
      grid-template-columns: auto auto 1fr; /* brand | toggle | nav fills remaining */
      align-items: center;
      gap: var(--space-4);
      height: var(--header-h);
      padding: var(--space-1) var(--space-3);
      background: var(--header-bg);
      color: var(--header-text);
      background-color: var(--color-bg-page);
    }

    .app-header .brand-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5ch;
      font-weight: 700;
    }

    .theme-toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.4ch;
      font-size: 0.95em;
      opacity: 0.9;
      justify-self: start;
    }

    .top-nav {
      display: flex;
      gap: var(--space-4);
      justify-self: end;
    }

    .app-header a {
      color: inherit;
      text-decoration: none;
    }

    /* Page container */
    .page {
      max-width: var(--container-max);
      margin: 0 var(--space-2);
    }

    /* 12-col grid */
    .grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: var(--space-4);
    }

    .span-12 {
      grid-column: span 12;
    }
    .span-9 {
      grid-column: span 9;
    }
    .span-8 {
      grid-column: span 8;
    }
    .span-6 {
      grid-column: span 6;
    }
    .span-4 {
      grid-column: span 4;
    }
    .span-3 {
      grid-column: span 3;
    }

    form {
      display: grid;
      gap: var(--space-3);
    }

    /* Stack label text and control */
    label {
      display: grid;
      gap: var(--space-1);
      color: var(--color-text);
      font-size: var(--font-size-1);
    }

    /* Optional helper text inside labels */
    label small,
    .form-hint {
      color: var(--color-muted, #6b7280);
      font-size: 0.9em;
    }

    /* Text inputs, selects, textareas */
    input[type="text"],
    input[type="email"],
    input[type="password"],
    input[type="search"],
    input[type="number"],
    input[type="url"],
    select,
    textarea {
      appearance: none;
      width: 100%;
      padding: 0.6rem 0.75rem;
      border: var(--border-1);
      border-radius: var(--radius-1);
      background: var(--color-card-bg);
      color: var(--color-text);
      line-height: 1.25;
      outline: none;
    }

    /* Focus state using accent color */
    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="password"]:focus,
    input[type="search"]:focus,
    input[type="number"]:focus,
    input[type="url"]:focus,
    select:focus,
    textarea:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px
        color-mix(in srgb, var(--color-accent) 35%, transparent);
    }

    /* Invalid state (if you add .is-invalid to the control) */
    .is-invalid {
      border-color: var(--color-error, #b00020);
      box-shadow: 0 0 0 2px
        color-mix(in srgb, var(--color-error, #b00020) 30%, transparent);
    }

    /* Buttons */
    button,
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5ch;
      padding: 0.55rem 0.9rem;
      font-weight: var(--weight-bold);
      border-radius: var(--radius-1);
      border: 1px solid transparent;
      background: var(--color-accent);
      color: var(--color-text-on-accent, #fff);
      cursor: pointer;
      text-decoration: none;
    }

    button:hover,
    .button:hover {
      filter: brightness(1.03);
    }

    button:disabled,
    .button[aria-disabled="true"] {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Secondary / outline style if needed */
    .button--outline {
      background: transparent;
      border-color: var(--color-accent);
      color: var(--color-accent);
    }
    .button--outline:hover {
      background: color-mix(
        in srgb,
        var(--color-accent) 10%,
        transparent
      );
    }

    /* Actions row under forms */
    .form-actions {
      display: flex;
      gap: var(--space-2);
      justify-content: flex-start;
    }

    /* Error message block */
    .form-error,
    .error {
      color: var(--color-error, #b00020);
      border: 1px solid var(--color-error, #b00020);
      background: color-mix(
        in srgb,
        var(--color-error, #b00020) 12%,
        transparent
      );
      padding: var(--space-2);
      border-radius: var(--radius-1);
    }

    @media (max-width: 1200px) {
      .grid {
        grid-template-columns: repeat(8, 1fr);
      }
      .span-9 {
        grid-column: span 8;
      }
      .span-8 {
        grid-column: span 8;
      }
      .span-6 {
        grid-column: span 4;
      } /* halves on 8-col */
      .span-4 {
        grid-column: span 4;
      }
      .span-3 {
        grid-column: span 4;
      } /* 3 -> ~4 on 8-col */
    }

    @media (max-width: 720px) {
      .app-header {
        grid-template-columns: 1fr 1fr;
        row-gap: var(--space-2);
        height: auto;
        padding: var(--space-4);
      }
      .top-nav {
        justify-content: end;
      }

      .grid {
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-4);
      }
      .span-12,
      .span-9,
      .span-8,
      .span-6,
      .span-4,
      .span-3 {
        grid-column: span 4;
      }

      .page {
        padding: var(--space-4);
      }

      form {
        gap: var(--space-2);
      }
      label {
        gap: 0.35rem;
      }
    }

    .theme-toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.5ch;
      font-size: 0.95em;
      opacity: 0.9;
    }

    .theme-toggle input {
      inline-size: 1.1em;
      block-size: 1.1em;
    }
  `;let mt=Be;mo([E({attribute:"user-id"})],mt.prototype,"userId");customElements.define("home-view",mt);var yo=Object.defineProperty,bo=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&yo(t,e,s),s};const qe=class qe extends w{constructor(){super(...arguments),this._auth=new O(this,"splitroom:auth")}connectedCallback(){super.connectedCallback(),this._auth.observe(t=>this._user=t.user)}get authorization(){return this._user?.authenticated&&{Authorization:`Bearer ${this._user.token}`}}render(){return g`
      <main class="page">
        <div class="grid">

          <section class="card span-12">
            <h1>
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-house" />
              </svg>
              House 1
            </h1>

            <h2>Members</h2>
            <ul>
              <li><a href="/app/groups">Alex</a></li>
              <li><a href="/app/groups">Sam</a></li>
              <li><a href="/app/groups">Jordan</a></li>
            </ul>
          </section>

          <section class="card rule-top span-6">
            <h2>
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-receipt" />
              </svg>
              Receipts
            </h2>
            <p>
              <a href="/app/groups">
                <svg class="icon">
                  <use href="/icons/receipt.svg#icon-plus" />
                </svg>
                Add a receipt
              </a>
            </p>
            <ul>
              <li><a href="/app/groups">Receipt — Taqueria El Sol</a></li>
            </ul>
          </section>

          <section class="card rule-top span-6">
            <h2>
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-trading" />
              </svg>
              Open Tickets
            </h2>

            <sr-ticket-list user-id=${this.userId??""}></sr-ticket-list>
          </section>

        </div>
      </main>
    `}};qe.styles=x`
    /* Base "body" defaults mapped to host */
    :host {
      display: block;
      background-color: var(--color-bg-page);
      color: var(--color-text);
      font-family: var(--font-family-body);
      font-weight: var(--weight-regular);
      font-size: var(--font-size-1);
      line-height: var(--line-height-body);
    }

    /* Headings use display font */
    h1,
    h2,
    h3 {
      color: var(--color-accent);
      font-family: var(--font-family-display);
      line-height: var(--line-height-tight);
      margin: var(--space-2) 0 var(--space-1);
    }
    h1 {
      font-size: var(--font-size-4);
      font-weight: var(--weight-bold);
    }
    h2 {
      font-size: var(--font-size-3);
      font-weight: var(--weight-bold);
    }
    h3 {
      font-size: var(--font-size-2);
      font-weight: var(--weight-bold);
    }

    /* Links */
    a {
      color: var(--color-link);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

    /* Cards */
    .card {
      background-color: var(--color-card-bg);
      border: var(--border-1);
      border-radius: var(--radius-1);
      padding: var(--space-2) var(--space-3);
    }

    .rule-top {
      border-top: var(--border-thick);
      padding-top: var(--space-1);
    }

    svg.icon {
      display: inline;
      height: 1em;
      width: 1em;
      fill: currentColor;
      vertical-align: text-bottom;
    }

    /* Page + Grid */
    .page {
      max-width: var(--container-max);
      margin: 0 var(--space-2);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: var(--space-4);
    }

    .span-12 {
      grid-column: span 12;
    }
    .span-6 {
      grid-column: span 6;
    }

    @media (max-width: 1200px) {
      .grid {
        grid-template-columns: repeat(8, 1fr);
      }
      .span-6 {
        grid-column: span 4;
      }
    }

    @media (max-width: 720px) {
      .grid {
        grid-template-columns: repeat(4, 1fr);
      }
      .span-12,
      .span-6 {
        grid-column: span 4;
      }
      .page {
        padding: var(--space-4);
      }
    }
  `;let yt=qe;bo([E({attribute:"user-id"})],yt.prototype,"userId");customElements.define("groups-view",yt);var _o=Object.defineProperty,$o=(i,t,e,r)=>{for(var s=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=n(t,e,s)||s);return s&&_o(t,e,s),s};const Fe=class Fe extends Ht{constructor(){super("splitroom:model"),this._auth=new O(this,"splitroom:auth"),this._authenticated=!1}connectedCallback(){super.connectedCallback(),this._auth.observe(t=>{this._authenticated=!!t.user?.authenticated,this._authenticated&&this.ticketId&&this.dispatchMessage(["ticket/request",{ticketid:this.ticketId}])})}attributeChangedCallback(t,e,r){super.attributeChangedCallback(t,e,r),t==="ticket-id"&&r&&r!==e&&this._authenticated&&this.dispatchMessage(["ticket/request",{ticketid:r}])}render(){const{ticket:t,loading:e,error:r}=this.model??{};if(e)return g`<p class="card">Loading…</p>`;if(r)return g`<p class="card">Failed to load: ${r}</p>`;const s=t;return s?g`
      <main class="page">
        <div class="grid">
          <div class="title span-12">
            <p>
              <a href="/app/groups">
                <svg class="icon">
                  <use href="/icons/receipt.svg#icon-back" />
                </svg>
                Back to Group
              </a>
            </p>
          </div>

          <section class="card span-12">
            <h1>
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-trading" />
              </svg>
              Ticket
            </h1>
            <p><strong>${s.from} → ${s.to}: $${Number(s.amount).toFixed(2)}</strong></p>
          </section>

          <section class="card rule-top span-12">
            <h2>Details</h2>
            <ul>
              <li>
                <a href="/app/groups">
                  <svg class="icon">
                    <use href="/icons/receipt.svg#icon-receipt" />
                  </svg>
                  Receipt
                </a>
              </li>
            </ul>

            <h3>Status</h3>
            <p>${s.status==="paid"?"Paid":"Open"}</p>

            <h3>Action</h3>
          </section>
        </div>
      </main>
    `:g`<p class="card">No ticket loaded.</p>`}};Fe.styles=x`
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
    h2,
    h3 {
      color: var(--color-accent);
      font-family: var(--font-family-display);
      line-height: var(--line-height-tight);
      margin: var(--space-2) 0 var(--space-1);
    }
    h1 {
      font-size: var(--font-size-4);
      font-weight: var(--weight-bold);
    }
    h2 {
      font-size: var(--font-size-3);
      font-weight: var(--weight-bold);
    }
    h3 {
      font-size: var(--font-size-2);
      font-weight: var(--weight-bold);
    }

    a {
      color: var(--color-link);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

    .card {
      background-color: var(--color-card-bg);
      border: var(--border-1);
      border-radius: var(--radius-1);
      padding: var(--space-2) var(--space-3);
    }

    .title {
      padding: var(--space-2) var(--space-3);
      margin: var(--space-2) 0;
    }

    .rule-top {
      border-top: var(--border-thick);
      padding-top: var(--space-1);
    }

    svg.icon {
      display: inline;
      height: 1em;
      width: 1em;
      vertical-align: text-bottom;
      fill: currentColor;
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

    .span-12 {
      grid-column: span 12;
    }

    @media (max-width: 1200px) {
      .grid {
        grid-template-columns: repeat(8, 1fr);
      }
      .span-12 {
        grid-column: span 8;
      }
    }

    @media (max-width: 720px) {
      .grid {
        grid-template-columns: repeat(4, 1fr);
      }
      .span-12 {
        grid-column: span 4;
      }
      .page {
        padding: var(--space-4);
      }
    }
  `;let Mt=Fe;$o([E({attribute:"ticket-id"})],Mt.prototype,"ticketId");const We=class We extends w{render(){return g`
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
    `}};We.styles=x`
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
  `;let ue=We;const wo=[{path:"/app/groups",view:()=>g`<groups-view></groups-view>`},{path:"/app/receipt",view:()=>g`<receipt-view></receipt-view>`},{path:"/app/member",view:()=>g`<member-view></member-view>`},{path:"/app/item",view:()=>g`<item-view></item-view>`},{path:"/app/price",view:()=>g`<price-view></price-view>`},{path:"/app/discount",view:()=>g`<discount-view></discount-view>`},{path:"/app/tax",view:()=>g`<tax-view></tax-view>`},{path:"/app/tip",view:()=>g`<tip-view></tip-view>`},{path:"/app/total",view:()=>g`<total-view></total-view>`},{path:"/app/profile/:id",view:i=>g`<profile-view user-id=${i.id}></profile-view>`},{path:"/app/tickets/:id",view:i=>g`<ticket-view ticket-id=${i.id}></ticket-view>`},{path:"/app",view:()=>g`<home-view></home-view>`},{path:"/login",view:()=>g`<login-view></login-view>`},{path:"/login.html",redirect:"/login"},{path:"/",redirect:"/app"}];ki({"mu-auth":jt.Provider,"mu-history":Ts.Provider,"mu-store":po,"sr-header":vt,"login-form":B,"home-view":mt,"groups-view":yt,"ticket-view":Mt,"login-view":ue,"profile-view":Ut,"receipt-view":oe,"member-view":ne,"item-view":ae,"price-view":ce,"discount-view":le,"tax-view":he,"tip-view":de,"total-view":pe,"sr-ticket":N,"sr-ticket-list":Nt,"mu-switch":class extends xi.Element{constructor(){super(wo,"splitroom:history","splitroom:auth")}}});
