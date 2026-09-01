import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

const adapter = new PrismaPg();
const prisma = new PrismaClient({ adapter });
app.use(cors());
app.use(express.json());
async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log("PostgreSQL Connected");
  } catch (err) {
    console.log("PostgreSQL connection failed:", err.message);
  }
}

connectDatabase();
app.locals.db = prisma;
app.get("/", (req, res) => {
  res.send("Multi-Org Backend is running");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
