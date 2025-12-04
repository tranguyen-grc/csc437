import { Credential, Ticket } from "server/models";

export type Reactions = {
  onSuccess?: () => void;
  onFailure?: (err: Error) => void;
};

type Cmd =
  | ["profile/load", { userid: string; profile: Credential }]
  | ["profile/error", string]
  | ["ticket/load", { ticket: Ticket }];

export type Msg =
  | ["profile/save", { userid: string; profile: Credential }, Reactions?]
  | ["profile/request", { userid: string }]
  | ["ticket/create", { ticket: Partial<Ticket> }, Reactions?]
  | ["ticket/save", { ticketid: string; ticket: Partial<Ticket> }, Reactions?]
  | ["ticket/delete", { ticketid: string }, Reactions?]
  | ["ticket/request", { ticketid: string }]
  | ["tickets/load", { userId?: string }]
  | ["tickets/loaded", Ticket[]]
  | ["tickets/error", string]
  | Cmd;
