import { Credential, Ticket } from "server/models";

type Cmd =
  | ["profile/load", { userid: string; profile: Credential }]
  | ["profile/error", string]
  | ["ticket/load", { ticket: Ticket }];

export type Msg =
  | ["profile/save", { userid: string; profile: Credential }]
  | ["profile/request", { userid: string }]
  | ["ticket/request", { ticketid: string }]
  | ["tickets/load", { userId?: string }]
  | ["tickets/loaded", Ticket[]]
  | ["tickets/error", string]
  | Cmd;
