(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();var F,Pe;class at extends Error{}at.prototype.name="InvalidTokenError";function Ys(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Js(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Ys(t)}catch{return atob(t)}}function ss(i,t){if(typeof i!="string")throw new at("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new at(`Invalid token specified: missing part #${e+1}`);let r;try{r=Js(s)}catch(n){throw new at(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(r)}catch(n){throw new at(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Ks="mu:context",Kt=`${Ks}:change`;class Gs{constructor(t,e){this._proxy=Zs(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class rs extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Gs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Kt,t),t}detach(t){this.removeEventListener(Kt,t)}}function Zs(i,t){return new Proxy(i,{get:(s,r,n)=>r==="then"?void 0:Reflect.get(s,r,n),set:(s,r,n,o)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,n);const a=Reflect.set(s,r,n,o);if(a){let d=new CustomEvent(Kt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:r,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${r}] was not set to ${n}`);return a}})}function Qs(i,t){const e=is(t,i);return new Promise((s,r)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function is(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return is(i,r.host)}class Xs extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function ns(i="mu:message"){return(t,...e)=>t.dispatchEvent(new Xs(e,i))}class se{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${t[0]} message`,t);const e=this._update(t,this._context.value);if(console.log(`Next[${t[0]}] => `,e),!Array.isArray(e))this._context.value=e;else{const[s,...r]=e;this._context.value=s,r.forEach(n=>n.then(o=>{o.length&&this.consume(o)}))}}}const Gt="mu:auth:jwt",os=class as extends se{constructor(t,e){super((s,r)=>this.update(s,r),t,as.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":{const{token:r,redirect:n}=t[1];return[er(r),Wt(n)]}case"auth/signout":return[sr(e.user),Wt(this._redirectForLogin)];case"auth/redirect":return[e,Wt(this._redirectForLogin,{next:window.location.href})];default:const s=t[0];throw new Error(`Unhandled Auth message "${s}"`)}}};os.EVENT_TYPE="auth:message";let ls=os;const cs=ns(ls.EVENT_TYPE);function Wt(i,t){return new Promise((e,s)=>{if(i){const r=window.location.href,n=new URL(i,r);t&&Object.entries(t).forEach(([o,l])=>n.searchParams.set(o,l)),console.log("Redirecting to ",i),window.location.assign(n)}e([])})}class tr extends rs{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=G.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new ls(this.context,this.redirect).attach(this)}}class ht{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Gt),t}}class G extends ht{constructor(t){super();const e=ss(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new G(t);return localStorage.setItem(Gt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Gt);return t?G.authenticate(t):new ht}}function er(i){return{user:G.authenticate(i),token:i}}function sr(i){return{user:i&&i.authenticated?ht.deauthenticate(i):i,token:""}}function rr(i){return i&&i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function ir(i){return i.authenticated?ss(i.token||""):{}}const nr=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:G,Provider:tr,User:ht,dispatch:cs,headers:rr,payload:ir},Symbol.toStringTag,{value:"Module"}));function hs(i,t,e){const s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});i.dispatchEvent(s)}function Ct(i,t,e){const s=i.target;hs(s,t,e)}function Zt(i,t="*"){return i.composedPath().find(r=>{const n=r;return n.tagName&&n.matches(t)})||void 0}const or=Object.freeze(Object.defineProperty({__proto__:null,dispatchCustom:hs,originalTarget:Zt,relay:Ct},Symbol.toStringTag,{value:"Module"}));function re(i,...t){const e=i.map((r,n)=>n?[t[n-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const ar=new DOMParser;function I(i,...t){const e=t.map(l),s=i.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),r=ar.parseFromString(s,"text/html"),n=r.head.childElementCount?r.head.children:r.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u?.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Ce(a);case"bigint":case"boolean":case"number":case"symbol":return Ce(a.toString());case"object":if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return a instanceof Node?a:new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ce(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function zt(i,t={mode:"open"}){const e=i.attachShadow(t),s={template:r,styles:n};return s;function r(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}F=class extends HTMLElement{constructor(){super(),this._state={},zt(this).template(F.template).styles(F.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Ct(i,"mu-form:submit",this._state)}),this.submitSlot&&this.submitSlot.addEventListener("slotchange",()=>{var i,t;for(const e of((i=this.submitSlot)==null?void 0:i.assignedNodes())||[])(t=this.form)==null||t.insertBefore(e,this.submitSlot)})}set init(i){this._state=i||{},lr(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}get submitSlot(){var i;const t=(i=this.shadowRoot)==null?void 0:i.querySelector('slot[name="submit"]');return t||null}},F.template=I`
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
  `,F.styles=re`
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
  `;function lr(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;case"date":r instanceof Date?o.value=r.toISOString().substr(0,10):o.value=r;break;default:o.value=r;break}}}return i}const us=class ds extends se{constructor(t){super((e,s)=>this.update(e,s),t,ds.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];return hr(s,r)}case"history/redirect":{const{href:s,state:r}=t[1];return ur(s,r)}}}};us.EVENT_TYPE="history:message";let ie=us;class Oe extends rs{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=cr(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(!this._root||s.pathname.startsWith(this._root))&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ne(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ie(this.context).attach(this),this._root=this.getAttribute("root")||void 0}}function cr(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function hr(i,t={}){return history.pushState(t,"",i),{location:document.location,state:history.state}}function ur(i,t={}){return history.replaceState(t,"",i),{location:document.location,state:history.state}}const ne=ns(ie.EVENT_TYPE),dr=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Oe,Provider:Oe,Service:ie,dispatch:ne},Symbol.toStringTag,{value:"Module"}));class T{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new Te(this._provider,t);this._effects.push(r),e(r)}else Qs(this._target,this._contextLabel).then(r=>{const n=new Te(r,t);this._provider=r,this._effects.push(n),r.attach(o=>this._handleChange(o)),e(n)}).catch(r=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Te{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ps=class fs extends HTMLElement{constructor(){super(),this._state={},this._user=new ht,this._authObserver=new T(this,"blazing:auth"),zt(this).template(fs.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;pr(r,this._state,e,this.authorization).then(n=>rt(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:r}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},rt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Re(this.src,this.authorization).then(e=>{this._state=e,rt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Re(this.src,this.authorization).then(r=>{this._state=r,rt(r,this)});break;case"new":s&&(this._state={},rt({},this));break}}};ps.observedAttributes=["src","new","action"];ps.template=I`
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
  `;function Re(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function rt(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;default:o.value=r;break}}}return i}function pr(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const fr=class gs extends se{constructor(t,e){super(e,t,gs.EVENT_TYPE,!1)}};fr.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,oe=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ae=Symbol(),Ne=new WeakMap;let ms=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(oe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ne.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ne.set(e,t))}return t}toString(){return this.cssText}};const gr=i=>new ms(typeof i=="string"?i:i+"",void 0,ae),mr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new ms(e,i,ae)},vr=(i,t)=>{if(oe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=kt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ue=oe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return gr(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:yr,defineProperty:_r,getOwnPropertyDescriptor:$r,getOwnPropertyNames:br,getOwnPropertySymbols:wr,getPrototypeOf:Ar}=Object,Z=globalThis,Me=Z.trustedTypes,Er=Me?Me.emptyScript:"",ze=Z.reactiveElementPolyfillSupport,lt=(i,t)=>i,Ot={toAttribute(i,t){switch(t){case Boolean:i=i?Er:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},le=(i,t)=>!yr(i,t),je={attribute:!0,type:String,converter:Ot,reflect:!1,useDefault:!1,hasChanged:le};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Z.litPropertyMetadata??(Z.litPropertyMetadata=new WeakMap);let Y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=je){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&_r(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=$r(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){const l=r?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??je}static _$Ei(){if(this.hasOwnProperty(lt("elementProperties")))return;const t=Ar(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(lt("properties"))){const e=this.properties,s=[...br(e),...wr(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ue(r))}else t!==void 0&&e.push(Ue(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return vr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var s;const r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){const o=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Ot).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s,r;const n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const l=n.getPropertyOptions(o),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((s=l.converter)==null?void 0:s.fromAttribute)!==void 0?l.converter:Ot;this._$Em=o,this[o]=a.fromAttribute(e,l.type)??((r=this._$Ej)==null?void 0:r.get(o))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const n=this.constructor,o=this[t];if(s??(s=n.getPropertyOptions(t)),!((s.hasChanged??le)(o,e)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(s)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[lt("elementProperties")]=new Map,Y[lt("finalized")]=new Map,ze?.({ReactiveElement:Y}),(Z.reactiveElementVersions??(Z.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,Rt=Tt.trustedTypes,Le=Rt?Rt.createPolicy("lit-html",{createHTML:i=>i}):void 0,vs="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,ys="?"+C,xr=`<${ys}>`,H=document,ut=()=>H.createComment(""),dt=i=>i===null||typeof i!="object"&&typeof i!="function",ce=Array.isArray,Sr=i=>ce(i)||typeof i?.[Symbol.iterator]=="function",Yt=`[ 	
\f\r]`,it=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ie=/-->/g,He=/>/g,M=RegExp(`>|${Yt}(?:([^\\s"'>=/]+)(${Yt}*=${Yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),De=/'/g,Be=/"/g,_s=/^(?:script|style|textarea|title)$/i,kr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),nt=kr(1),Q=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),qe=new WeakMap,j=H.createTreeWalker(H,129);function $s(i,t){if(!ce(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Le!==void 0?Le.createHTML(t):t}const Pr=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=it;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===it?f[1]==="!--"?o=Ie:f[1]!==void 0?o=He:f[2]!==void 0?(_s.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=M):f[3]!==void 0&&(o=M):o===M?f[0]===">"?(o=r??it,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?M:f[3]==='"'?Be:De):o===Be||o===De?o=M:o===Ie||o===He?o=it:(o=M,r=void 0);const h=o===M&&i[l+1].startsWith("/>")?" ":"";n+=o===it?a+xr:u>=0?(s.push(d),a.slice(0,u)+vs+a.slice(u)+C+h):a+C+(u===-2?l:h)}return[$s(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let Qt=class bs{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Pr(t,e);if(this.el=bs.createElement(d,s),j.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=j.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(vs)){const c=f[o++],h=r.getAttribute(u).split(C),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Or:p[1]==="?"?Tr:p[1]==="@"?Rr:jt}),r.removeAttribute(u)}else u.startsWith(C)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(_s.test(r.tagName)){const u=r.textContent.split(C),c=u.length-1;if(c>0){r.textContent=Rt?Rt.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],ut()),j.nextNode(),a.push({type:2,index:++n});r.append(u[c],ut())}}}else if(r.nodeType===8)if(r.data===ys)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(C,u+1))!==-1;)a.push({type:7,index:n}),u+=C.length-1}n++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}};function X(i,t,e=i,s){var r,n;if(t===Q)return t;let o=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl;const l=dt(t)?void 0:t._$litDirective$;return o?.constructor!==l&&((n=o?._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=X(i,o._$AS(i,t.values),o,s)),t}let Cr=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??H).importNode(e,!0);j.currentNode=r;let n=j.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new he(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Nr(n,this,t)),this._$AV.push(d),a=s[++l]}o!==a?.index&&(n=j.nextNode(),o++)}return j.currentNode=H,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},he=class ws{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),dt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==Q&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Sr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&dt(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Qt.createElement($s(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Cr(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=qe.get(t.strings);return e===void 0&&qe.set(t.strings,e=new Qt(t)),e}k(t){ce(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new ws(this.O(ut()),this.O(ut()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},jt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=X(this,t,e,0),o=!dt(t)||t!==this._$AH&&t!==Q,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=X(this,l[s+a],e,a),d===Q&&(d=this._$AH[a]),o||(o=!dt(d)||d!==this._$AH[a]),d===_?t=_:t!==_&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!r&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Or=class extends jt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}},Tr=class extends jt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}},Rr=class extends jt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??_)===Q)return;const s=this._$AH,r=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==_&&(s===_||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},Nr=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}};const Ve=Tt.litHtmlPolyfillSupport;Ve?.(Qt,he),(Tt.litHtmlVersions??(Tt.litHtmlVersions=[])).push("3.3.0");const Ur=(i,t,e)=>{const s=e?.renderBefore??t;let r=s._$litPart$;if(r===void 0){const n=e?.renderBefore??null;s._$litPart$=r=new he(t.insertBefore(ut(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pt=globalThis;let K=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ur(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Q}};K._$litElement$=!0,K.finalized=!0,(Pe=pt.litElementHydrateSupport)==null||Pe.call(pt,{LitElement:K});const Fe=pt.litElementPolyfillSupport;Fe?.({LitElement:K});(pt.litElementVersions??(pt.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mr={attribute:!0,type:String,converter:Ot,reflect:!1,hasChanged:le},zr=(i=Mr,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function As(i){return(t,e)=>typeof e=="object"?zr(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Es(i){return As({...i,state:!0,attribute:!1})}function jr(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Lr(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var xs={};(function(i){var t=(function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],r=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,m,g,v,Dt){var A=v.length-1;switch(g){case 1:return new m.Root({},[v[A-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[v[A-1],v[A]]);break;case 4:case 5:this.$=v[A];break;case 6:this.$=new m.Literal({value:v[A]});break;case 7:this.$=new m.Splat({name:v[A]});break;case 8:this.$=new m.Param({name:v[A]});break;case 9:this.$=new m.Optional({},[v[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(m,g){this.message=m,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],m=[null],g=[],v=this.table,Dt="",A=0,xe=0,qs=2,Se=1,Vs=g.slice.call(arguments,1),y=Object.create(this.lexer),N={yy:{}};for(var Bt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Bt)&&(N.yy[Bt]=this.yy[Bt]);y.setInput(c,N.yy),N.yy.lexer=y,N.yy.parser=this,typeof y.yylloc>"u"&&(y.yylloc={});var qt=y.yylloc;g.push(qt);var Fs=y.options&&y.options.ranges;typeof N.yy.parseError=="function"?this.parseError=N.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Ws=function(){var V;return V=y.lex()||Se,typeof V!="number"&&(V=h.symbols_[V]||V),V},w,U,E,Vt,q={},xt,k,ke,St;;){if(U=p[p.length-1],this.defaultActions[U]?E=this.defaultActions[U]:((w===null||typeof w>"u")&&(w=Ws()),E=v[U]&&v[U][w]),typeof E>"u"||!E.length||!E[0]){var Ft="";St=[];for(xt in v[U])this.terminals_[xt]&&xt>qs&&St.push("'"+this.terminals_[xt]+"'");y.showPosition?Ft="Parse error on line "+(A+1)+`:
`+y.showPosition()+`
Expecting `+St.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Ft="Parse error on line "+(A+1)+": Unexpected "+(w==Se?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Ft,{text:y.match,token:this.terminals_[w]||w,line:y.yylineno,loc:qt,expected:St})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+U+", token: "+w);switch(E[0]){case 1:p.push(w),m.push(y.yytext),g.push(y.yylloc),p.push(E[1]),w=null,xe=y.yyleng,Dt=y.yytext,A=y.yylineno,qt=y.yylloc;break;case 2:if(k=this.productions_[E[1]][1],q.$=m[m.length-k],q._$={first_line:g[g.length-(k||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(k||1)].first_column,last_column:g[g.length-1].last_column},Fs&&(q._$.range=[g[g.length-(k||1)].range[0],g[g.length-1].range[1]]),Vt=this.performAction.apply(q,[Dt,xe,A,N.yy,E[1],m,g].concat(Vs)),typeof Vt<"u")return Vt;k&&(p=p.slice(0,-1*k*2),m=m.slice(0,-1*k),g=g.slice(0,-1*k)),p.push(this.productions_[E[1]][0]),m.push(q.$),g.push(q._$),ke=v[p[p.length-2]][p[p.length-1]],p.push(ke);break;case 3:return!0}}return!0}},d=(function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===m.length?this.yylloc.first_column:0)+m[m.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,m,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),m=c[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in g)this[v]=g[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,m;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),v=0;v<g.length;v++)if(p=this._input.match(this.rules[g[v]]),p&&(!h||p[0].length>h[0].length)){if(h=p,m=v,this.options.backtrack_lexer){if(c=this.test_match(p,g[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[m]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,m,g){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u})();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f})();typeof Lr<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(xs);function W(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Ss={Root:W("Root"),Concat:W("Concat"),Literal:W("Literal"),Splat:W("Splat"),Param:W("Param"),Optional:W("Optional")},ks=xs.parser;ks.yy=Ss;var Ir=ks,Hr=Object.keys(Ss);function Dr(i){return Hr.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Ps=Dr,Br=Ps,qr=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Cs(i){this.captures=i.captures,this.re=i.re}Cs.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var Vr=Br({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(qr,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Cs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Fr=Vr,Wr=Ps,Yr=Wr({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),Jr=Yr,Kr=Ir,Gr=Fr,Zr=Jr;wt.prototype=Object.create(null);wt.prototype.match=function(i){var t=Gr.visit(this.ast),e=t.match(i);return e||!1};wt.prototype.reverse=function(i){return Zr.visit(this.ast,i)};function wt(i){var t;if(this?t=this:t=Object.create(wt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=Kr.parse(i),t}var Qr=wt,Xr=Qr,ti=Xr;const ei=jr(ti);var si=Object.defineProperty,Os=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&si(t,e,r),r};const Ts=class extends K{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>nt` <h1>Not Found</h1> `,this._cases=t.map(r=>({...r,route:new ei(r.path)})),this._historyObserver=new T(this,e),this._authObserver=new T(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),nt` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(cs(this,"auth/redirect"),nt` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):nt` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),nt` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:r}}}redirect(t){ne(this,"history/redirect",{href:t})}};Ts.styles=mr`
    :host,
    main {
      display: contents;
    }
  `;let Nt=Ts;Os([Es()],Nt.prototype,"_user");Os([Es()],Nt.prototype,"_match");const ri=Object.freeze(Object.defineProperty({__proto__:null,Element:Nt,Switch:Nt},Symbol.toStringTag,{value:"Module"})),Rs=class Xt extends HTMLElement{constructor(){if(super(),zt(this).template(Xt.template).styles(Xt.styles),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Rs.template=I` <template>
    <slot name="actuator"><button>Menu</button></slot>
    <div id="panel">
      <slot></slot>
    </div>
  </template>`;Rs.styles=re`
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
  `;const Ns=class te extends HTMLElement{constructor(){super(),this._array=[],zt(this).template(te.template).styles(te.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Us("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{Zt(t,"button.add")?Ct(t,"input-array:add"):Zt(t,"button.remove")&&Ct(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],ii(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Ns.template=I`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Ns.styles=re`
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
  `;function ii(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(Us(e)))}function Us(i,t){const e=i===void 0?I`<input />`:I`<input value="${i}" />`;return I`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function ni(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var oi=Object.defineProperty,ai=Object.getOwnPropertyDescriptor,li=(i,t,e,s)=>{for(var r=ai(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&oi(t,e,r),r};class ci extends K{constructor(t){super(),this._pending=[],this._observer=new T(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate(),this._lastModel=this._context.value;else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}li([As()],ci.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,ue=Pt.ShadowRoot&&(Pt.ShadyCSS===void 0||Pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,de=Symbol(),We=new WeakMap;let Ms=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==de)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ue&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=We.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&We.set(e,t))}return t}toString(){return this.cssText}};const hi=i=>new Ms(typeof i=="string"?i:i+"",void 0,de),P=(i,...t)=>{const e=i.length===1?i[0]:t.reduce(((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1]),i[0]);return new Ms(e,i,de)},ui=(i,t)=>{if(ue)i.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const e of t){const s=document.createElement("style"),r=Pt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ye=ue?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return hi(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:di,defineProperty:pi,getOwnPropertyDescriptor:fi,getOwnPropertyNames:gi,getOwnPropertySymbols:mi,getPrototypeOf:vi}=Object,Lt=globalThis,Je=Lt.trustedTypes,yi=Je?Je.emptyScript:"",_i=Lt.reactiveElementPolyfillSupport,ct=(i,t)=>i,Ut={toAttribute(i,t){switch(t){case Boolean:i=i?yi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},pe=(i,t)=>!di(i,t),Ke={attribute:!0,type:String,converter:Ut,reflect:!1,useDefault:!1,hasChanged:pe};Symbol.metadata??=Symbol("metadata"),Lt.litPropertyMetadata??=new WeakMap;let J=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ke){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&pi(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=fi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){const l=r?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ke}static _$Ei(){if(this.hasOwnProperty(ct("elementProperties")))return;const t=vi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ct("properties"))){const e=this.properties,s=[...gi(e),...mi(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ye(r))}else t!==void 0&&e.push(Ye(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ui(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const n=(s.converter?.toAttribute!==void 0?s.converter:Ut).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const n=s.getPropertyOptions(r),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Ut;this._$Em=r;const l=o.fromAttribute(e,n.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){const r=this.constructor,n=this[t];if(s??=r.getPropertyOptions(t),!((s.hasChanged??pe)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[r,n]of s){const{wrapped:o}=n,l=this[r];o!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,n,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((s=>s.hostUpdate?.())),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[ct("elementProperties")]=new Map,J[ct("finalized")]=new Map,_i?.({ReactiveElement:J}),(Lt.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const fe=globalThis,Mt=fe.trustedTypes,Ge=Mt?Mt.createPolicy("lit-html",{createHTML:i=>i}):void 0,zs="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,js="?"+O,$i=`<${js}>`,D=document,ft=()=>D.createComment(""),gt=i=>i===null||typeof i!="object"&&typeof i!="function",ge=Array.isArray,bi=i=>ge(i)||typeof i?.[Symbol.iterator]=="function",Jt=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ze=/-->/g,Qe=/>/g,z=RegExp(`>|${Jt}(?:([^\\s"'>=/]+)(${Jt}*=${Jt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xe=/'/g,ts=/"/g,Ls=/^(?:script|style|textarea|title)$/i,wi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),b=wi(1),tt=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),es=new WeakMap,L=D.createTreeWalker(D,129);function Is(i,t){if(!ge(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ge!==void 0?Ge.createHTML(t):t}const Ai=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=ot;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ot?f[1]==="!--"?o=Ze:f[1]!==void 0?o=Qe:f[2]!==void 0?(Ls.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=z):f[3]!==void 0&&(o=z):o===z?f[0]===">"?(o=r??ot,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?z:f[3]==='"'?ts:Xe):o===ts||o===Xe?o=z:o===Ze||o===Qe?o=ot:(o=z,r=void 0);const h=o===z&&i[l+1].startsWith("/>")?" ":"";n+=o===ot?a+$i:u>=0?(s.push(d),a.slice(0,u)+zs+a.slice(u)+O+h):a+O+(u===-2?l:h)}return[Is(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class mt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Ai(t,e);if(this.el=mt.createElement(d,s),L.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=L.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(zs)){const c=f[o++],h=r.getAttribute(u).split(O),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?xi:p[1]==="?"?Si:p[1]==="@"?ki:It}),r.removeAttribute(u)}else u.startsWith(O)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(Ls.test(r.tagName)){const u=r.textContent.split(O),c=u.length-1;if(c>0){r.textContent=Mt?Mt.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],ft()),L.nextNode(),a.push({type:2,index:++n});r.append(u[c],ft())}}}else if(r.nodeType===8)if(r.data===js)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(O,u+1))!==-1;)a.push({type:7,index:n}),u+=O.length-1}n++}}static createElement(t,e){const s=D.createElement("template");return s.innerHTML=t,s}}function et(i,t,e=i,s){if(t===tt)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl;const n=gt(t)?void 0:t._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=r:e._$Cl=r),r!==void 0&&(t=et(i,r._$AS(i,t.values),r,s)),t}class Ei{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??D).importNode(e,!0);L.currentNode=r;let n=L.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new At(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Pi(n,this,t)),this._$AV.push(d),a=s[++l]}o!==a?.index&&(n=L.nextNode(),o++)}return L.currentNode=D,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class At{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=et(this,t,e),gt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):bi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&gt(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=mt.createElement(Is(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{const n=new Ei(r,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=es.get(t.strings);return e===void 0&&es.set(t.strings,e=new mt(t)),e}k(t){ge(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new At(this.O(ft()),this.O(ft()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class It{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=et(this,t,e,0),o=!gt(t)||t!==this._$AH&&t!==tt,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=et(this,l[s+a],e,a),d===tt&&(d=this._$AH[a]),o||=!gt(d)||d!==this._$AH[a],d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!r&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class xi extends It{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Si extends It{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class ki extends It{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=et(this,t,e,0)??$)===tt)return;const s=this._$AH,r=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Pi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){et(this,t)}}const Ci=fe.litHtmlPolyfillSupport;Ci?.(mt,At),(fe.litHtmlVersions??=[]).push("3.3.1");const Oi=(i,t,e)=>{const s=e?.renderBefore??t;let r=s._$litPart$;if(r===void 0){const n=e?.renderBefore??null;s._$litPart$=r=new At(t.insertBefore(ft(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const me=globalThis;class x extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Oi(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return tt}}x._$litElement$=!0,x.finalized=!0,me.litElementHydrateSupport?.({LitElement:x});const Ti=me.litElementPolyfillSupport;Ti?.({LitElement:x});(me.litElementVersions??=[]).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ri={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:pe},Ni=(i=Ri,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function S(i){return(t,e)=>typeof e=="object"?Ni(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function st(i){return S({...i,state:!0,attribute:!1})}var Ui=Object.defineProperty,Hs=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Ui(t,e,r),r};const ve=class ve extends x{constructor(){super(...arguments),this._authObserver=new T(this,"splitroom:auth"),this.loggedIn=!1,this.onThemeChange=t=>{const e=t.target.checked;this.dispatchEvent(new CustomEvent("darkmode:toggle",{bubbles:!0,composed:!0,detail:{checked:e}}))}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t;e&&e.authenticated?(this.loggedIn=!0,this.userid=e.username):(this.loggedIn=!1,this.userid=void 0)})}renderSignOutButton(){return b`
      <button
        @click=${t=>{or.relay(t,"auth:message",["auth/signout"])}}
      >
        Sign Out
      </button>
    `}renderSignInButton(){return b`<a href="/login">Sign In</a>`}render(){return b`
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
    `}};ve.styles=P`
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
  `;let vt=ve;Hs([st()],vt.prototype,"loggedIn");Hs([st()],vt.prototype,"userid");const Mi=P`
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
`,zi={styles:Mi};var ji=Object.defineProperty,Et=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&ji(t,e,r),r};const ye=class ye extends x{constructor(){super(...arguments),this.from="",this.to="",this.amount="",this.href="",this.status="open"}render(){const t=this.status==="paid";return b`
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
    `}};ye.styles=[zi.styles,P`
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
    `];let R=ye;Et([S()],R.prototype,"from");Et([S()],R.prototype,"to");Et([S()],R.prototype,"amount");Et([S()],R.prototype,"href");Et([S()],R.prototype,"status");var Li=Object.defineProperty,Ds=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Li(t,e,r),r};const _e=class _e extends x{constructor(){super(...arguments),this.tickets=[],this._authObserver=new T(this,"splitroom:auth")}get authorization(){return this._user?.authenticated&&{Authorization:`Bearer ${this._user.token}`}}get src(){return"/api/tickets"}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this._user?.authenticated&&this.hydrate()})}updated(t){t.has("userId")&&this._user?.authenticated&&this.hydrate()}async hydrate(){try{const t={"Content-Type":"application/json",...this.authorization||{}};console.log("Fetching tickets from",this.src),console.log("Auth header going out:",t.Authorization);const e=await fetch(this.src,{headers:t});if(!e.ok)throw new Error(`${e.status} ${e.statusText}`);const s=await e.json();this.tickets=Array.isArray(s)?s:[s]}catch(t){console.error("Failed to load tickets:",t),this.tickets=[]}}renderTicket(t){return b`
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
    `}render(){return b`<ul>${this.tickets.map(t=>this.renderTicket(t))}</ul>`}};_e.styles=P`
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
  `;let yt=_e;Ds([S({attribute:"user-id"})],yt.prototype,"userId");Ds([st()],yt.prototype,"tickets");var Ii=Object.defineProperty,Ht=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Ii(t,e,r),r};const $e=class $e extends x{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return b`
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
    `}handleChange(t){const e=t.target;if(!e)return;const{name:s,value:r}=e,n=this.formData;s==="username"&&(this.formData={...n,username:r}),s==="password"&&(this.formData={...n,password:r})}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw new Error("Login failed");return e.json()}).then(e=>{const s=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:e.token,redirect:this.redirect}]});this.dispatchEvent(s)}).catch(e=>{this.error=String(e)})}};$e.styles=P`
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
  `;let B=$e;Ht([st()],B.prototype,"formData");Ht([S()],B.prototype,"api");Ht([S()],B.prototype,"redirect");Ht([st()],B.prototype,"error");var Hi=Object.defineProperty,Di=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Hi(t,e,r),r};const be=class be extends x{render(){return b`
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
    `}};be.styles=P`
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
  `;let _t=be;Di([S({attribute:"user-id"})],_t.prototype,"userId");customElements.define("home-view",_t);var Bi=Object.defineProperty,qi=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Bi(t,e,r),r};const we=class we extends x{constructor(){super(...arguments),this._auth=new T(this,"splitroom:auth")}connectedCallback(){super.connectedCallback(),this._auth.observe(t=>this._user=t.user)}get authorization(){return this._user?.authenticated&&{Authorization:`Bearer ${this._user.token}`}}render(){return b`
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
    `}};we.styles=P`
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
  `;let $t=we;qi([S({attribute:"user-id"})],$t.prototype,"userId");customElements.define("groups-view",$t);var Vi=Object.defineProperty,Bs=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Vi(t,e,r),r};const Ae=class Ae extends x{constructor(){super(...arguments),this._auth=new T(this,"splitroom:auth")}connectedCallback(){super.connectedCallback(),this._auth.observe(t=>{this._user=t.user,this.ticketId&&this.load(this.ticketId)})}get authorization(){return this._user?.authenticated&&{Authorization:`Bearer ${this._user.token}`}}async load(t){const e=await fetch(`/api/tickets/${t}`,{headers:this.authorization||{}});this.ticket=e.ok?await e.json():void 0}render(){return this.ticket?b`
      <main class="page">
      <div class="grid">
  
        <div class="title span-12">
          <p><a href="/app/groups">
            <svg class="icon">
              <use href="/icons/receipt.svg#icon-back" />
            </svg>
            Back to Group
          </a></p>
        </div>
      
        <section class="card span-12">
          <h1>
            <svg class="icon">
              <use href="/icons/receipt.svg#icon-trading" />
            </svg>
            Ticket
          </h1>
          <p><strong>Sam → Alex: $12.40</strong></p>
        </section>
      
        <section class="card rule-top span-12">
          <h2>Details</h2>
          <ul>
            <li><a href="/app/groups">
              <svg class="icon">
                <use href="/icons/receipt.svg#icon-receipt" />
              </svg>
              Receipt
            </a></li>
          </ul>
      
          <h3>Status</h3>
          <p>Open</p>
      
          <h3>Action</h3>
        </section>
      </div>
      
    </main>
    `:b`<p class="card">Loading…</p>`}};Ae.styles=P`
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
  `;let bt=Ae;Bs([S({attribute:"ticket-id"})],bt.prototype,"ticketId");Bs([st()],bt.prototype,"ticket");const Ee=class Ee extends x{render(){return b`
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
    `}};Ee.styles=P`
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
  `;let ee=Ee;const Fi=[{path:"/app/groups",view:()=>b`<groups-view></groups-view>`},{path:"/app/tickets/:id",view:i=>b`<ticket-view ticket-id=${i.id}></ticket-view>`},{path:"/app",view:()=>b`<home-view></home-view>`},{path:"/login",view:()=>b`<login-view></login-view>`},{path:"/login.html",redirect:"/login"},{path:"/",redirect:"/app"}];ni({"mu-auth":nr.Provider,"mu-history":dr.Provider,"sr-header":vt,"login-form":B,"home-view":_t,"groups-view":$t,"ticket-view":bt,"login-view":ee,"sr-ticket":R,"sr-ticket-list":yt,"mu-switch":class extends ri.Element{constructor(){super(Fi,"splitroom:history","splitroom:auth")}}});
