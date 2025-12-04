// src/services/ticket-svc.ts
import { Schema, model } from "mongoose";
import { Ticket } from "../models/ticket";

const TicketSchema = new Schema<Ticket>(
  {
    from:   { type: String, required: true, trim: true },
    to:     { type: String, required: true, trim: true },
    amount: { type: String, required: true, trim: true }, // string to match JSON
    href:   { type: String, trim: true },
    status: { type: String, enum: ["open", "paid"], default: "open" },
    label:  { type: String, trim: true }
  },
  {
    collection: "sr_tickets",
    timestamps: true
  }
);

// When returning JSON, expose "id" (string) instead of "_id"
TicketSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    return ret;
  }
});

const TicketModel = model<Ticket>("Ticket", TicketSchema);

function index(): Promise<Ticket[]> {
  return TicketModel.find().sort({ createdAt: -1 }).lean();
}

function get(id: string): Promise<Ticket | null> {
  return TicketModel.findById(id);
}

function create(data: Partial<Ticket>): Promise<Ticket> {const { from, to, amount, href, status, label } = data;
  return TicketModel.create({ from, to, amount: String(amount ?? ""), href, status, label })
    .then((doc) => doc.toJSON() as Ticket);
}

function update(id: string, patch: Partial<Ticket>): Promise<Ticket | null> {
  return TicketModel.findByIdAndUpdate(id, patch, { new: true }).lean();
}

function remove(id: string): Promise<{ deleted: boolean }> {
  return TicketModel.deleteOne({ _id: id }).then((r) => ({ deleted: r.deletedCount === 1 }));
}

export default { index, get, create, update, remove };
