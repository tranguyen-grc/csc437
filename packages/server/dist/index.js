"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_express = __toESM(require("express"));
var import_mongo = require("./services/mongo");
var import_ticket_svc = __toESM(require("./services/ticket-svc"));
(0, import_mongo.connect)("SplitRoom");
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
app.use(import_express.default.static(staticDir));
app.get("/hello", (req, res) => {
  res.send("Hello, World");
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
app.get("/api/tickets", async (_req, res) => {
  const list = await import_ticket_svc.default.index();
  res.set("Content-Type", "application/json").send(JSON.stringify(list));
});
app.get("/api/tickets/:id", async (req, res) => {
  const t = await import_ticket_svc.default.get(req.params.id);
  if (!t) return res.status(404).send();
  res.set("Content-Type", "application/json").send(JSON.stringify(t));
});
app.post("/api/tickets", async (req, res) => {
  const created = await import_ticket_svc.default.create(req.body);
  res.status(201).json(created);
});
app.patch("/api/tickets/:id", async (req, res) => {
  const updated = await import_ticket_svc.default.update(req.params.id, req.body);
  if (!updated) return res.status(404).send();
  res.json(updated);
});
app.delete("/api/tickets/:id", async (req, res) => {
  const result = await import_ticket_svc.default.remove(req.params.id);
  res.json(result);
});
