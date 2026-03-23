import { Router } from "express";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET;
const router = Router();

// POST: Login route
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Query the database to find the user by username
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        // No user found with the given username
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const user = results[0]; // Assuming `results` contains the user data

      // Directly compare the provided password with the stored password
      const match = compare(password, user.password);

      if (!match) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // If credentials are valid, generate a JWT token
      const token = jwt.sign(
        { username: user.username, id: user.id },
        JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );

      // Return the token in the response
      res.json({ token });
    },
  );
});

export default router;
