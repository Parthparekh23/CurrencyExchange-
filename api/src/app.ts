import "reflect-metadata";
import express = require("express");
const cors = require("cors");
import { Request, Response } from "express";
import { mainControllerMap } from "./utils/dependencies";

const app = express();
// Middleware to convert BigInt to strings in all JSON responses
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Adjust size as needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));
const port = process.env.PORT || 3000;

app.use("/api/main", mainControllerMap.getRouter());

app.get("/", (req: Request, res: Response) => {
	res.send("Version 1.3.0");
});

app.get("/health-check", (req: Request, res: Response) => {
	res.send("API Running");
});

app.listen(port, () => {
	console.log(`Server is running on port http://localhost:${port}`);
});
