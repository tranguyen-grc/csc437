(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();var K,Me;class ut extends Error{}ut.prototype.name="InvalidTokenError";function rs(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let r=e.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}function ss(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return rs(t)}catch{return atob(t)}}function hr(i,t){if(typeof i!="string")throw new ut("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,r=i.split(".")[e];if(typeof r!="string")throw new ut(`Invalid token specified: missing part #${e+1}`);let s;try{s=ss(r)}catch(n){throw new ut(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(s)}catch(n){throw new ut(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const is="mu:context",ee=`${is}:change`;class ns{constructor(t,e){this._proxy=os(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ce extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new ns(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ee,t),t}detach(t){this.removeEventListener(ee,t)}}function os(i,t){return new Proxy(i,{get:(r,s,n)=>s==="then"?void 0:Reflect.get(r,s,n),set:(r,s,n,o)=>{const c=i[s];console.log(`Context['${s.toString()}'] <= `,n);const a=Reflect.set(r,s,n,o);if(a){let d=new CustomEvent(ee,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:s,oldValue:c,value:n}),t.dispatchEvent(d)}else console.log(`Context['${s}] was not set to ${n}`);return a}})}function as(i,t){const e=ur(t,i);return new Promise((r,s)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>r(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function ur(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const r=t.closest(e);if(r)return r;const s=t.getRootNode();if(s instanceof ShadowRoot)return ur(i,s.host)}class cs extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function dr(i="mu:message"){return(t,...e)=>t.dispatchEvent(new cs(e,i))}class le{constructor(t,e,r="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=r,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const r=e.detail;this.consume(r)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${t[0]} message`,t);const e=this._update(t,this._context.value);if(console.log(`Next[${t[0]}] => `,e),!Array.isArray(e))this._context.value=e;else{const[r,...s]=e;this._context.value=r,s.forEach(n=>n.then(o=>{o.length&&this.consume(o)}))}}}const re="mu:auth:jwt",pr=class fr extends le{constructor(t,e){super((r,s)=>this.update(r,s),t,fr.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":{const{token:s,redirect:n}=t[1];return[hs(s),Qt(n)]}case"auth/signout":return[us(e.user),Qt(this._redirectForLogin)];case"auth/redirect":return[e,Qt(this._redirectForLogin,{next:window.location.href})];default:const r=t[0];throw new Error(`Unhandled Auth message "${r}"`)}}};pr.EVENT_TYPE="auth:message";let gr=pr;const mr=dr(gr.EVENT_TYPE);function Qt(i,t){return new Promise((e,r)=>{if(i){const s=window.location.href,n=new URL(i,s);t&&Object.entries(t).forEach(([o,c])=>n.searchParams.set(o,c)),console.log("Redirecting to ",i),window.location.assign(n)}e([])})}class ls extends ce{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=et.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new gr(this.context,this.redirect).attach(this)}}class tt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(re),t}}class et extends tt{constructor(t){super();const e=hr(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new et(t);return localStorage.setItem(re,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(re);return t?et.authenticate(t):new tt}}function hs(i){return{user:et.authenticate(i),token:i}}function us(i){return{user:i&&i.authenticated?tt.deauthenticate(i):i,token:""}}function ds(i){return i&&i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function ps(i){return i.authenticated?hr(i.token||""):{}}const j=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:et,Provider:ls,User:tt,dispatch:mr,headers:ds,payload:ps},Symbol.toStringTag,{value:"Module"}));function vr(i,t,e){const r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});i.dispatchEvent(r)}function Ot(i,t,e){const r=i.target;vr(r,t,e)}function se(i,t="*"){return i.composedPath().find(s=>{const n=s;return n.tagName&&n.matches(t)})||void 0}const fs=Object.freeze(Object.defineProperty({__proto__:null,dispatchCustom:vr,originalTarget:se,relay:Ot},Symbol.toStringTag,{value:"Module"}));function Ht(i,...t){const e=i.map((s,n)=>n?[t[n-1],s]:[s]).flat().join("");let r=new CSSStyleSheet;return r.replaceSync(e),r}const gs=new DOMParser;function E(i,...t){const e=t.map(c),r=i.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),s=gs.parseFromString(r,"text/html"),n=s.head.childElementCount?s.head.children:s.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u?.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function c(a,d){if(a===null)return"";switch(typeof a){case"string":return je(a);case"bigint":case"boolean":case"number":case"symbol":return je(a.toString());case"object":if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(c);return f.replaceChildren(...u),f}return a instanceof Node?a:new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function je(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Dt(i,t={mode:"open"}){const e=i.attachShadow(t),r={template:s,styles:n};return r;function s(o){const c=o.firstElementChild,a=c&&c.tagName==="TEMPLATE"?c:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),r}function n(...o){e.adoptedStyleSheets=o}}let ms=(K=class extends HTMLElement{constructor(){super(),this._state={},Dt(this).template(K.template).styles(K.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,r=t.value;e&&(this._state[e]=r)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Ot(i,"mu-form:submit",this._state)}),this.submitSlot&&this.submitSlot.addEventListener("slotchange",()=>{var i,t;for(const e of((i=this.submitSlot)==null?void 0:i.assignedNodes())||[])(t=this.form)==null||t.insertBefore(e,this.submitSlot)})}set init(i){this._state=i||{},vs(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}get submitSlot(){var i;const t=(i=this.shadowRoot)==null?void 0:i.querySelector('slot[name="submit"]');return t||null}},K.template=E`
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
  `,K.styles=Ht`
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
  `,K);function vs(i,t){const e=Object.entries(i);for(const[r,s]of e){const n=t.querySelector(`[name="${r}"]`);if(n){const o=n;switch(o.type){case"checkbox":const c=o;c.checked=!!s;break;case"date":s instanceof Date?o.value=s.toISOString().substr(0,10):o.value=s;break;default:o.value=s;break}}}return i}const ys=Object.freeze(Object.defineProperty({__proto__:null,Element:ms},Symbol.toStringTag,{value:"Module"})),yr=class br extends le{constructor(t){super((e,r)=>this.update(e,r),t,br.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:r,state:s}=t[1];return _s(r,s)}case"history/redirect":{const{href:r,state:s}=t[1];return $s(r,s)}}}};yr.EVENT_TYPE="history:message";let he=yr;class Ie extends ce{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=bs(t);if(e){const r=new URL(e.href);r.origin===this.context.value.location.origin&&(!this._root||r.pathname.startsWith(this._root))&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ue(e,"history/navigate",{href:r.pathname+r.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new he(this.context).attach(this),this._root=this.getAttribute("root")||void 0}}function bs(i){const t=i.currentTarget,e=r=>r.tagName=="A"&&r.href;if(i.button===0)if(i.composed){const s=i.composedPath().find(e);return s||void 0}else{for(let r=i.target;r;r===t?null:r.parentElement)if(e(r))return r;return}}function _s(i,t={}){return history.pushState(t,"",i),{location:document.location,state:history.state}}function $s(i,t={}){return history.replaceState(t,"",i),{location:document.location,state:history.state}}const ue=dr(he.EVENT_TYPE),de=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ie,Provider:Ie,Service:he,dispatch:ue},Symbol.toStringTag,{value:"Module"}));class T{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,r)=>{if(this._provider){const s=new Le(this._provider,t);this._effects.push(s),e(s)}else as(this._target,this._contextLabel).then(s=>{const n=new Le(s,t);this._provider=s,this._effects.push(n),s.attach(o=>this._handleChange(o)),e(n)}).catch(s=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Le{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const _r=class $r extends HTMLElement{constructor(){super(),this._state={},this._user=new tt,this._authObserver=new T(this,"blazing:auth"),Dt(this).template($r.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",r=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;ws(s,this._state,e,this.authorization).then(n=>at(n,this)).then(n=>{const o=`mu-rest-form:${r}`,c=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[r]:n,url:s}});this.dispatchEvent(c)}).catch(n=>{const o="mu-rest-form:error",c=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:s,request:this._state}});this.dispatchEvent(c)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const r=e.name,s=e.value;r&&(this._state[r]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},at(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&ze(this.src,this.authorization).then(e=>{this._state=e,at(e,this)}))})}attributeChangedCallback(t,e,r){switch(t){case"src":this.src&&r&&r!==e&&!this.isNew&&ze(this.src,this.authorization).then(s=>{this._state=s,at(s,this)});break;case"new":r&&(this._state={},at({},this));break}}};_r.observedAttributes=["src","new","action"];_r.template=E`
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
  `;function ze(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function at(i,t){const e=Object.entries(i);for(const[r,s]of e){const n=t.querySelector(`[name="${r}"]`);if(n){const o=n;switch(o.type){case"checkbox":const c=o;c.checked=!!s;break;default:o.value=s;break}}}return i}function ws(i,t,e="PUT",r={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...r},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()})}const wr=class xr extends le{constructor(t,e){super(e,t,xr.EVENT_TYPE,!1)}};wr.EVENT_TYPE="mu:message";let Ar=wr;class xs extends ce{constructor(t,e,r){super(e),this._user=new tt,this._updateFn=t,this._authObserver=new T(this,r)}connectedCallback(){const t=new Ar(this.context,(e,r)=>this._updateFn(e,r,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const As=Object.freeze(Object.defineProperty({__proto__:null,Provider:xs,Service:Ar},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,pe=Pt.ShadowRoot&&(Pt.ShadyCSS===void 0||Pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,fe=Symbol(),He=new WeakMap;let Er=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==fe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(pe&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=He.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&He.set(e,t))}return t}toString(){return this.cssText}};const Es=i=>new Er(typeof i=="string"?i:i+"",void 0,fe),Ss=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new Er(e,i,fe)},ks=(i,t)=>{if(pe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=Pt.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},De=pe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return Es(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ps,defineProperty:Cs,getOwnPropertyDescriptor:Os,getOwnPropertyNames:Ts,getOwnPropertySymbols:Ns,getPrototypeOf:Rs}=Object,rt=globalThis,qe=rt.trustedTypes,Us=qe?qe.emptyScript:"",Fe=rt.reactiveElementPolyfillSupport,dt=(i,t)=>i,Tt={toAttribute(i,t){switch(t){case Boolean:i=i?Us:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ge=(i,t)=>!Ps(i,t),Be={attribute:!0,type:String,converter:Tt,reflect:!1,useDefault:!1,hasChanged:ge};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),rt.litPropertyMetadata??(rt.litPropertyMetadata=new WeakMap);let Z=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Be){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Cs(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:n}=Os(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){const c=s?.call(this);n?.call(this,o),this.requestUpdate(t,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Be}static _$Ei(){if(this.hasOwnProperty(dt("elementProperties")))return;const t=Rs(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(dt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(dt("properties"))){const e=this.properties,r=[...Ts(e),...Ns(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(De(s))}else t!==void 0&&e.push(De(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ks(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){var r;const s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){const o=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:Tt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var r,s;const n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const c=n.getPropertyOptions(o),a=typeof c.converter=="function"?{fromAttribute:c.converter}:((r=c.converter)==null?void 0:r.fromAttribute)!==void 0?c.converter:Tt;this._$Em=o,this[o]=a.fromAttribute(e,c.type)??((s=this._$Ej)==null?void 0:s.get(o))??null,this._$Em=null}}requestUpdate(t,e,r){var s;if(t!==void 0){const n=this.constructor,o=this[t];if(r??(r=n.getPropertyOptions(t)),!((r.hasChanged??ge)(o,e)||r.useDefault&&r.reflect&&o===((s=this._$Ej)==null?void 0:s.get(t))&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:n},o){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s){const{wrapped:c}=o,a=this[n];c!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(t=this._$EO)==null||t.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(r)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};Z.elementStyles=[],Z.shadowRootOptions={mode:"open"},Z[dt("elementProperties")]=new Map,Z[dt("finalized")]=new Map,Fe?.({ReactiveElement:Z}),(rt.reactiveElementVersions??(rt.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Nt=globalThis,Rt=Nt.trustedTypes,Ve=Rt?Rt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Sr="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,kr="?"+R,Ms=`<${kr}>`,B=document,ft=()=>B.createComment(""),gt=i=>i===null||typeof i!="object"&&typeof i!="function",me=Array.isArray,js=i=>me(i)||typeof i?.[Symbol.iterator]=="function",Xt=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,We=/-->/g,Je=/>/g,H=RegExp(`>|${Xt}(?:([^\\s"'>=/]+)(${Xt}*=${Xt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ye=/'/g,Ke=/"/g,Pr=/^(?:script|style|textarea|title)$/i,Is=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),lt=Is(1),st=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ge=new WeakMap,q=B.createTreeWalker(B,129);function Cr(i,t){if(!me(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ve!==void 0?Ve.createHTML(t):t}const Ls=(i,t)=>{const e=i.length-1,r=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=ct;for(let c=0;c<e;c++){const a=i[c];let d,f,u=-1,l=0;for(;l<a.length&&(o.lastIndex=l,f=o.exec(a),f!==null);)l=o.lastIndex,o===ct?f[1]==="!--"?o=We:f[1]!==void 0?o=Je:f[2]!==void 0?(Pr.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=H):f[3]!==void 0&&(o=H):o===H?f[0]===">"?(o=s??ct,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?H:f[3]==='"'?Ke:Ye):o===Ke||o===Ye?o=H:o===We||o===Je?o=ct:(o=H,s=void 0);const h=o===H&&i[c+1].startsWith("/>")?" ":"";n+=o===ct?a+Ms:u>=0?(r.push(d),a.slice(0,u)+Sr+a.slice(u)+R+h):a+R+(u===-2?c:h)}return[Cr(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};let ie=class Or{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0;const c=t.length-1,a=this.parts,[d,f]=Ls(t,e);if(this.el=Or.createElement(d,r),q.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=q.nextNode())!==null&&a.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(Sr)){const l=f[o++],h=s.getAttribute(u).split(R),p=/([.?@])?(.*)/.exec(l);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Hs:p[1]==="?"?Ds:p[1]==="@"?qs:qt}),s.removeAttribute(u)}else u.startsWith(R)&&(a.push({type:6,index:n}),s.removeAttribute(u));if(Pr.test(s.tagName)){const u=s.textContent.split(R),l=u.length-1;if(l>0){s.textContent=Rt?Rt.emptyScript:"";for(let h=0;h<l;h++)s.append(u[h],ft()),q.nextNode(),a.push({type:2,index:++n});s.append(u[l],ft())}}}else if(s.nodeType===8)if(s.data===kr)a.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(R,u+1))!==-1;)a.push({type:7,index:n}),u+=R.length-1}n++}}static createElement(t,e){const r=B.createElement("template");return r.innerHTML=t,r}};function it(i,t,e=i,r){var s,n;if(t===st)return t;let o=r!==void 0?(s=e._$Co)==null?void 0:s[r]:e._$Cl;const c=gt(t)?void 0:t._$litDirective$;return o?.constructor!==c&&((n=o?._$AO)==null||n.call(o,!1),c===void 0?o=void 0:(o=new c(i),o._$AT(i,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=o:e._$Cl=o),o!==void 0&&(t=it(i,o._$AS(i,t.values),o,r)),t}let zs=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??B).importNode(e,!0);q.currentNode=s;let n=q.nextNode(),o=0,c=0,a=r[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new ve(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Fs(n,this,t)),this._$AV.push(d),a=r[++c]}o!==a?.index&&(n=q.nextNode(),o++)}return q.currentNode=B,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},ve=class Tr{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=it(this,t,e),gt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==st&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):js(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&gt(this._$AH)?this._$AA.nextSibling.data=t:this.T(B.createTextNode(t)),this._$AH=t}$(t){var e;const{values:r,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=ie.createElement(Cr(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(r);else{const o=new zs(n,this),c=o.u(this.options);o.p(r),this.T(c),this._$AH=o}}_$AC(t){let e=Ge.get(t.strings);return e===void 0&&Ge.set(t.strings,e=new ie(t)),e}k(t){me(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const n of t)s===e.length?e.push(r=new Tr(this.O(ft()),this.O(ft()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},qt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=_}_$AI(t,e=this,r,s){const n=this.strings;let o=!1;if(n===void 0)t=it(this,t,e,0),o=!gt(t)||t!==this._$AH&&t!==st,o&&(this._$AH=t);else{const c=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=it(this,c[r+a],e,a),d===st&&(d=this._$AH[a]),o||(o=!gt(d)||d!==this._$AH[a]),d===_?t=_:t!==_&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Hs=class extends qt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}},Ds=class extends qt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}},qs=class extends qt{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=it(this,t,e,0)??_)===st)return;const r=this._$AH,s=t===_&&r!==_||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==_&&(r===_||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},Fs=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){it(this,t)}};const Ze=Nt.litHtmlPolyfillSupport;Ze?.(ie,ve),(Nt.litHtmlVersions??(Nt.litHtmlVersions=[])).push("3.3.0");const Bs=(i,t,e)=>{const r=e?.renderBefore??t;let s=r._$litPart$;if(s===void 0){const n=e?.renderBefore??null;r._$litPart$=s=new ve(t.insertBefore(ft(),n),n,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mt=globalThis;let X=class extends Z{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Bs(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return st}};X._$litElement$=!0,X.finalized=!0,(Me=mt.litElementHydrateSupport)==null||Me.call(mt,{LitElement:X});const Qe=mt.litElementPolyfillSupport;Qe?.({LitElement:X});(mt.litElementVersions??(mt.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Vs={attribute:!0,type:String,converter:Tt,reflect:!1,hasChanged:ge},Ws=(i=Vs,t,e)=>{const{kind:r,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),r==="accessor"){const{name:o}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(o,a,i)},init(c){return c!==void 0&&this.C(o,void 0,i,c),c}}}if(r==="setter"){const{name:o}=e;return function(c){const a=this[o];t.call(this,c),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+r)};function Nr(i){return(t,e)=>typeof e=="object"?Ws(i,t,e):((r,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Rr(i){return Nr({...i,state:!0,attribute:!1})}function Js(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Ys(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ur={};(function(i){var t=(function(){var e=function(u,l,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=l);return h},r=[1,9],s=[1,10],n=[1,11],o=[1,12],c=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(l,h,p,g,m,v,Jt){var x=v.length-1;switch(m){case 1:return new g.Root({},[v[x-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[v[x-1],v[x]]);break;case 4:case 5:this.$=v[x];break;case 6:this.$=new g.Literal({value:v[x]});break;case 7:this.$=new g.Splat({name:v[x]});break;case 8:this.$=new g.Param({name:v[x]});break;case 9:this.$=new g.Optional({},[v[x-1]]);break;case 10:this.$=l;break;case 11:case 12:this.$=l.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},{1:[2,2]},e(c,[2,4]),e(c,[2,5]),e(c,[2,6]),e(c,[2,7]),e(c,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},e(c,[2,10]),e(c,[2,11]),e(c,[2,12]),{1:[2,1]},e(c,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:r,12:[1,16],13:s,14:n,15:o},e(c,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(l,h){if(h.recoverable)this.trace(l);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(l,h)}},parse:function(l){var h=this,p=[0],g=[null],m=[],v=this.table,Jt="",x=0,Ne=0,Qr=2,Re=1,Xr=m.slice.call(arguments,1),b=Object.create(this.lexer),L={yy:{}};for(var Yt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Yt)&&(L.yy[Yt]=this.yy[Yt]);b.setInput(l,L.yy),L.yy.lexer=b,L.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var Kt=b.yylloc;m.push(Kt);var ts=b.options&&b.options.ranges;typeof L.yy.parseError=="function"?this.parseError=L.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var es=function(){var Y;return Y=b.lex()||Re,typeof Y!="number"&&(Y=h.symbols_[Y]||Y),Y},w,z,A,Gt,J={},St,O,Ue,kt;;){if(z=p[p.length-1],this.defaultActions[z]?A=this.defaultActions[z]:((w===null||typeof w>"u")&&(w=es()),A=v[z]&&v[z][w]),typeof A>"u"||!A.length||!A[0]){var Zt="";kt=[];for(St in v[z])this.terminals_[St]&&St>Qr&&kt.push("'"+this.terminals_[St]+"'");b.showPosition?Zt="Parse error on line "+(x+1)+`:
`+b.showPosition()+`
Expecting `+kt.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Zt="Parse error on line "+(x+1)+": Unexpected "+(w==Re?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Zt,{text:b.match,token:this.terminals_[w]||w,line:b.yylineno,loc:Kt,expected:kt})}if(A[0]instanceof Array&&A.length>1)throw new Error("Parse Error: multiple actions possible at state: "+z+", token: "+w);switch(A[0]){case 1:p.push(w),g.push(b.yytext),m.push(b.yylloc),p.push(A[1]),w=null,Ne=b.yyleng,Jt=b.yytext,x=b.yylineno,Kt=b.yylloc;break;case 2:if(O=this.productions_[A[1]][1],J.$=g[g.length-O],J._$={first_line:m[m.length-(O||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(O||1)].first_column,last_column:m[m.length-1].last_column},ts&&(J._$.range=[m[m.length-(O||1)].range[0],m[m.length-1].range[1]]),Gt=this.performAction.apply(J,[Jt,Ne,x,L.yy,A[1],g,m].concat(Xr)),typeof Gt<"u")return Gt;O&&(p=p.slice(0,-1*O*2),g=g.slice(0,-1*O),m=m.slice(0,-1*O)),p.push(this.productions_[A[1]][0]),g.push(J.$),m.push(J._$),Ue=v[p[p.length-2]][p[p.length-1]],p.push(Ue);break;case 3:return!0}}return!0}},d=(function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(l,h){return this.yy=h||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var h=l.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},unput:function(l){var h=l.length,p=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(l){this.unput(this.match.slice(l))},pastInput:function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var l=this.pastInput(),h=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+h+"^"},test_match:function(l,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=l[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in m)this[v]=m[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),v=0;v<m.length;v++)if(p=this._input.match(this.rules[m[v]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=v,this.options.backtrack_lexer){if(l=this.test_match(p,m[v]),l!==!1)return l;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(l=this.test_match(h,m[g]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u})();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f})();typeof Ys<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Ur);function G(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Mr={Root:G("Root"),Concat:G("Concat"),Literal:G("Literal"),Splat:G("Splat"),Param:G("Param"),Optional:G("Optional")},jr=Ur.parser;jr.yy=Mr;var Ks=jr,Gs=Object.keys(Mr);function Zs(i){return Gs.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Ir=Zs,Qs=Ir,Xs=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Lr(i){this.captures=i.captures,this.re=i.re}Lr.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(r,s){typeof t[s+1]>"u"?e[r]=void 0:e[r]=decodeURIComponent(t[s+1])}),e};var ti=Qs({Concat:function(i){return i.children.reduce((function(t,e){var r=this.visit(e);return{re:t.re+r.re,captures:t.captures.concat(r.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Xs,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Lr({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),ei=ti,ri=Ir,si=ri({Concat:function(i,t){var e=i.children.map((function(r){return this.visit(r,t)}).bind(this));return e.some(function(r){return r===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),ii=si,ni=Ks,oi=ei,ai=ii;xt.prototype=Object.create(null);xt.prototype.match=function(i){var t=oi.visit(this.ast),e=t.match(i);return e||!1};xt.prototype.reverse=function(i){return ai.visit(this.ast,i)};function xt(i){var t;if(this?t=this:t=Object.create(xt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=ni.parse(i),t}var ci=xt,li=ci,hi=li;const ui=Js(hi);var di=Object.defineProperty,zr=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&di(t,e,s),s};const Hr=class extends X{constructor(t,e,r=""){super(),this._cases=[],this._fallback=()=>lt` <h1>Not Found</h1> `,this._cases=t.map(s=>({...s,route:new ui(s.path)})),this._historyObserver=new T(this,e),this._authObserver=new T(this,r)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),lt` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(mr(this,"auth/redirect"),lt` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):lt` <h1>Authenticating</h1> `;if("redirect"in e){const r=e.redirect;if(typeof r=="string")return this.redirect(r),lt` <h1>Redirecting to ${r}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:r}=t,s=new URLSearchParams(e),n=r+e;for(const o of this._cases){const c=o.route.match(n);if(c)return{...o,path:r,params:c,query:s}}}redirect(t){ue(this,"history/redirect",{href:t})}};Hr.styles=Ss`
    :host,
    main {
      display: contents;
    }
  `;let Ut=Hr;zr([Rr()],Ut.prototype,"_user");zr([Rr()],Ut.prototype,"_match");const pi=Object.freeze(Object.defineProperty({__proto__:null,Element:Ut,Switch:Ut},Symbol.toStringTag,{value:"Module"})),Dr=class ne extends HTMLElement{constructor(){if(super(),Dt(this).template(ne.template).styles(ne.styles),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Dr.template=E` <template>
    <slot name="actuator"><button>Menu</button></slot>
    <div id="panel">
      <slot></slot>
    </div>
  </template>`;Dr.styles=Ht`
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
  `;const qr=class oe extends HTMLElement{constructor(){super(),this._array=[],Dt(this).template(oe.template).styles(oe.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Fr("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const r=new Event("change",{bubbles:!0}),s=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=s,this.dispatchEvent(r)}}}),this.addEventListener("click",t=>{se(t,"button.add")?Ot(t,"input-array:add"):se(t,"button.remove")&&Ot(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],fi(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const r=Array.from(this.children).indexOf(e);this._array.splice(r,1),e.remove()}}};qr.template=E`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;qr.styles=Ht`
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
  `;function fi(i,t){t.replaceChildren(),i.forEach((e,r)=>t.append(Fr(e)))}function Fr(i,t){const e=i===void 0?E`<input />`:E`<input value="${i}" />`;return E`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Br(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var gi=Object.defineProperty,mi=Object.getOwnPropertyDescriptor,vi=(i,t,e,r)=>{for(var s=mi(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&gi(t,e,s),s};class Ft extends X{constructor(t){super(),this._pending=[],this._observer=new T(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([r,s])=>{console.log("Dispatching queued event",s,r),r.dispatchEvent(s)}),e.setEffect(()=>{var r;if(console.log("View effect",this,e,(r=this._context)==null?void 0:r.value),this._context)console.log("requesting update"),this.requestUpdate(),this._lastModel=this._context.value;else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const r=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",r),e.dispatchEvent(r)):(console.log("Queueing message event",r),this._pending.push([e,r]))}ref(t){return this.model?this.model[t]:void 0}}vi([Nr()],Ft.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=globalThis,ye=Ct.ShadowRoot&&(Ct.ShadyCSS===void 0||Ct.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,be=Symbol(),Xe=new WeakMap;let Vr=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==be)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ye&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=Xe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Xe.set(e,t))}return t}toString(){return this.cssText}};const yi=i=>new Vr(typeof i=="string"?i:i+"",void 0,be),N=(i,...t)=>{const e=i.length===1?i[0]:t.reduce(((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1]),i[0]);return new Vr(e,i,be)},bi=(i,t)=>{if(ye)i.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const e of t){const r=document.createElement("style"),s=Ct.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},tr=ye?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return yi(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:_i,defineProperty:$i,getOwnPropertyDescriptor:wi,getOwnPropertyNames:xi,getOwnPropertySymbols:Ai,getPrototypeOf:Ei}=Object,Bt=globalThis,er=Bt.trustedTypes,Si=er?er.emptyScript:"",ki=Bt.reactiveElementPolyfillSupport,pt=(i,t)=>i,Mt={toAttribute(i,t){switch(t){case Boolean:i=i?Si:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},_e=(i,t)=>!_i(i,t),rr={attribute:!0,type:String,converter:Mt,reflect:!1,useDefault:!1,hasChanged:_e};Symbol.metadata??=Symbol("metadata"),Bt.litPropertyMetadata??=new WeakMap;let Q=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=rr){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&$i(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:n}=wi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){const c=s?.call(this);n?.call(this,o),this.requestUpdate(t,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??rr}static _$Ei(){if(this.hasOwnProperty(pt("elementProperties")))return;const t=Ei(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(pt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(pt("properties"))){const e=this.properties,r=[...xi(e),...Ai(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(tr(s))}else t!==void 0&&e.push(tr(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return bi(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const n=(r.converter?.toAttribute!==void 0?r.converter:Mt).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const n=r.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Mt;this._$Em=s;const c=o.fromAttribute(e,n.type);this[s]=c??this._$Ej?.get(s)??c,this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){const s=this.constructor,n=this[t];if(r??=s.getPropertyOptions(t),!((r.hasChanged??_e)(n,e)||r.useDefault&&r.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:n},o){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[s,n]of r){const{wrapped:o}=n,c=this[s];o!==!0||this._$AL.has(s)||c===void 0||this.C(s,void 0,n,c)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((r=>r.hostUpdate?.())),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[pt("elementProperties")]=new Map,Q[pt("finalized")]=new Map,ki?.({ReactiveElement:Q}),(Bt.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $e=globalThis,jt=$e.trustedTypes,sr=jt?jt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Wr="$lit$",U=`lit$${Math.random().toFixed(9).slice(2)}$`,Jr="?"+U,Pi=`<${Jr}>`,V=document,vt=()=>V.createComment(""),yt=i=>i===null||typeof i!="object"&&typeof i!="function",we=Array.isArray,Ci=i=>we(i)||typeof i?.[Symbol.iterator]=="function",te=`[ 	
\f\r]`,ht=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ir=/-->/g,nr=/>/g,D=RegExp(`>|${te}(?:([^\\s"'>=/]+)(${te}*=${te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),or=/'/g,ar=/"/g,Yr=/^(?:script|style|textarea|title)$/i,Oi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),y=Oi(1),nt=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),cr=new WeakMap,F=V.createTreeWalker(V,129);function Kr(i,t){if(!we(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return sr!==void 0?sr.createHTML(t):t}const Ti=(i,t)=>{const e=i.length-1,r=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=ht;for(let c=0;c<e;c++){const a=i[c];let d,f,u=-1,l=0;for(;l<a.length&&(o.lastIndex=l,f=o.exec(a),f!==null);)l=o.lastIndex,o===ht?f[1]==="!--"?o=ir:f[1]!==void 0?o=nr:f[2]!==void 0?(Yr.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=D):f[3]!==void 0&&(o=D):o===D?f[0]===">"?(o=s??ht,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?D:f[3]==='"'?ar:or):o===ar||o===or?o=D:o===ir||o===nr?o=ht:(o=D,s=void 0);const h=o===D&&i[c+1].startsWith("/>")?" ":"";n+=o===ht?a+Pi:u>=0?(r.push(d),a.slice(0,u)+Wr+a.slice(u)+U+h):a+U+(u===-2?c:h)}return[Kr(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class bt{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0;const c=t.length-1,a=this.parts,[d,f]=Ti(t,e);if(this.el=bt.createElement(d,r),F.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=F.nextNode())!==null&&a.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(Wr)){const l=f[o++],h=s.getAttribute(u).split(U),p=/([.?@])?(.*)/.exec(l);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Ri:p[1]==="?"?Ui:p[1]==="@"?Mi:Vt}),s.removeAttribute(u)}else u.startsWith(U)&&(a.push({type:6,index:n}),s.removeAttribute(u));if(Yr.test(s.tagName)){const u=s.textContent.split(U),l=u.length-1;if(l>0){s.textContent=jt?jt.emptyScript:"";for(let h=0;h<l;h++)s.append(u[h],vt()),F.nextNode(),a.push({type:2,index:++n});s.append(u[l],vt())}}}else if(s.nodeType===8)if(s.data===Jr)a.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(U,u+1))!==-1;)a.push({type:7,index:n}),u+=U.length-1}n++}}static createElement(t,e){const r=V.createElement("template");return r.innerHTML=t,r}}function ot(i,t,e=i,r){if(t===nt)return t;let s=r!==void 0?e._$Co?.[r]:e._$Cl;const n=yt(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??=[])[r]=s:e._$Cl=s),s!==void 0&&(t=ot(i,s._$AS(i,t.values),s,r)),t}class Ni{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??V).importNode(e,!0);F.currentNode=s;let n=F.nextNode(),o=0,c=0,a=r[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new At(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new ji(n,this,t)),this._$AV.push(d),a=r[++c]}o!==a?.index&&(n=F.nextNode(),o++)}return F.currentNode=V,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class At{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ot(this,t,e),yt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==nt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ci(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&yt(this._$AH)?this._$AA.nextSibling.data=t:this.T(V.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=bt.createElement(Kr(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{const n=new Ni(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=cr.get(t.strings);return e===void 0&&cr.set(t.strings,e=new bt(t)),e}k(t){we(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const n of t)s===e.length?e.push(r=new At(this.O(vt()),this.O(vt()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class Vt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=$}_$AI(t,e=this,r,s){const n=this.strings;let o=!1;if(n===void 0)t=ot(this,t,e,0),o=!yt(t)||t!==this._$AH&&t!==nt,o&&(this._$AH=t);else{const c=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=ot(this,c[r+a],e,a),d===nt&&(d=this._$AH[a]),o||=!yt(d)||d!==this._$AH[a],d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ri extends Vt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Ui extends Vt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Mi extends Vt{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=ot(this,t,e,0)??$)===nt)return;const r=this._$AH,s=t===$&&r!==$||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==$&&(r===$||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ji{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){ot(this,t)}}const Ii=$e.litHtmlPolyfillSupport;Ii?.(bt,At),($e.litHtmlVersions??=[]).push("3.3.1");const Li=(i,t,e)=>{const r=e?.renderBefore??t;let s=r._$litPart$;if(s===void 0){const n=e?.renderBefore??null;r._$litPart$=s=new At(t.insertBefore(vt(),n),n,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xe=globalThis;class C extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Li(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return nt}}C._$litElement$=!0,C.finalized=!0,xe.litElementHydrateSupport?.({LitElement:C});const zi=xe.litElementPolyfillSupport;zi?.({LitElement:C});(xe.litElementVersions??=[]).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Hi={attribute:!0,type:String,converter:Mt,reflect:!1,hasChanged:_e},Di=(i=Hi,t,e)=>{const{kind:r,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),r==="accessor"){const{name:o}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(o,a,i)},init(c){return c!==void 0&&this.C(o,void 0,i,c),c}}}if(r==="setter"){const{name:o}=e;return function(c){const a=this[o];t.call(this,c),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+r)};function S(i){return(t,e)=>typeof e=="object"?Di(i,t,e):((r,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function k(i){return S({...i,state:!0,attribute:!1})}var qi=Object.defineProperty,Gr=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&qi(t,e,s),s};const Ae=class Ae extends C{constructor(){super(...arguments),this._authObserver=new T(this,"splitroom:auth"),this.loggedIn=!1,this.onThemeChange=t=>{const e=t.target.checked;this.dispatchEvent(new CustomEvent("darkmode:toggle",{bubbles:!0,composed:!0,detail:{checked:e}}))}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t;e&&e.authenticated?(this.loggedIn=!0,this.userid=e.username):(this.loggedIn=!1,this.userid=void 0)})}renderSignOutButton(){return y`
      <button
        @click=${t=>{fs.relay(t,"auth:message",["auth/signout"])}}
      >
        Sign Out
      </button>
    `}renderSignInButton(){return y`<a href="/login">Sign In</a>`}render(){return y`
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
    `}};Ae.styles=N`
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
  `;let _t=Ae;Gr([k()],_t.prototype,"loggedIn");Gr([k()],_t.prototype,"userid");const Fi=N`
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
`,Bi={styles:Fi};var Vi=Object.defineProperty,Et=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Vi(t,e,s),s};const Ee=class Ee extends C{constructor(){super(...arguments),this.from="",this.to="",this.amount="",this.href="",this.status="open"}render(){const t=this.status==="paid",e=Number(this.amount),r=Number.isFinite(e)?e:0;return y`
      <article class="ticket card ${t?"paid":"open"}">
        <div class="line">
          <span class="names">${this.from} -> ${this.to}</span>
          <span class="action">
            <slot>Details</slot>
          </span>
        </div>
        <div class="line">
          <span class="amount">$${r.toFixed(2)}</span>
          <span class="status">${t?"Paid":"Open"}</span>
        </div>
      </article>
    `}};Ee.styles=[Bi.styles,N`
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
        color: var(--color-text);
      }
    `];let M=Ee;Et([S()],M.prototype,"from");Et([S()],M.prototype,"to");Et([S()],M.prototype,"amount");Et([S()],M.prototype,"href");Et([S()],M.prototype,"status");var Wi=Object.defineProperty,Ji=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Wi(t,e,s),s};const Se=class Se extends Ft{constructor(){super("splitroom:model"),this._auth=new T(this,"splitroom:auth")}connectedCallback(){super.connectedCallback(),this._auth.observe(t=>{t.user?.authenticated&&this.dispatchMessage(["tickets/load",{userId:this.userId}])})}renderTicket(t){t.id??t._id?.toString?.();const e=Number(t.amount??0),r=Number.isFinite(e)?e:0;return E`
      <li>
        <article class="ticket-card">
          <div class="line">
            <span class="names">${t.from} -> ${t.to}</span>
            <span class="status">${t.status==="paid"?"Paid":"Open"}</span>
          </div>
          <div class="line">
            <span class="amount">$${r.toFixed(2)}</span>
            <span>${t.label??"Ticket"}</span>
          </div>
        </article>
      </li>
    `}render(){const t=this.model?.tickets??[],e=this.model?.loading??!1,r=this.model?.error;return e?E`<p class="muted">Loading tickets...</p>`:r?E`<p class="error">Failed to load tickets: ${r}</p>`:t.length?E`<ul>${t.map(s=>this.renderTicket(s))}</ul>`:E`<p class="muted">No tickets yet.</p>`}};Se.styles=Ht`
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
    .ticket-card {
      background: var(--color-card-bg);
      border: var(--border-1);
      border-radius: var(--radius-1);
      padding: var(--space-2) var(--space-3);
      color: var(--color-text);
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
  `;let It=Se;Ji([S({attribute:"user-id"})],It.prototype,"userId");var Yi=Object.defineProperty,Wt=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Yi(t,e,s),s};const ke=class ke extends C{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return y`
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
    `}handleChange(t){const e=t.target;if(!e)return;const{name:r,value:s}=e,n=this.formData;r==="username"&&(this.formData={...n,username:s}),r==="password"&&(this.formData={...n,password:s})}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw new Error("Login failed");return e.json()}).then(e=>{const r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:e.token,redirect:this.redirect}]});this.dispatchEvent(r)}).catch(e=>{this.error=String(e)})}};ke.styles=N`
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
  `;let W=ke;Wt([k()],W.prototype,"formData");Wt([S()],W.prototype,"api");Wt([S()],W.prototype,"redirect");Wt([k()],W.prototype,"error");function Ki(i,t,e){const[r]=i;switch(r){case"tickets/load":{const[,s]=i;return[{...t,loading:!0,error:void 0},Gi(e,s)]}case"tickets/loaded":{const[,s]=i;return{...t,loading:!1,tickets:s??[]}}case"ticket/save":{const[,s,n]=i;return[{...t,loading:!0,error:void 0},tn(s,e,n)]}case"ticket/create":{const[,s,n]=i;return[{...t,loading:!0,error:void 0},en(s,e,n)]}case"ticket/delete":{const[,s,n]=i;return[{...t,loading:!0,error:void 0},rn(s,e,n)]}case"ticket/request":{const[,s]=i;return[{...t,loading:!0,error:void 0},Zi(s,e)]}case"ticket/load":{const[,{ticket:s}]=i;return{...t,loading:!1,ticket:s}}case"tickets/error":{const[,s]=i;return{...t,loading:!1,error:s}}case"profile/save":{const[,s,n]=i;return[{...t,loading:!0,error:void 0},Xi(s,e,n)]}case"profile/request":{const[,s]=i;return t.profile&&t.profile.username===s.userid?t:[{...t,loading:!0,error:void 0},Qi(s,e)]}case"profile/load":{const[,{profile:s}]=i;return{...t,loading:!1,profile:s}}case"profile/error":{const[,s]=i;return{...t,loading:!1,error:s}}default:{const s=r;throw new Error(`Unhandled message "${s}"`)}}}function Gi(i,t){const e=new URL("/api/tickets",window.location.origin);return t?.userId&&e.searchParams.set("user",t.userId),fetch(e.toString(),{headers:j.headers(i)}).then(r=>r.ok?r.json():Promise.reject(`${r.status} ${r.statusText}`)).then(r=>["tickets/loaded",r.map(s=>({...s,id:s.id??s._id?.toString?.()}))]).catch(r=>["tickets/error",String(r)])}function Zi(i,t){return fetch(`/api/tickets/${i.ticketid}`,{headers:j.headers(t)}).then(e=>e.ok?e.json():Promise.reject(`${e.status} ${e.statusText}`)).then(e=>["ticket/load",{ticket:{...e,id:e.id??e._id?.toString?.()}}]).catch(e=>["tickets/error",String(e)])}function Qi(i,t){return fetch(`/api/travelers/${i.userid}`,{headers:j.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error("No Response from server")}).then(e=>{if(e)return e;throw new Error("No JSON in response from server")}).then(e=>["profile/load",{userid:i.userid,profile:e}]).catch(e=>["profile/error",String(e)])}function Xi(i,t,e){return fetch(`/api/travelers/${i.userid}`,{method:"PUT",headers:{"Content-Type":"application/json",...j.headers(t)},body:JSON.stringify(i.profile)}).then(r=>{if(r.status===200)return r.json();throw new Error(`Failed to save profile for ${i.userid}`)}).then(r=>{if(r)return e?.onSuccess?.(),r;throw new Error("No JSON in API response")}).then(r=>["profile/load",{userid:i.userid,profile:r}]).catch(r=>{const s=r instanceof Error?r:new Error(String(r));return e?.onFailure?.(s),["profile/error",String(s)]})}function tn(i,t,e){return fetch(`/api/tickets/${i.ticketid}`,{method:"PUT",headers:{...j.headers(t),"Content-Type":"application/json"},body:JSON.stringify(i.ticket)}).then(r=>r.ok?r.json():Promise.reject(new Error(`${r.status} ${r.statusText}`))).then(r=>(e?.onSuccess?.(),["ticket/load",{ticket:r}])).catch(r=>{const s=r instanceof Error?r:new Error(String(r));return e?.onFailure?.(s),["tickets/error",String(s)]})}function en(i,t,e){return fetch("/api/tickets",{method:"POST",headers:{...j.headers(t),"Content-Type":"application/json"},body:JSON.stringify(i.ticket)}).then(r=>r.ok?r.json():Promise.reject(new Error(`${r.status} ${r.statusText}`))).then(r=>(e?.onSuccess?.(),["tickets/load",{}])).catch(r=>{const s=r instanceof Error?r:new Error(String(r));return e?.onFailure?.(s),["tickets/error",String(s)]})}function rn(i,t,e){return fetch(`/api/tickets/${i.ticketid}`,{method:"DELETE",headers:j.headers(t)}).then(r=>{if(r.status===204||r.ok)return!0;throw new Error(`${r.status} ${r.statusText}`)}).then(()=>(e?.onSuccess?.(),["tickets/load",{}])).catch(r=>{const s=r instanceof Error?r:new Error(String(r));return e?.onFailure?.(s),["tickets/error",String(s)]})}const sn={tickets:[],loading:!1,error:void 0};class nn extends As.Provider{constructor(){super(Ki,sn,"splitroom:auth")}}var on=Object.defineProperty,I=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&on(t,e,s),s};const Pe=class Pe extends Ft{constructor(){super("splitroom:model"),this.merchant="Taqueria El Sol",this.payer="Alex",this.splitWith="Sam, Jordan",this.items="8.95, 4.00",this.tax="1.16",this.tip="2.00"}render(){return y`
      <div class="title">
        <p class="back-link">
          <a href="/app/groups">
            <svg class="icon">
              <use href="/icons/receipt.svg#icon-back" />
            </svg>
            Back to Group
          </a>
        </p>
      </div>

      <main class="page">
        <section class="card">
          <h1>
            <svg class="icon">
              <use href="/icons/receipt.svg#icon-receipt" />
            </svg>
            Add Receipt
          </h1>

          <form @submit=${this.handleSubmit}>
            <label>
              <span>Merchant</span>
              <input
                name="merchant"
                .value=${this.merchant}
                @input=${t=>this.merchant=t.target.value}
                required
              />
            </label>

            <label>
              <span>Payer</span>
              <input
                name="payer"
                .value=${this.payer}
                @input=${t=>this.payer=t.target.value}
                required
              />
            </label>

            <label>
              <span>Split with (comma-separated)</span>
              <input
                name="splitWith"
                .value=${this.splitWith}
                @input=${t=>this.splitWith=t.target.value}
                required
              />
            </label>

            <label>
              <span>Item prices (comma-separated)</span>
              <input
                name="items"
                .value=${this.items}
                @input=${t=>this.items=t.target.value}
                required
              />
            </label>

            <label>
              <span>Tax</span>
              <input
                name="tax"
                type="number"
                step="0.01"
                .value=${this.tax}
                @input=${t=>this.tax=t.target.value}
              />
            </label>

            <label>
              <span>Tip</span>
              <input
                name="tip"
                type="number"
                step="0.01"
                .value=${this.tip}
                @input=${t=>this.tip=t.target.value}
              />
            </label>

            <button type="submit">Create Ticket</button>

            ${this.error?y`<p class="error">${this.error}</p>`:null}

            ${this.preview?y`<div class="preview card rule-top">
                  <h3>Preview</h3>
                  <p>
                    ${this.preview.from} owe ${this.preview.to}
                    $${this.preview.owed.toFixed(2)} (total $${this.preview.total.toFixed(2)})
                  </p>
                </div>`:null}
          </form>
        </section>
      </main>
    `}handleSubmit(t){t.preventDefault();const e=this.parseNumbers(this.items),r=Number(this.tax)||0,s=Number(this.tip)||0;if(!e.length){this.error="Please enter at least one item price.";return}const o=e.reduce((g,m)=>g+m,0)+r+s,c=this.parseNames(this.splitWith),a=this.payer.trim(),d=a?[a,...c]:c;if(!d.length||!a){this.error="Enter a payer and at least one other person to split with.";return}const f=o/d.length,u=o-f,l=c.join(", "),h=a;this.preview={total:o,owed:u,to:h,from:l},this.error=void 0;const p={from:l,to:h,amount:u.toFixed(2),status:"open",label:this.merchant||"Receipt"};this.dispatchMessage(["ticket/create",{ticket:p},{onSuccess:()=>{this.dispatchMessage(["tickets/load",{}]),de.dispatch(this,"history/navigate",{href:"/app/groups"})},onFailure:g=>{this.error=String(g)}}])}parseNumbers(t){return t.split(",").map(e=>Number(e.trim())).filter(e=>!Number.isNaN(e)&&Number.isFinite(e))}parseNames(t){return t.split(",").map(e=>e.trim()).filter(Boolean)}};Pe.styles=N`
    :host {
      display: block;
      background-color: var(--color-bg-page);
      color: var(--color-text);
      font-family: var(--font-family-body);
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
    form {
      display: grid;
      gap: var(--space-3);
    }
    label {
      display: grid;
      gap: 0.35rem;
    }
    input,
    textarea {
      padding: 0.5rem 0.6rem;
      border: var(--border-1);
      border-radius: var(--radius-1);
      background: var(--color-card-bg);
      color: var(--color-text);
      font: inherit;
    }
    textarea {
      min-height: 5rem;
    }
    button {
      padding: 0.6rem 1rem;
      border-radius: var(--radius-1);
      border: none;
      background: var(--color-accent);
      color: var(--color-bg-page);
      font-weight: 700;
      cursor: pointer;
    }
    .error {
      color: var(--color-error, #b00020);
      border: 1px solid var(--color-error, #b00020);
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-1);
      background: color-mix(in srgb, var(--color-error, #b00020) 12%, transparent);
    }
    .preview {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .back-link {
      margin-bottom: var(--space-3);
      display: inline-block;
    }
  `;let P=Pe;I([k()],P.prototype,"merchant");I([k()],P.prototype,"payer");I([k()],P.prototype,"splitWith");I([k()],P.prototype,"items");I([k()],P.prototype,"tax");I([k()],P.prototype,"tip");I([k()],P.prototype,"error");I([k()],P.prototype,"preview");var an=Object.defineProperty,cn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&an(t,e,s),s};const Ce=class Ce extends C{render(){return y`
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
    `}};Ce.styles=N`
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
  `;let $t=Ce;cn([S({attribute:"user-id"})],$t.prototype,"userId");customElements.define("home-view",$t);var ln=Object.defineProperty,hn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&ln(t,e,s),s};const Oe=class Oe extends C{constructor(){super(...arguments),this._auth=new T(this,"splitroom:auth")}connectedCallback(){super.connectedCallback(),this._auth.observe(t=>this._user=t.user)}get authorization(){return this._user?.authenticated&&{Authorization:`Bearer ${this._user.token}`}}render(){return y`
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
              <li>Alex</li>
              <li>Sam</li>
              <li>Jordan</li>
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
              <a href="/app/receipt">
                <svg class="icon">
                  <use href="/icons/receipt.svg#icon-plus" />
                </svg>
                Add a receipt
              </a>
            </p>
            <ul>
              <li><a href="/app/receipt">Receipt — Taqueria El Sol</a></li>
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
    `}};Oe.styles=N`
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
  `;let wt=Oe;hn([S({attribute:"user-id"})],wt.prototype,"userId");customElements.define("groups-view",wt);var un=Object.defineProperty,dn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&un(t,e,s),s};const zt=class zt extends Ft{constructor(){super("splitroom:model"),this._auth=new T(this,"splitroom:auth"),this._authenticated=!1}connectedCallback(){super.connectedCallback(),this._auth.observe(t=>{this._authenticated=!!t.user?.authenticated,this._authenticated&&this.ticketId&&this.dispatchMessage(["ticket/request",{ticketid:this.ticketId}])})}attributeChangedCallback(t,e,r){super.attributeChangedCallback(t,e,r),t==="ticket-id"&&r&&r!==e&&this._authenticated&&this.dispatchMessage(["ticket/request",{ticketid:r}])}render(){const{ticket:t,loading:e,error:r}=this.model??{};if(e)return y`<p class="card">Loading...</p>`;if(r)return y`<p class="card">Failed to load: ${r}</p>`;const s=t;return s?y`
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
            <p>
              <strong
                >${s.from} -> ${s.to}: $${Number(s.amount??0).toFixed(2)}</strong
              >
            </p>
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
            <mu-form
              .init=${{status:s.status,label:s.label}}
              @mu-form:submit=${this.handleSubmit}
            >
              <label class="field">
                <span>Label</span>
                <input
                  type="text"
                  name="label"
                  placeholder="Add a short note"
                />
              </label>

              <label class="field">
                <span>Status</span>
                <select name="status">
                  <option value="open">Open</option>
                  <option value="paid">Paid</option>
                </select>
              </label>

              <div class="actions">
                <button type="submit">Save Ticket</button>
              </div>
            </mu-form>
          </section>
        </div>
      </main>
    `:y`<p class="card">No ticket loaded.</p>`}handleSubmit(t){this.ticketId&&this.dispatchMessage(["ticket/save",{ticketid:this.ticketId,ticket:t.detail},{onSuccess:()=>de.dispatch(this,"history/navigate",{href:"/app/groups"}),onFailure:e=>console.error("Failed to save ticket",e)}])}};zt.uses=Br({"mu-form":ys.Element}),zt.styles=N`
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

    mu-form {
      display: grid;
      gap: var(--space-2);
      max-width: 24rem;
      margin-top: var(--space-2);
    }

    .field {
      display: grid;
      gap: 0.25rem;
    }

    .field span {
      font-weight: 600;
      color: var(--color-muted, #6b7280);
    }

    .field input,
    .field select {
      padding: 0.5rem 0.6rem;
      border: var(--border-1);
      border-radius: var(--radius-1);
      background: var(--color-card-bg);
      color: var(--color-text);
      font: inherit;
    }

    .actions {
      display: flex;
      gap: var(--space-2);
      align-items: center;
    }

    button {
      padding: 0.6rem 1rem;
      border-radius: var(--radius-1);
      border: none;
      background: var(--color-accent);
      color: var(--color-bg-page);
      font-weight: 700;
      cursor: pointer;
    }

    button:hover {
      opacity: 0.95;
    }
  `;let Lt=zt;dn([S({attribute:"ticket-id"})],Lt.prototype,"ticketId");const Te=class Te extends C{render(){return y`
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
    `}};Te.styles=N`
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
  `;let ae=Te;const pn=[{path:"/app/groups",view:()=>y`<groups-view></groups-view>`},{path:"/app/receipt",view:()=>y`<receipt-view></receipt-view>`},{path:"/app/tickets/:id",view:i=>y`<ticket-view ticket-id=${i.id}></ticket-view>`},{path:"/app",view:()=>y`<home-view></home-view>`},{path:"/login",view:()=>y`<login-view></login-view>`},{path:"/login.html",redirect:"/login"},{path:"/",redirect:"/app"}];Br({"mu-auth":j.Provider,"mu-history":de.Provider,"mu-store":nn,"sr-header":_t,"login-form":W,"home-view":$t,"groups-view":wt,"ticket-view":Lt,"login-view":ae,"receipt-view":P,"sr-ticket":M,"sr-ticket-list":It,"mu-switch":class extends pi.Element{constructor(){super(pn,"splitroom:history","splitroom:auth")}}});const Zr="splitroom:darkmode",lr=localStorage.getItem(Zr);if(lr!==null){const i=lr==="true";document.body.classList.toggle("dark-mode",i);const t=document.querySelector("#theme-input");t&&(t.checked=i)}window.addEventListener("darkmode:toggle",i=>{const e=!!i.detail?.checked;document.body.classList.toggle("dark-mode",e),localStorage.setItem(Zr,String(e));const r=document.querySelector("#theme-input");r&&(r.checked=e)});
