import { define, Auth, History, Switch } from "@calpoly/mustang";
import { html } from "lit";

// Your header component (copy your existing file into app/src/components/)
import { SrHeaderElement } from "./components/sr-header.ts";
import { SrTicketElement } from "./components/sr-ticket.ts";
import { SrTicketListElement } from "./components/sr-ticket-list.ts";

// Views (we’ll add stubs next)
import { HomeViewElement } from "./views/home-view.ts";
import { GroupsViewElement } from "./views/groups-view.ts";
import { TicketViewElement } from "./views/ticket-view.ts";

// 3) Routes: all under /app
const routes = [
  {
    path: "/app/groups",
    view: () => html`<groups-view></groups-view>`
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
    path: "/",
    redirect: "/app"
  }
];

// 1) Define custom elements used on index.html
define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "sr-header": SrHeaderElement,
  "home-view": HomeViewElement,
  "groups-view": GroupsViewElement,
  "ticket-view": TicketViewElement,
  "sr-ticket": SrTicketElement,
  "sr-ticket-list": SrTicketListElement,

  // 2) Configure the router
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "splitroom:history", "splitroom:auth");
    }
  }
});


