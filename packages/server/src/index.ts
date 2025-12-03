// src/index.ts
import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Tickets from "./services/ticket-svc";
import tickets from "./routes/tickets";
import auth, { authenticateUser } from "./routes/auth";
import fs from "node:fs/promises";
import path from "path";


connect("SplitRoom");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());

app.use("/auth", auth);
app.use("/api", authenticateUser);
app.use("/api/tickets", tickets);



app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});