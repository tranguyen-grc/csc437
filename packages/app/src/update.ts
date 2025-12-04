import { Auth, ThenUpdate } from "@calpoly/mustang";
import { Credential, Ticket } from "server/models";
import { Msg, Reactions } from "./messages";
import { Model } from "./model";

export default function update(
  message: Msg,
  model: Model,
  user: Auth.User
): Model | ThenUpdate<Model, Msg> {
  const [command] = message;

  switch (command) {
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

    case "ticket/save": {
      const [, payload, callbacks] = message;
      return [
        { ...model, loading: true, error: undefined },
        saveTicket(payload, user, callbacks)
      ];
    }

    case "ticket/create": {
      const [, payload, callbacks] = message;
      return [
        { ...model, loading: true, error: undefined },
        createTicket(payload, user, callbacks)
      ];
    }

    case "ticket/delete": {
      const [, payload, callbacks] = message;
      return [
        { ...model, loading: true, error: undefined },
        deleteTicket(payload, user, callbacks)
      ];
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

    case "profile/save": {
      const [, payload, callbacks] = message;
      return [
        { ...model, loading: true, error: undefined },
        saveProfile(payload, user, callbacks)
      ];
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

    default: {
      const unhandled: never = command;
      throw new Error(`Unhandled message "${unhandled}"`);
    }
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
    .then((tickets) =>
      [
        "tickets/loaded",
        tickets.map((t) => ({
          ...t,
          id: (t as any).id ?? (t as any)._id?.toString?.()
        }))
      ] as Msg
    )
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
    .then((ticket) => {
      const normalized = {
        ...ticket,
        id: (ticket as any).id ?? (ticket as any)._id?.toString?.()
      };
      return ["ticket/load", { ticket: normalized }] as Msg;
    })
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

function saveProfile(
  msg: { userid: string; profile: Credential },
  user: Auth.User,
  callbacks?: Reactions
): Promise<Msg> {
  return fetch(`/api/travelers/${msg.userid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(msg.profile)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error(`Failed to save profile for ${msg.userid}`);
    })
    .then((json: unknown) => {
      if (json) {
        callbacks?.onSuccess?.();
        return json as Credential;
      }
      throw new Error("No JSON in API response");
    })
    .then(
      (profile) =>
        ["profile/load", { userid: msg.userid, profile }] as Msg
    )
    .catch((err: unknown) => {
      const error = err instanceof Error ? err : new Error(String(err));
      callbacks?.onFailure?.(error);
      return ["profile/error", String(error)] as Msg;
    });
}

function saveTicket(
  payload: { ticketid: string; ticket: Partial<Ticket> },
  user: Auth.User,
  callbacks?: {
    onSuccess?: () => void;
    onFailure?: (err: Error) => void;
  }
): Promise<Msg> {
  return fetch(`/api/tickets/${payload.ticketid}`, {
    method: "PUT",
    headers: {
      ...Auth.headers(user),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload.ticket)
  })
    .then((res) =>
      res.ok
        ? (res.json() as Promise<Ticket>)
        : Promise.reject(new Error(`${res.status} ${res.statusText}`))
    )
    .then((ticket) => {
      callbacks?.onSuccess?.();
      return ["ticket/load", { ticket }] as Msg;
    })
    .catch((err: unknown) => {
      const error = err instanceof Error ? err : new Error(String(err));
      callbacks?.onFailure?.(error);
      return ["tickets/error", String(error)] as Msg;
    });
}

function createTicket(
  payload: { ticket: Partial<Ticket> },
  user: Auth.User,
  callbacks?: Reactions
): Promise<Msg> {
  return fetch("/api/tickets", {
    method: "POST",
    headers: {
      ...Auth.headers(user),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload.ticket)
  })
    .then((res) =>
      res.ok
        ? (res.json() as Promise<Ticket>)
        : Promise.reject(new Error(`${res.status} ${res.statusText}`))
    )
    .then((_ticket) => {
      callbacks?.onSuccess?.();
      return ["tickets/load", {}] as Msg;
    })
    .catch((err: unknown) => {
      const error = err instanceof Error ? err : new Error(String(err));
      callbacks?.onFailure?.(error);
      return ["tickets/error", String(error)] as Msg;
    });
}

function deleteTicket(
  payload: { ticketid: string },
  user: Auth.User,
  callbacks?: Reactions
): Promise<Msg> {
  return fetch(`/api/tickets/${payload.ticketid}`, {
    method: "DELETE",
    headers: Auth.headers(user)
  })
    .then((res) => {
      if (res.status === 204) return true;
      if (res.ok) return true;
      throw new Error(`${res.status} ${res.statusText}`);
    })
    .then(() => {
      callbacks?.onSuccess?.();
      return ["tickets/load", {}] as Msg;
    })
    .catch((err: unknown) => {
      const error = err instanceof Error ? err : new Error(String(err));
      callbacks?.onFailure?.(error);
      return ["tickets/error", String(error)] as Msg;
    });
}
