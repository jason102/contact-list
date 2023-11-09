import express from "express";
import cors from "cors";
import { setupDatabase } from "./db/db-connection";
import dotenv from "dotenv";
import { HttpResponseCodes } from "./utils";

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

    const selectResult = await db.query(
      "SELECT exists(SELECT 1 FROM contacts WHERE email = $1 OR phone = $2);",
      [email, phone]
    );

    const hasContact = selectResult.rows[0].exists;

    if (hasContact) {
      res
        .status(HttpResponseCodes.AlreadyExists)
        .json("Contact already exists");
    } else {
      const insertResult = await db.query(
        "INSERT INTO contacts(first_name, last_name, email, phone, notes) VALUES($1, $2, $3, $4, $5) RETURNING id;",
        [firstName, lastName, email, phone, notes]
      );

      const contactId = insertResult.rows[0].id;

      res
        .status(HttpResponseCodes.Created)
        .location(`/contact/${contactId}`)
        .json("Contact added");
    }
  } catch (e) {
    console.log(e);
    return res.status(HttpResponseCodes.BadRequest).json({ e });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Hola, Server listening on ${process.env.PORT}`);
});
