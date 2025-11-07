// src/index.ts
import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Tickets from "./services/ticket-svc";

connect("SplitRoom");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// All tickets
app.get("/api/tickets", async (_req, res) => {
  const list = await Tickets.index();
  res.set("Content-Type", "application/json").send(JSON.stringify(list));
});

// One ticket by logical id
app.get("/api/tickets/:id", async (req, res) => {
  const t = await Tickets.get(req.params.id);
  if (!t) return res.status(404).send();
  res.set("Content-Type", "application/json").send(JSON.stringify(t));
});

app.post("/api/tickets", async (req, res) => {
  const created = await Tickets.create(req.body);
  res.status(201).json(created);
});

app.patch("/api/tickets/:id", async (req, res) => {
  const updated = await Tickets.update(req.params.id, req.body);
  if (!updated) return res.status(404).send();
  res.json(updated);
});

app.delete("/api/tickets/:id", async (req, res) => {
  const result = await Tickets.remove(req.params.id);
  res.json(result);
});