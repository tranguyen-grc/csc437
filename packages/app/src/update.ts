import { Auth, ThenUpdate } from "@calpoly/mustang";
import { Credential, Ticket } from "server/models";
import { Msg } from "./messages";
import { Model } from "./model";

export default function update(
  message: Msg,
  model: Model,
  user: Auth.User
): Model | ThenUpdate<Model, Msg> {
  switch (message[0]) {
    case "tickets/load": {
      const [, params] = message;
      return [
        { ...model, loading: true, error: undefined },
        fetchTickets(user, params)
      ];
    }

    case "tickets/loaded": {
      const [, tickets] = message;
      return { ...model, loading: false, tickets: tickets ?? [] };
    }

    case "ticket/request": {
      const [, payload] = message;
      return [
        { ...model, loading: true, error: undefined },
        requestTicket(payload, user)
      ];
    }

    case "ticket/load": {
      const [, { ticket }] = message;
      return { ...model, loading: false, ticket };
    }

    case "tickets/error": {
      const [, error] = message;
      return { ...model, loading: false, error };
    }

    case "profile/request": {
      const [, payload] = message;
      if (model.profile && model.profile.username === payload.userid) return model;
      return [
        { ...model, loading: true, error: undefined },
        requestProfile(payload, user)
      ];
    }

    case "profile/load": {
      const [, { profile }] = message;
      return { ...model, loading: false, profile };
    }

    case "profile/error": {
      const [, error] = message;
      return { ...model, loading: false, error };
    }

    default:
      return model;
  }
}

function fetchTickets(
  user: Auth.User,
  opts?: { userId?: string }
): Promise<Msg> {
  const url = new URL("/api/tickets", window.location.origin);
  if (opts?.userId) url.searchParams.set("user", opts.userId);

  return fetch(url.toString(), { headers: Auth.headers(user) })
    .then((res) =>
      res.ok
        ? (res.json() as Promise<Ticket[]>)
        : Promise.reject(`${res.status} ${res.statusText}`)
    )
    .then((tickets) => ["tickets/loaded", tickets] as Msg)
    .catch((err) => ["tickets/error", String(err)] as Msg);
}

function requestTicket(
  payload: { ticketid: string },
  user: Auth.User
): Promise<Msg> {
  return fetch(`/api/tickets/${payload.ticketid}`, {
    headers: Auth.headers(user)
  })
    .then((res) =>
      res.ok
        ? (res.json() as Promise<Ticket>)
        : Promise.reject(`${res.status} ${res.statusText}`)
    )
    .then((ticket) => ["ticket/load", { ticket }] as Msg)
    .catch((err) => ["tickets/error", String(err)] as Msg);
}

function requestProfile(
  payload: { userid: string },
  user: Auth.User
): Promise<Msg> {
  return fetch(`/api/travelers/${payload.userid}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error("No Response from server");
    })
    .then((json: unknown) => {
      if (json) return json as Credential;
      throw new Error("No JSON in response from server");
    })
    .then((profile) => ["profile/load", { userid: payload.userid, profile }] as Msg)
    .catch((err) => ["profile/error", String(err)] as Msg);
}
