import { define, Auth, History, Switch } from "@calpoly/mustang";
import { html } from "lit";

// Your header component (copy your existing file into app/src/components/)
import { SrHeaderElement } from "./components/sr-header.ts";
import { SrTicketElement } from "./components/sr-ticket.ts";
import { SrTicketListElement } from "./components/sr-ticket-list.ts";
import { LoginFormElement } from "./auth/login-form.ts";
import { AppStore } from "./store.ts";
import { ProfileViewElement } from "./views/profile-view.ts";
import { ReceiptViewElement } from "./views/receipt-view.ts";
import { MemberViewElement } from "./views/member-view.ts";
import { ItemViewElement } from "./views/item-view.ts";
import { PriceViewElement } from "./views/price-view.ts";
import { DiscountViewElement } from "./views/discount-view.ts";
import { TaxViewElement } from "./views/tax-view.ts";
import { TipViewElement } from "./views/tip-view.ts";
import { TotalViewElement } from "./views/total-view.ts";

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
    path: "/app/member",
    view: () => html`<member-view></member-view>`
  },
  {
    path: "/app/item",
    view: () => html`<item-view></item-view>`
  },
  {
    path: "/app/price",
    view: () => html`<price-view></price-view>`
  },
  {
    path: "/app/discount",
    view: () => html`<discount-view></discount-view>`
  },
  {
    path: "/app/tax",
    view: () => html`<tax-view></tax-view>`
  },
  {
    path: "/app/tip",
    view: () => html`<tip-view></tip-view>`
  },
  {
    path: "/app/total",
    view: () => html`<total-view></total-view>`
  },
  {
    path: "/app/profile/:id",
    view: (params: Switch.Params) =>
      html`<profile-view user-id=${params.id}></profile-view>`
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
  "profile-view": ProfileViewElement,
  "receipt-view": ReceiptViewElement,
  "member-view": MemberViewElement,
  "item-view": ItemViewElement,
  "price-view": PriceViewElement,
  "discount-view": DiscountViewElement,
  "tax-view": TaxViewElement,
  "tip-view": TipViewElement,
  "total-view": TotalViewElement,
  "sr-ticket": SrTicketElement,
  "sr-ticket-list": SrTicketListElement,

  // 2) Configure the router
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "splitroom:history", "splitroom:auth");
    }
  }
});


