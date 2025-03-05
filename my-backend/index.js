const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');


const app = express();
app.use(cors());
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: '', // replace with your MySQL password
  database: 'test' // replace with your database name
});

// Check MySQL connection
db.connect(err => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});

app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ error: 'Failed to fetch users' });
      }
      res.json(results); // Ensure you're sending a JSON response
    });
  });
  

// Route to update a user by ID
app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id; // Get user ID from the URL
    const { name, email } = req.body; // Get the updated user data from the body
  
    console.log(`Updating user with ID: ${userId}`);
    console.log(`New name: ${name}, New email: ${email}`);
  
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
  
    // SQL query to update user in the database
    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    db.query(query, [name, email, userId], (err, result) => {
      if (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ error: 'Failed to update user' });
      }
  
      if (result.affectedRows === 0) {
        console.log(`User with ID ${userId} not found.`);
        return res.status(404).json({ error: 'User not found' });
      }
  
      console.log(`User with ID ${userId} updated successfully.`);
      res.json({ message: 'User updated successfully' });
    });
  });
  

  // add user ---------------------------
// POST endpoint to add a user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;

  // SQL query to insert user into the database
  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';

  db.query(query, [name, email], (err, results) => {
    if (err) {
      console.error('Error inserting user into database:', err);
      return res.status(500).json({ message: 'Error inserting user' });
    }

    // Respond with the new user data
    res.status(201).json({
      id: results.insertId,
      name,
      email
    });
  });
});

  

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
