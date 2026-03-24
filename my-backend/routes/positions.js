import { Router } from "express";
import db from "../db.js";

const router = Router();

// GET /positions - Fetch all positions
router.get("/", async (req, res) => {
  const query = "SELECT * FROM positions";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching positions:", err);
      return res.status(500).json({ error: "Failed to fetch positions" });
    }
    res.json(results); // Send positions data
  });
});

// POST /positions - Create a new position
router.post("/", async (req, res) => {
  const { title, description, department_id } = req.body;

  // SQL query to insert position into the database
  const query =
    "INSERT INTO positions (title, description, department_id) VALUES (?, ?, ?)";
  db.query(query, [title, description, department_id], (err, results) => {
    if (err) {
      console.error("Error inserting position into database:", err);
      return res.status(500).json({ message: "Error inserting position" });
    }
    // Respond with the new position data
    res.status(201).json({
      position_id: results.insertId,
      title,
      description,
      department_id,
    });
  });
});

// GET /positions/:id - Fetch a specific position by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM positions WHERE position_id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching position:", err);
      return res.status(500).json({ error: "Failed to fetch position" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Position not found" });
    }
    res.json(results[0]); // Send the position data
  });
});

// PUT /positions/:id - Update a specific position by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, department_id } = req.body;

  // SQL query to update the position in the database
  const query =
    "UPDATE positions SET title = ?, description = ?, department_id = ? WHERE position_id = ?";
  db.query(query, [title, description, department_id, id], (err, results) => {
    if (err) {
      console.error("Error updating position in database:", err);
      return res.status(500).json({ message: "Error updating position" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Position not found" });
    }
    // Respond with the updated position data
    res.json({
      position_id: id,
      title,
      description,
      department_id,
    });
  });
});

// DELETE /positions/:id - Delete a specific position by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // SQL query to delete the position from the database
  const query = "DELETE FROM positions WHERE position_id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting position from database:", err);
      return res.status(500).json({ message: "Error deleting position" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Position not found" });
    }
    // Respond with a success message
    res.json({ message: "Position deleted successfully" });
  });
});

export default router;
