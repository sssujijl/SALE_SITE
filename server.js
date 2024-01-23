import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connect from "./schemas/index.js";
import ProductRouter from "./routes/products.router.js";

const app = express();

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

const router = express.Router();

app.get("/", (req, res) => {
  // return res.json({ message: "Hi!" });
  res.send("서버 접속 완료");
});

app.use("/api", [router, ProductRouter]);

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT} 에서 서버 실행중`);
});
