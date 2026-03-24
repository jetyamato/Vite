import { Router } from "express";
import db from "../db.js";

const router = Router();

// GET /departments - Fetch all departments
router.get("/", async (req, res) => {
  const query = "SELECT * FROM departments";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching departments:", err);
      return res.status(500).json({ error: "Failed to fetch departments" });
    }
    res.json(results); // Send departments data
  });
});

// POST /departments - Create a new department
router.post("/", async (req, res) => {
  const { name, description } = req.body;

  // SQL query to insert department into the database
  const query = "INSERT INTO departments (name, description) VALUES (?, ?)";
  db.query(query, [name, description], (err, results) => {
    if (err) {
      console.error("Error inserting department into database:", err);
      return res.status(500).json({ message: "Error inserting department" });
    }
    // Respond with the new department data
    res.status(201).json({
      department_id: results.insertId,
      name,
      description,
    });
  });
});

// GET /departments/:id - Fetch a specific department by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM departments WHERE department_id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching department:", err);
      return res.status(500).json({ error: "Failed to fetch department" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Department not found" });
    }
    res.json(results[0]); // Send the department data
  });
});

// PUT /departments/:id - Update a specific department by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  // SQL query to update the department in the database
  const query =
    "UPDATE departments SET name = ?, description = ? WHERE department_id = ?";
  db.query(query, [name, description, id], (err, results) => {
    if (err) {
      console.error("Error updating department in database:", err);
      return res.status(500).json({ message: "Error updating department" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Department not found" });
    }
    // Respond with the updated department data
    res.json({
      department_id: id,
      name,
      description,
    });
  });
});

// DELETE /departments/:id - Delete a specific department by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // SQL query to delete the department from the database
  const query = "DELETE FROM departments WHERE department_id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting department from database:", err);
      return res.status(500).json({ message: "Error deleting department" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Department not found" });
    }
    // Respond with a success message
    res.json({ message: "Department deleted successfully" });
  });
});

export default router;
