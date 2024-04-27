// index.js
import express from "express";
import bodyParser from "body-parser";
import { readingQR } from "./readingQR/index.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("gooo start your Challenges!!");
});

app.post("/challenges/reading_qr/solve", readingQR);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
