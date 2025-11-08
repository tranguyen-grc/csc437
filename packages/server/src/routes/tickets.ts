// src/routes/tickets.ts
import express, { Request, Response } from "express";
import Tickets from "../services/ticket-svc";
import { Ticket } from "../models/ticket";

const router = express.Router();

// router.get("/", async (_req: Request, res: Response) => {
//   try {
//     const list = await Tickets.index();
//     res.json(list);
//   } catch (err) {
//     res.status(500).send(String(err));
//   }
// });

router.get("/", (_, res: Response) => {
    Tickets.index()
    .then((list: Ticket[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
})


router.get("/:id", async (req: Request, res: Response) => {
  try {
    const t = await Tickets.get(req.params.id);
    if (!t) return res.status(404).end();
    res.json(t);
  } catch (err) {
    res.status(404).send(String(err));
  }
});


router.post("/", async (req: Request, res: Response) => {
  try {
    const payload: Partial<Ticket> = req.body;
    const created = await Tickets.create(payload as Ticket);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).send(String(err));
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updated = await Tickets.update(req.params.id, req.body);
    if (!updated) return res.status(404).end();
    res.json(updated);
  } catch (err) {
    res.status(400).send(String(err));
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Tickets.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(404).send(String(err));
  }
});

export default router;