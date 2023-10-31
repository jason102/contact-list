import express from "express";
import cors from "cors";
import { setupDatabase } from "./db/db-connection";
import dotenv from "dotenv";

dotenv.config();
const db = setupDatabase();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hola, from My template ExpressJS with React-Vite" });
});

app.post("/addContact", async (req, res) => {
  try {
    const {
      body: { firstName, lastName, email, phone, notes },
    } = req;

    const result = await db.query(
      "SELECT exists(SELECT 1 FROM contacts WHERE email = $1 OR phone = $2);",
      [email, phone]
    );

    const hasContact = result.rows[0].exists;

    if (hasContact) {
      res.status(409).json("Contact already exists");
    } else {
      await db.query(
        "INSERT INTO contacts(first_name, last_name, email, phone, notes) VALUES($1, $2, $3, $4, $5);",
        [firstName, lastName, email, phone, notes]
      );

      res.status(200).json("New contact successfully added");
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Hola, Server listening on ${process.env.PORT}`);
});
