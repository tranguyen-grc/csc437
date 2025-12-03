export type TicketStatus = "open" | "paid";

export interface Ticket {
  id?: string;        // Client-facing id (toJSON transform)
  _id?: string;       // Mongo ObjectId (server-side)
  from: string;
  to: string;
  amount: string;     // keep as string to match your JSON and current client code
  href?: string;
  status: TicketStatus;
  label?: string;     // present in your JSON
  createdAt?: Date;
  updatedAt?: Date;
}
