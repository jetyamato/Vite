import { Router } from "express";
import db from "../db.js";

const router = Router();

// GET: Fetch all users
router.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    res.json(results); // Send users data
  });
});

// POST: Add a new user
router.post("/", (req, res) => {
  const {
    fname,
    mname,
    lname,
    email,
    contact,
    address,
    birthday,
    username,
    password,
  } = req.body;

  // SQL query to insert user into the database
  const query =
    "INSERT INTO users (fname, mname, lname, email, contact, address, birthday, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [
      fname,
      mname,
      lname,
      email,
      contact,
      address,
      birthday,
      username,
      password,
    ],
    (err, results) => {
      if (err) {
        console.error("Error inserting user into database:", err);
        return res.status(500).json({ message: "Error inserting user" });
      }
      // Respond with the new user data
      res.status(201).json({
        id: results.insertId,
        fname,
        mname,
        lname,
        email,
        contact,
        address,
        birthday,
        username,
        password,
      });
    },
  );
});

// GET: Fetch logged-in user's profile (Protected)
router.get("/profile", (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = verify(token, "yourSecretKey");

    db.query(
      'SELECT CONCAT(fname, " ", mname, " ", lname) AS name, email FROM users WHERE id = ?',
      [decoded.id],
      (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length === 0)
          return res.status(404).json({ error: "User not found" });

        res.json(results[0]);
      },
    );
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// PUT: Deactivate user route
router.put("/:id/deactivate", (req, res) => {
  const userId = req.params.id; // Get the user ID from the route parameter
  const status = "INACTIVE"; // Set the status to 'deactivated'

  // SQL query to update the user status
  const query = "UPDATE users SET status = ? WHERE id = ?";

  db.query(query, [status, userId], (err, result) => {
    if (err) {
      console.error("Error deactivating user:", err);
      return res.status(500).json({ message: "Failed to deactivate user" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: `User with ID ${userId} deactivated successfully` });
  });
});

// PUT: Update user data
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  const query =
    "UPDATE users SET fname = ?, mname = ?, lname = ?, email = ?, birthday = ?, contact = ?, address = ?, username = ?, password = ?, status = ? WHERE id = ?";

  const values = [
    updatedData.fname,
    updatedData.mname,
    updatedData.lname,
    updatedData.email,
    updatedData.birthday,
    updatedData.contact,
    updatedData.address,
    updatedData.username,
    updatedData.password,
    updatedData.status,
    userId,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ message: "Failed to update user" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  });
});

// POST: Check if user exists based on barcode
router.post("/check", (req, res) => {
  const { barcode } = req.body;

  // Get the current date and time
  const now = new Date();

  // Format the time (12-hour format with AM/PM)
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'
  const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

  // Format the date in "YYYY-MM-DD" format
  const formattedDate = now.toISOString().split("T")[0];

  // Query to check if user exists based on barcode
  const query =
    'SELECT *, CONCAT(lname, ", ", fname) AS fullName FROM users WHERE barcode = ?';

  db.query(query, [barcode], (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ message: "Error querying database" });
    }

    if (results.length > 0) {
      const user = results[0]; // Get the user details from the result
      const userId = user.id; // Assuming `id` is the primary key
      const fullName = user.fullName; // Get the full name (concatenation of first and last name)

      // Insert the time and date into the timesheet for the found user
      const insertQuery =
        "INSERT INTO timesheet (user_id, barcode, time_in, date_in) VALUES (?, ?, ?, ?)";

      db.query(
        insertQuery,
        [userId, barcode, formattedTime, formattedDate],
        (insertErr) => {
          if (insertErr) {
            console.error("Error inserting into timesheet:", insertErr);
            return res
              .status(500)
              .json({ message: "Error inserting into timesheet" });
          }

          // Send a success response after insertion
          res.json({
            found: true,
            message: `User ${fullName} found and time recorded in timesheet`,
            fullName: fullName, // Include the full name in the response
          });
        },
      );
    } else {
      // If no user was found
      res.json({ found: false, message: "User not found" });
    }
  });
});

export default router;
