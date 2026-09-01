import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { prisma } from "./prisma.js";
import collegeDetailRoute from "./routes/collegeDetail.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

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

app.use("/", collegeDetailRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
