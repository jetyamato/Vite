import { Router } from "express";
import db from "../db.js";

const router = Router();

// GET /requisitions - Fetch all requisitions
router.get("/", async (req, res) => {
  const query = "SELECT * FROM job_requisitions";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching requisitions:", err);
      return res.status(500).json({ error: "Failed to fetch requisitions" });
    }
    res.json(results); // Send requisitions data
  });
});

// POST /requisitions - Create a new requisition
router.post("/", async (req, res) => {
  const { position_id, department_id, description } = req.body;

  // SQL query to insert requisition into the database
  const query =
    "INSERT INTO job_requisitions (position_id, department_id, description, status) VALUES (?, ?, ?, 'Open')";
  db.query(query, [position_id, department_id, description], (err, results) => {
    if (err) {
      console.error("Error inserting requisition into database:", err);
      return res.status(500).json({ message: "Error inserting requisition" });
    }
    // Respond with the new requisition data
    res.status(201).json({
      requisition_id: results.insertId,
      position_id,
      department_id,
      description,
      status: results.status,
      created_at: results.created_at,
    });
  });
});

// GET /requisitions/:id - Fetch a specific requisition by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM job_requisitions WHERE requisition_id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching requisition:", err);
      return res.status(500).json({ error: "Failed to fetch requisition" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Requisition not found" });
    }
    res.json(results[0]); // Send the requisition data
  });
});

// PUT /requisitions/:id - Update a specific requisition by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { position_id, department_id, description, status } = req.body;

  // SQL query to update the requisition in the database
  const query =
    "UPDATE job_requisitions SET position_id = ?, department_id = ?, description = ?, status = ? WHERE requisition_id = ?";
  db.query(
    query,
    [position_id, department_id, description, status, id],
    (err, results) => {
      if (err) {
        console.error("Error updating requisition in database:", err);
        return res.status(500).json({ message: "Error updating requisition" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Requisition not found" });
      }
      // Respond with the updated requisition data
      res.json({
        requisition_id: id,
        position_id,
        department_id,
        description,
        status: results.status,
      });
    },
  );
});

// DELETE /requisitions/:id - Delete a specific requisition by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // SQL query to delete the requisition from the database
  const query = "DELETE FROM job_requisitions WHERE requisition_id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting requisition from database:", err);
      return res.status(500).json({ message: "Error deleting requisition" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Requisition not found" });
    }
    // Respond with a success message
    res.json({ message: "Requisition deleted successfully" });
  });
});

export default router;
