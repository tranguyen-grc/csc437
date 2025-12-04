import { define, Auth, History, Switch } from "@calpoly/mustang";
import { html } from "lit";

// Your header component (copy your existing file into app/src/components/)
import { SrHeaderElement } from "./components/sr-header.ts";
import { SrTicketElement } from "./components/sr-ticket.ts";
import { SrTicketListElement } from "./components/sr-ticket-list.ts";
import { LoginFormElement } from "./auth/login-form.ts";
import { AppStore } from "./store.ts";
import { ReceiptViewElement } from "./views/receipt-view.ts";

// Views (we’ll add stubs next)
import { HomeViewElement } from "./views/home-view.ts";
import { GroupsViewElement } from "./views/groups-view.ts";
import { TicketViewElement } from "./views/ticket-view.ts";
import { LoginViewElement } from "./views/login-view.ts";

// 3) Routes: all under /app
const routes = [
  {
    path: "/app/groups",
    view: () => html`<groups-view></groups-view>`
  },
  {
    path: "/app/receipt",
    view: () => html`<receipt-view></receipt-view>`
  },
  {
    path: "/app/tickets/:id",
    view: (params: Switch.Params) =>
      html`<ticket-view ticket-id=${params.id}></ticket-view>`
  },
  {
    path: "/app", // home
    view: () => html`<home-view></home-view>`
  },
  {
    path: "/login",
    view: () => html`<login-view></login-view>`
  },
  {
    path: "/login.html",
    redirect: "/login"
  },
  {
    path: "/",
    redirect: "/app"
  }
];

// 1) Define custom elements used on index.html
define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-store": AppStore,
  "sr-header": SrHeaderElement,
  "login-form": LoginFormElement,
  "home-view": HomeViewElement,
  "groups-view": GroupsViewElement,
  "ticket-view": TicketViewElement,
  "login-view": LoginViewElement,
  "receipt-view": ReceiptViewElement,
  "sr-ticket": SrTicketElement,
  "sr-ticket-list": SrTicketListElement,

  // 2) Configure the router
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "splitroom:history", "splitroom:auth");
    }
  }
});

// Dark mode toggle
const THEME_KEY = "splitroom:darkmode";
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme !== null) {
  const enable = savedTheme === "true";
  document.body.classList.toggle("dark-mode", enable);
  const input = document.querySelector<HTMLInputElement>("#theme-input");
  if (input) input.checked = enable;
}

window.addEventListener("darkmode:toggle", (event: Event) => {
  const checked = (event as CustomEvent<{ checked: boolean }>).detail?.checked;
  const enable = Boolean(checked);
  document.body.classList.toggle("dark-mode", enable);
  localStorage.setItem(THEME_KEY, String(enable));
  const input = document.querySelector<HTMLInputElement>("#theme-input");
  if (input) input.checked = enable;
});


