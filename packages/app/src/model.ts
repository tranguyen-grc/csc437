import { Credential, Ticket } from "server/models";

export interface Model {
  tickets: Ticket[];
  ticket?: Ticket;
  profile?: Credential;
  loading: boolean;
  error?: string;
}

export const init: Model = {
  tickets: [],
  loading: false,
  error: undefined
};
