"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var ticket_svc_exports = {};
__export(ticket_svc_exports, {
  default: () => ticket_svc_default
});
module.exports = __toCommonJS(ticket_svc_exports);
var import_mongoose = require("mongoose");
const TicketSchema = new import_mongoose.Schema(
  {
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    amount: { type: String, required: true, trim: true },
    // string to match JSON
    href: { type: String, trim: true },
    status: { type: String, enum: ["open", "paid"], default: "open" },
    label: { type: String, trim: true }
  },
  {
    collection: "sr_tickets",
    timestamps: true
  }
);
TicketSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    return ret;
  }
});
const TicketModel = (0, import_mongoose.model)("Ticket", TicketSchema);
function index() {
  return TicketModel.find().sort({ createdAt: -1 }).lean();
}
function get(id) {
  return TicketModel.findById(id).lean();
}
function create(data) {
  const { from, to, amount, href, status, label } = data;
  return TicketModel.create({ from, to, amount: String(amount ?? ""), href, status, label }).then((doc) => doc.toJSON());
}
function update(id, patch) {
  return TicketModel.findByIdAndUpdate(id, patch, { new: true }).lean();
}
function remove(id) {
  return TicketModel.deleteOne({ _id: id }).then((r) => ({ deleted: r.deletedCount === 1 }));
}
var ticket_svc_default = { index, get, create, update, remove };
