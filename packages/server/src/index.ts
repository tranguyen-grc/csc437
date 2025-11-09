// src/index.ts
import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Tickets from "./services/ticket-svc";
import tickets from "./routes/tickets";
import auth, { authenticateUser } from "./routes/auth";


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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});